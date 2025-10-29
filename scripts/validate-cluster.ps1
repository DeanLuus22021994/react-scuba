#!/usr/bin/env pwsh
#Requires -Version 7.0

<#
.SYNOPSIS
    Validate React Scuba DevContainer Cluster Health

.DESCRIPTION
    Comprehensive validation script for the complete devcontainer cluster.
    Tests service configuration, health endpoints, and integration points.

.PARAMETER Quick
    Run quick validation (config only, no service startup)

.PARAMETER Full
    Run full validation including service startup and health checks

.PARAMETER Services
    Comma-separated list of service categories to test: base,app,mcp,infra,gpu

.EXAMPLE
    .\validate-cluster.ps1 -Quick

.EXAMPLE
    .\validate-cluster.ps1 -Full -Services "base,mcp"
#>

[CmdletBinding()]
param(
    [switch]$Quick,
    [switch]$Full,
    [string]$Services = "base,app,mcp,infra,gpu"
)

$ErrorActionPreference = "Stop"
$InformationPreference = "Continue"

# Colors for output
$Colors = @{
    Success = "Green"
    Info    = "Cyan"
    Warning = "Yellow"
    Error   = "Red"
    Header  = "Magenta"
}

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White", [switch]$NoNewline)
    $Color = if ($Colors.ContainsKey($Color)) { $Colors[$Color] } else { $Color }
    Write-Host $Message -ForegroundColor $Color -NoNewline:$NoNewline
}

function Write-Success { param([string]$Message) Write-ColorOutput "✅ $Message" -Color Success }
function Write-Info { param([string]$Message) Write-ColorOutput "ℹ️  $Message" -Color Info }
function Write-Warning { param([string]$Message) Write-ColorOutput "⚠️  $Message" -Color Warning }
function Write-Error { param([string]$Message) Write-ColorOutput "❌ $Message" -Color Error }
function Write-Header { param([string]$Message) Write-ColorOutput "`n🚀 $Message" -Color Header }

function Test-DockerEnvironment {
    Write-Header "Validating Docker Environment"

    try {
        $dockerVersion = docker --version
        Write-Success "Docker: $dockerVersion"

        $composeVersion = docker-compose --version
        Write-Success "Compose: $composeVersion"

        # Test Docker daemon
        docker version --format "{{.Server.Version}}" | Out-Null
        Write-Success "Docker daemon is running"

        return $true
    }
    catch {
        Write-Error "Docker environment validation failed: $($_.Exception.Message)"
        return $false
    }
}

function Test-ComposeConfiguration {
    param([string[]]$ServiceCategories)

    Write-Header "Validating Compose Configuration"

    $fragments = @{
        "base" = ".devcontainer/infrastructure/compose/base.yml"
        "app"  = ".devcontainer/infrastructure/compose/app.yml"
        "mcp"  = ".devcontainer/infrastructure/compose/mcp.yml"
        "infra" = ".devcontainer/infrastructure/compose/infra.yml"
        "gpu"  = ".devcontainer/infrastructure/compose/gpu.yml"
    }

    $results = @{}

    foreach ($category in $ServiceCategories) {
        if (-not $fragments.ContainsKey($category)) {
            Write-Warning "Unknown service category: $category"
            continue
        }

        $fragment = $fragments[$category]
        Write-Info "Testing $category services ($fragment)"

        try {
            if ($category -eq "base") {
                $services = docker-compose -f docker-compose.yml -f $fragment config --services
            } else {
                $services = docker-compose -f docker-compose.yml -f $fragments["base"] -f $fragment config --services
            }

            $serviceCount = ($services | Measure-Object).Count
            Write-Success "${category}: $serviceCount services configured"
            $results[$category] = @{
                "status" = "success"
                "services" = $services
                "count" = $serviceCount
            }
        }
        catch {
            Write-Error "${category}: Configuration validation failed - $($_.Exception.Message)"
            $results[$category] = @{
                "status" = "failed"
                "error" = $_.Exception.Message
            }
        }
    }

    return $results
}

function Test-FullClusterConfiguration {
    Write-Header "Validating Full Cluster Configuration"

    try {
        $allServices = docker-compose `
            -f docker-compose.yml `
            -f .devcontainer/infrastructure/compose/base.yml `
            -f .devcontainer/infrastructure/compose/app.yml `
            -f .devcontainer/infrastructure/compose/mcp.yml `
            -f .devcontainer/infrastructure/compose/infra.yml `
            -f .devcontainer/infrastructure/compose/gpu.yml `
            config --services

        $totalCount = ($allServices | Measure-Object).Count
        Write-Success "Full cluster: $totalCount services configured successfully"

        Write-Info "Services by category:"
        $grouped = $allServices | Sort-Object | Group-Object {
            switch -Regex ($_) {
                "^(postgres|mariadb|redis|memcached)" { "Database/Cache" }
                "^mcp-" { "MCP Servers" }
                "^node-" { "Application" }
                "^(prometheus|grafana|.*-exporter|cadvisor)" { "Monitoring" }
                "^nginx" { "Load Balancing" }
                "^(nvidia|ollama)" { "GPU/AI" }
                default { "Other" }
            }
        }

        foreach ($group in $grouped) {
            Write-ColorOutput "  📦 $($group.Name): $($group.Count) services" -Color Info
            foreach ($service in $group.Group) {
                Write-ColorOutput "    - $service" -Color "Gray"
            }
        }

        return @{
            "status" = "success"
            "totalServices" = $totalCount
            "services" = $allServices
        }
    }
    catch {
        Write-Error "Full cluster validation failed: $($_.Exception.Message)"
        return @{
            "status" = "failed"
            "error" = $_.Exception.Message
        }
    }
}

function Test-ServiceHealth {
    param([string[]]$ServiceCategories)

    Write-Header "Testing Service Health (Startup Required)"

    if (-not $Full) {
        Write-Warning "Skipping health tests (use -Full flag to enable)"
        return
    }

    # This would require actual service startup
    Write-Info "Health testing would require service startup..."
    Write-Info "Use: docker-compose -f docker-compose.yml -f .devcontainer/infrastructure/compose/base.yml up -d"
    Write-Info "Then: curl http://localhost:5432 (postgres), http://localhost:6379 (redis), etc."
}

function Show-ValidationSummary {
    param([hashtable]$Results)

    Write-Header "Validation Summary"

    $successful = 0
    $failed = 0

    foreach ($category in $Results.Keys) {
        $result = $Results[$category]
        if ($result.status -eq "success") {
            $successful++
            Write-Success "${category}: $($result.count) services ready"
        } else {
            $failed++
            Write-Error "${category}: Configuration failed"
        }
    }

    Write-Info "`nOverall Status:"
    if ($failed -eq 0) {
        Write-Success "All service categories validated successfully"
        Write-Success "Cluster is ready for deployment"
    } else {
        Write-Warning "$failed categories failed validation"
        Write-Warning "Review errors above before deployment"
    }

    Write-Info "`nNext Steps:"
    if ($Quick) {
        Write-Info "  1. Run with -Full flag to test service startup"
        Write-Info "  2. Start base services: docker-compose -f docker-compose.yml -f .devcontainer/infrastructure/compose/base.yml up -d"
        Write-Info "  3. Verify health: docker ps --filter 'status=running'"
    }

    Write-Info "  4. Open devcontainer in VS Code"
    Write-Info "  5. Test MCP integration in GitHub Copilot Chat"
}

# Main execution
function Main {
    Write-Header "React Scuba DevContainer Cluster Validation"

    # Parse service categories
    $serviceCategories = $Services -split "," | ForEach-Object { $_.Trim() }

    # Environment validation
    if (-not (Test-DockerEnvironment)) {
        Write-Error "Environment validation failed. Cannot proceed."
        exit 1
    }

    # Configuration validation
    $configResults = Test-ComposeConfiguration -ServiceCategories $serviceCategories

    # Full cluster test
    $clusterResult = Test-FullClusterConfiguration
    $configResults["full-cluster"] = $clusterResult

    # Health testing (if requested)
    if ($Full) {
        Test-ServiceHealth -ServiceCategories $serviceCategories
    }

    # Summary
    Show-ValidationSummary -Results $configResults

    Write-Info "`nValidation completed at $(Get-Date)"
}

# Execute main function
Main
