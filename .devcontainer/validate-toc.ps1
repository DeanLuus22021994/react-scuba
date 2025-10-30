# DevContainer TOC Validation Script
# Validates devcontainer-toc.yml structure and checks data consistency
# Uses native PowerShell YAML parsing (requires PowerShell-Yaml module)

param(
    [switch]$Verbose,
    [switch]$Json,
    [switch]$InstallDependencies
)

$ErrorActionPreference = "Stop"
$tocFile = Join-Path $PSScriptRoot "devcontainer-toc.yml"
$schemaFile = Join-Path $PSScriptRoot "devcontainer-toc.schema.json"

# ANSI colors
$colors = @{
    Reset = "`e[0m"
    Red = "`e[31m"
    Green = "`e[32m"
    Yellow = "`e[33m"
    Blue = "`e[34m"
    Cyan = "`e[36m"
}

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "Reset")
    Write-Host "$($colors[$Color])$Message$($colors.Reset)"
}

function Install-YamlModule {
    Write-ColorOutput "Installing PowerShell-Yaml module..." "Cyan"
    try {
        Install-Module -Name powershell-yaml -Force -Scope CurrentUser
        Write-ColorOutput "✓ PowerShell-Yaml module installed" "Green"
        return $true
    }
    catch {
        Write-ColorOutput "✗ Failed to install PowerShell-Yaml: $_" "Red"
        return $false
    }
}

function Test-YamlModule {
    try {
        Import-Module powershell-yaml -ErrorAction Stop
        return $true
    }
    catch {
        Write-ColorOutput "⚠ PowerShell-Yaml module not found" "Yellow"
        Write-ColorOutput "  Install: Install-Module -Name powershell-yaml -Force" "Cyan"
        Write-ColorOutput "  Or run: .\validate-toc.ps1 -InstallDependencies" "Cyan"
        return $false
    }
}

function Test-YamlSyntax {
    param([string]$FilePath)

    try {
        $content = Get-Content -Path $FilePath -Raw
        $data = ConvertFrom-Yaml -Yaml $content -ErrorAction Stop
        Write-ColorOutput "✓ YAML syntax valid" "Green"
        return $true, $data
    }
    catch {
        Write-ColorOutput "✗ YAML syntax error: $_" "Red"
        return $false, $null
    }
}

function Test-RequiredFields {
    param([hashtable]$Data)

    Write-ColorOutput "`nChecking required fields..." "Cyan"

    $checks = @()
    $requiredPaths = @(
        @{ Path = "metadata.version"; Name = "Metadata version" }
        @{ Path = "metadata.total_services"; Name = "Total services count" }
        @{ Path = "directory_structure.root"; Name = "Directory root" }
        @{ Path = "core_configuration.devcontainer"; Name = "DevContainer config" }
        @{ Path = "infrastructure_components.compose"; Name = "Compose configuration" }
        @{ Path = "network_architecture.ip_allocation"; Name = "IP allocation" }
        @{ Path = "volume_strategy.named_volumes"; Name = "Named volumes" }
        @{ Path = "service_health.health_checks"; Name = "Health checks" }
        @{ Path = "status.devcontainer_status"; Name = "DevContainer status" }
    )

    foreach ($item in $requiredPaths) {
        $path = $item.Path -split '\.'
        $value = $Data
        $found = $true

        foreach ($key in $path) {
            if ($value.ContainsKey($key)) {
                $value = $value[$key]
            }
            else {
                $found = $false
                break
            }
        }

        if ($found -and $null -ne $value) {
            $checks += @{ Name = $item.Name; Status = "PASS" }
        }
        else {
            $checks += @{ Name = $item.Name; Status = "FAIL"; Details = "Missing or null" }
        }
    }

    # Output results
    $passCount = ($checks | Where-Object { $_.Status -eq "PASS" }).Count
    $failCount = ($checks | Where-Object { $_.Status -eq "FAIL" }).Count

    foreach ($check in $checks) {
        $color = if ($check.Status -eq "PASS") { "Green" } else { "Red" }
        $symbol = if ($check.Status -eq "PASS") { "✓" } else { "✗" }
        $details = if ($check.Details) { " - $($check.Details)" } else { "" }
        Write-ColorOutput "$symbol $($check.Name)$details" $color
    }

    Write-ColorOutput "`n$passCount passed, $failCount failed" $(if ($failCount -eq 0) { "Green" } else { "Yellow" })
    return $failCount -eq 0
}

function Test-DataConsistency {
    param([hashtable]$Data)

    Write-ColorOutput "`nRunning consistency checks..." "Cyan"

    $checks = @()

    # Check 1: Service count matches
    $metadataCount = $Data.metadata.total_services
    $composeServices = 0

    if ($Data.infrastructure_components.compose.tiers) {
        foreach ($tier in $Data.infrastructure_components.compose.tiers.GetEnumerator()) {
            $composeServices += $tier.Value.service_count
        }
    }

    if ($metadataCount -eq $composeServices) {
        $checks += @{ Name = "Service count consistency"; Status = "PASS"; Details = "$metadataCount services" }
    }
    else {
        $checks += @{ Name = "Service count consistency"; Status = "FAIL"; Details = "Metadata: $metadataCount, Compose: $composeServices" }
    }

    # Check 2: All IPs are valid
    $invalidIps = @()
    if ($Data.network_architecture.ip_allocation) {
        foreach ($tier in $Data.network_architecture.ip_allocation.GetEnumerator()) {
            foreach ($service in $tier.Value.services) {
                if ($service.ip -and $service.ip -ne $null -and $service.ip -notmatch '^(\d{1,3}\.){3}\d{1,3}$') {
                    $invalidIps += "$($service.name): $($service.ip)"
                }
            }
        }
    }

    if ($invalidIps.Count -eq 0) {
        $checks += @{ Name = "IP address format"; Status = "PASS"; Details = "All IPs valid" }
    }
    else {
        $checks += @{ Name = "IP address format"; Status = "FAIL"; Details = ($invalidIps -join ", ") }
    }

    # Check 3: Volume names follow convention
    $invalidVolumes = @()
    if ($Data.volume_strategy.named_volumes) {
        foreach ($category in $Data.volume_strategy.named_volumes.GetEnumerator()) {
            foreach ($volume in $category.Value) {
                if ($volume.name -notmatch '^react_scuba_[a-z_-]+$') {
                    $invalidVolumes += $volume.name
                }
            }
        }
    }

    if ($invalidVolumes.Count -eq 0) {
        $checks += @{ Name = "Volume naming convention"; Status = "PASS"; Details = "All volumes follow convention" }
    }
    else {
        $checks += @{ Name = "Volume naming convention"; Status = "FAIL"; Details = ($invalidVolumes -join ", ") }
    }

    # Check 4: Status values are valid
    $validStatuses = @("operational", "degraded", "offline", "fully_operational")
    $statusValid = $validStatuses -contains $Data.metadata.status -and
                  $validStatuses -contains $Data.status.devcontainer_status

    if ($statusValid) {
        $checks += @{ Name = "Status values"; Status = "PASS"; Details = "All status values valid" }
    }
    else {
        $checks += @{ Name = "Status values"; Status = "FAIL"; Details = "Invalid status detected" }
    }

    # Output results
    $passCount = ($checks | Where-Object { $_.Status -eq "PASS" }).Count
    $failCount = ($checks | Where-Object { $_.Status -eq "FAIL" }).Count

    foreach ($check in $checks) {
        $color = if ($check.Status -eq "PASS") { "Green" } else { "Red" }
        $symbol = if ($check.Status -eq "PASS") { "✓" } else { "✗" }
        Write-ColorOutput "$symbol $($check.Name): $($check.Details)" $color
    }

    Write-ColorOutput "`n$passCount passed, $failCount failed" $(if ($failCount -eq 0) { "Green" } else { "Yellow" })

    return $failCount -eq 0
}

function Get-Statistics {
    param([hashtable]$Data)

    Write-ColorOutput "`nStatistics:" "Cyan"

    try {
        $stats = @{
            "Total Services" = $Data.metadata.total_services
            "MCP Servers" = $Data.core_configuration.mcp_servers.servers.Count
            "Named Volumes" = 0
            "Health Checks" = $Data.service_health.health_checks.Count
            "Workflow Steps" = $Data.workflows.startup.steps.Count
            "IP Allocations" = 0
        }

        # Count volumes
        if ($Data.volume_strategy.named_volumes) {
            foreach ($category in $Data.volume_strategy.named_volumes.GetEnumerator()) {
                $stats["Named Volumes"] += $category.Value.Count
            }
        }

        # Count IPs
        if ($Data.network_architecture.ip_allocation) {
            foreach ($tier in $Data.network_architecture.ip_allocation.GetEnumerator()) {
                $stats["IP Allocations"] += $tier.Value.services.Count
            }
        }

        foreach ($key in ($stats.Keys | Sort-Object)) {
            Write-ColorOutput "  $key : $($stats[$key])" "Blue"
        }

        return $stats
    }
    catch {
        Write-ColorOutput "✗ Statistics error: $_" "Red"
        return $null
    }
}

# Main execution
Write-ColorOutput "DevContainer TOC Validation" "Cyan"
Write-ColorOutput "==========================`n" "Cyan"

# Handle dependency installation
if ($InstallDependencies) {
    if (Install-YamlModule) {
        Write-ColorOutput "`nDependencies installed. Please run the script again without -InstallDependencies" "Green"
        exit 0
    }
    else {
        exit 1
    }
}

$results = @{
    yaml_syntax = $false
    required_fields = $false
    consistency_checks = $false
}

# Check file exists
if (-not (Test-Path $tocFile)) {
    Write-ColorOutput "✗ TOC file not found: $tocFile" "Red"
    exit 1
}

# Check YAML module
if (-not (Test-YamlModule)) {
    exit 1
}

# Run validations
$syntaxResult = Test-YamlSyntax -FilePath $tocFile
$results.yaml_syntax = $syntaxResult[0]
$yamlData = $syntaxResult[1]

if ($results.yaml_syntax -and $yamlData) {
    $results.required_fields = Test-RequiredFields -Data $yamlData
    $results.consistency_checks = Test-DataConsistency -Data $yamlData

    # Get statistics
    $stats = Get-Statistics -Data $yamlData
}

# Final result
Write-ColorOutput "`n==========================`n" "Cyan"

$allPassed = $results.Values | Where-Object { $_ -eq $false } | Measure-Object | Select-Object -ExpandProperty Count
if ($allPassed -eq 0) {
    Write-ColorOutput "✓ All validations passed" "Green"

    if ($Json -and $stats) {
        $output = @{
            success = $true
            results = $results
            statistics = $stats
        }
        $output | ConvertTo-Json -Depth 10
    }

    exit 0
}
else {
    Write-ColorOutput "✗ Some validations failed" "Red"

    if ($Json) {
        $output = @{
            success = $false
            results = $results
            statistics = if ($stats) { $stats } else { @{} }
        }
        $output | ConvertTo-Json -Depth 10
    }

    exit 1
}
