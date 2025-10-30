# ==============================================================================
# Kubernetes Infrastructure Validation Script
# ==============================================================================
# Validates kind cluster, manifests, Helm charts, and deployments
# Usage: .\validate-k8s.ps1 [-Component <component>] [-Verbose]

[CmdletBinding()]
param(
    [Parameter()]
    [ValidateSet('All', 'Cluster', 'Manifests', 'Helm', 'Policies', 'Tenants', 'Monitoring')]
    [string]$Component = 'All',

    [Parameter()]
    [switch]$SkipClusterCheck
)

$ErrorActionPreference = 'Stop'
$script:Failures = @()

# Colors
function Write-ColorOutput {
    param(
        [Parameter(Mandatory)]
        [string]$Message,

        [Parameter()]
        [ValidateSet('Success', 'Info', 'Warning', 'Error')]
        [string]$Type = 'Info'
    )

    $color = switch ($Type) {
        'Success' { 'Green' }
        'Info' { 'Cyan' }
        'Warning' { 'Yellow' }
        'Error' { 'Red' }
    }

    Write-Host "[$Type] " -NoNewline -ForegroundColor $color
    Write-Host $Message
}

# Test kind cluster
function Test-KindCluster {
    Write-ColorOutput "Testing kind cluster..." -Type Info

    try {
        $cluster = kind get clusters 2>$null
        if ($LASTEXITCODE -ne 0 -or -not $cluster) {
            throw "No kind cluster found"
        }

        Write-ColorOutput "Found cluster: $cluster" -Type Success

        # Test kubectl connectivity
        $nodes = kubectl get nodes -o json | ConvertFrom-Json
        $readyNodes = ($nodes.items | Where-Object {
            $_.status.conditions | Where-Object { $_.type -eq 'Ready' -and $_.status -eq 'True' }
        }).Count

        Write-ColorOutput "Ready nodes: $readyNodes / $($nodes.items.Count)" -Type Success
        return $true
    }
    catch {
        Write-ColorOutput "Cluster test failed: $_" -Type Error
        $script:Failures += "Cluster: $_"
        return $false
    }
}

# Test Kubernetes manifests
function Test-K8sManifests {
    Write-ColorOutput "Validating Kubernetes manifests..." -Type Info

    $manifestDirs = @(
        'k8s/base/databases',
        'k8s/base/apps',
        'k8s/base/cache',
        'k8s/base/monitoring',
        'k8s/policies'
    )

    foreach ($dir in $manifestDirs) {
        $path = Join-Path $PSScriptRoot $dir
        if (-not (Test-Path $path)) {
            Write-ColorOutput "Directory not found: $dir" -Type Warning
            continue
        }

        Write-Verbose "Checking $dir..."

        Get-ChildItem -Path $path -Filter *.yaml -Recurse | ForEach-Object {
            try {
                kubectl apply --dry-run=client -f $_.FullName | Out-Null
                if ($LASTEXITCODE -eq 0) {
                    Write-Verbose "  ✓ $($_.Name)"
                }
                else {
                    throw "Validation failed"
                }
            }
            catch {
                Write-ColorOutput "  ✗ $($_.Name): $_" -Type Error
                $script:Failures += "Manifest $($_.Name): $_"
            }
        }
    }

    if ($script:Failures.Count -eq 0) {
        Write-ColorOutput "All manifests validated successfully" -Type Success
        return $true
    }
    return $false
}

# Test Helm chart
function Test-HelmChart {
    Write-ColorOutput "Validating Helm chart..." -Type Info

    try {
        $chartPath = Join-Path $PSScriptRoot 'k8s\charts\react-scuba'

        # Lint chart
        helm lint $chartPath | Out-Null
        if ($LASTEXITCODE -ne 0) {
            throw "Helm lint failed"
        }

        # Dry-run template
        helm template test $chartPath --dry-run | Out-Null
        if ($LASTEXITCODE -ne 0) {
            throw "Helm template failed"
        }

        Write-ColorOutput "Helm chart validated successfully" -Type Success
        return $true
    }
    catch {
        Write-ColorOutput "Helm validation failed: $_" -Type Error
        $script:Failures += "Helm: $_"
        return $false
    }
}

# Test NetworkPolicies
function Test-NetworkPolicies {
    Write-ColorOutput "Validating NetworkPolicies..." -Type Info

    try {
        $policiesPath = Join-Path $PSScriptRoot 'k8s\policies'
        $policyFiles = Get-ChildItem -Path $policiesPath -Filter *.yaml

        if ($policyFiles.Count -lt 7) {
            throw "Expected 7 NetworkPolicy files, found $($policyFiles.Count)"
        }

        $requiredPolicies = @(
            '00-default-deny-ingress',
            '01-allow-all-egress',
            '02-tenant-isolation',
            '03-db-access',
            '04-cache-access',
            '05-monitoring-scrape',
            '06-ingress-allow'
        )

        foreach ($policy in $requiredPolicies) {
            $file = $policyFiles | Where-Object { $_.BaseName -eq $policy }
            if (-not $file) {
                throw "Missing required policy: $policy"
            }
            Write-Verbose "  ✓ $policy"
        }

        Write-ColorOutput "All NetworkPolicies validated" -Type Success
        return $true
    }
    catch {
        Write-ColorOutput "NetworkPolicy validation failed: $_" -Type Error
        $script:Failures += "NetworkPolicies: $_"
        return $false
    }
}

# Test tenant labels
function Test-TenantLabels {
    Write-ColorOutput "Validating tenant labels..." -Type Info

    try {
        if (-not $SkipClusterCheck) {
            $pods = kubectl get pods -A -o json | ConvertFrom-Json
            $podsWithTenantLabel = ($pods.items | Where-Object {
                $_.metadata.labels.tenant
            }).Count

            Write-ColorOutput "Pods with tenant label: $podsWithTenantLabel / $($pods.items.Count)" -Type Info
        }

        # Check tenant template
        $templatePath = Join-Path $PSScriptRoot 'k8s\tenants\.tenant-template'
        if (-not (Test-Path $templatePath)) {
            throw "Tenant template not found"
        }

        $requiredFiles = @(
            'README.md',
            'kustomization.yaml',
            'configmap-api.yaml',
            'configmap-web.yaml',
            'ingress.yaml'
        )

        foreach ($file in $requiredFiles) {
            $filePath = Join-Path $templatePath $file
            if (-not (Test-Path $filePath)) {
                throw "Missing template file: $file"
            }
            Write-Verbose "  ✓ $file"
        }

        Write-ColorOutput "Tenant configuration validated" -Type Success
        return $true
    }
    catch {
        Write-ColorOutput "Tenant validation failed: $_" -Type Error
        $script:Failures += "Tenants: $_"
        return $false
    }
}

# Test monitoring stack
function Test-Monitoring {
    Write-ColorOutput "Validating monitoring stack..." -Type Info

    try {
        $monitoringPath = Join-Path $PSScriptRoot 'k8s\base\monitoring'

        $requiredFiles = @(
            'prometheus.yaml',
            'grafana.yaml',
            'jaeger.yaml',
            'fluentbit-daemonset.yaml',
            'kustomization.yaml'
        )

        foreach ($file in $requiredFiles) {
            $filePath = Join-Path $monitoringPath $file
            if (-not (Test-Path $filePath)) {
                throw "Missing monitoring file: $file"
            }
            Write-Verbose "  ✓ $file"
        }

        # Check ServiceMonitors
        $serviceMonitorsPath = Join-Path $monitoringPath 'servicemonitors'
        $serviceMonitors = Get-ChildItem -Path $serviceMonitorsPath -Filter *.yaml

        if ($serviceMonitors.Count -lt 4) {
            Write-ColorOutput "Warning: Expected 4+ ServiceMonitors, found $($serviceMonitors.Count)" -Type Warning
        }

        Write-ColorOutput "Monitoring stack validated" -Type Success
        return $true
    }
    catch {
        Write-ColorOutput "Monitoring validation failed: $_" -Type Error
        $script:Failures += "Monitoring: $_"
        return $false
    }
}

# Main execution
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Kubernetes Infrastructure Validation" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$results = @{}

if ($Component -eq 'All' -or $Component -eq 'Cluster') {
    if (-not $SkipClusterCheck) {
        $results['Cluster'] = Test-KindCluster
    }
}

if ($Component -eq 'All' -or $Component -eq 'Manifests') {
    $results['Manifests'] = Test-K8sManifests
}

if ($Component -eq 'All' -or $Component -eq 'Helm') {
    $results['Helm'] = Test-HelmChart
}

if ($Component -eq 'All' -or $Component -eq 'Policies') {
    $results['Policies'] = Test-NetworkPolicies
}

if ($Component -eq 'All' -or $Component -eq 'Tenants') {
    $results['Tenants'] = Test-TenantLabels
}

if ($Component -eq 'All' -or $Component -eq 'Monitoring') {
    $results['Monitoring'] = Test-Monitoring
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Validation Summary" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$passed = ($results.Values | Where-Object { $_ -eq $true }).Count
$total = $results.Count

$results.GetEnumerator() | ForEach-Object {
    $status = if ($_.Value) { "✓ PASS" } else { "✗ FAIL" }
    $color = if ($_.Value) { 'Green' } else { 'Red' }
    Write-Host "$status - $($_.Key)" -ForegroundColor $color
}

Write-Host "`nPassed: $passed / $total" -ForegroundColor $(if ($passed -eq $total) { 'Green' } else { 'Yellow' })

if ($script:Failures.Count -gt 0) {
    Write-Host "`nFailures:" -ForegroundColor Red
    $script:Failures | ForEach-Object {
        Write-Host "  - $_" -ForegroundColor Red
    }
    exit 1
}

Write-ColorOutput "`nAll validations passed!" -Type Success
exit 0
