#Requires -Version 7.5

<#
.SYNOPSIS
    DevContainer Infrastructure Validation Script - Docker Native Tools

.DESCRIPTION
    Leverages Docker Compose native validation and inspection tools:
    - docker compose config --quiet --dry-run (YAML syntax validation)
    - docker compose config --services|--networks|--volumes (infrastructure queries)
    - docker image inspect (MCP server image validation)
    - No external PowerShell dependencies required

.PARAMETER Verbose
    Enable detailed diagnostic output

.PARAMETER Json
    Output results in JSON format for CI/CD integration

.PARAMETER SkipImages
    Skip Docker image existence validation

.EXAMPLE
    .\validate-toc.ps1

.EXAMPLE
    .\validate-toc.ps1 -Verbose -Json

.EXAMPLE
    .\validate-toc.ps1 -SkipImages

.NOTES
    Requires: PowerShell 7.5+, Docker Compose v2+
    Author: React Scuba Team
    Version: 3.0.0
    Last Updated: 2025-10-30
#>

[CmdletBinding()]
param(
    [switch]$Json,
    [switch]$SkipImages
)

# Strict mode for better error detection
Set-StrictMode -Version 3.0
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

# File paths
$script:rootDir = Split-Path $PSScriptRoot -Parent
$script:devcontainerDir = $PSScriptRoot
$script:dockerComposeMain = Join-Path $script:rootDir 'docker-compose.yml'
$script:dockerComposeMcp = Join-Path $script:rootDir 'docker-compose.mcp-persistent.yml'
$script:mcpServersConfig = Join-Path $script:devcontainerDir 'mcp-servers.json'

# ANSI color codes
$script:Colors = @{
    Reset   = "`e[0m"
    Red     = "`e[31m"
    Green   = "`e[32m"
    Yellow  = "`e[33m"
    Blue    = "`e[34m"
    Cyan    = "`e[36m"
    Magenta = "`e[35m"
    Bold    = "`e[1m"
}

#region Helper Functions

function Write-ColorOutput {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory, Position = 0)]
        [string]$Message,

        [Parameter(Position = 1)]
        [ValidateSet('Reset', 'Red', 'Green', 'Yellow', 'Blue', 'Cyan', 'Magenta', 'Bold')]
        [string]$Color = 'Reset',

        [switch]$NoNewline
    )

    if ($Json -and $Color -notin @('Red', 'Magenta')) { return }

    $output = "$($script:Colors[$Color])$Message$($script:Colors.Reset)"
    Write-Host $output -NoNewline:$NoNewline
}

function New-Check {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Name,

        [Parameter(Mandatory)]
        [ValidateSet('PASS', 'FAIL', 'WARN')]
        [string]$Status,

        [string]$Details = $null
    )

    return @{ Name = $Name; Status = $Status; Details = $Details }
}

function Write-CheckResults {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [array]$Checks
    )

    foreach ($check in $Checks) {
        $color = switch ($check.Status) {
            'PASS' { 'Green' }
            'FAIL' { 'Red' }
            'WARN' { 'Yellow' }
        }
        $symbol = switch ($check.Status) {
            'PASS' { '✓' }
            'FAIL' { '✗' }
            'WARN' { '⚠' }
        }
        $details = if ($check.Details) { " - $($check.Details)" } else { '' }
        Write-ColorOutput "  $symbol $($check.Name)$details" $color
    }
}

function Test-FileExists {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Path,

        [Parameter(Mandatory)]
        [string]$Name
    )

    if (Test-Path $Path) {
        return New-Check -Name $Name -Status 'PASS'
    }
    return New-Check -Name $Name -Status 'FAIL' -Details 'File not found'
}

function Invoke-DockerCompose {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string[]]$Arguments,

        [switch]$IgnoreErrors
    )

    try {
        # Change to root directory for Docker Compose context
        Push-Location $script:rootDir

        $allArgs = @('-f', $script:dockerComposeMain, '-f', $script:dockerComposeMcp) + $Arguments
        $result = docker compose $allArgs 2>&1
        $exitCode = $LASTEXITCODE

        Pop-Location

        if ($exitCode -ne 0 -and -not $IgnoreErrors) {
            throw "Docker Compose command failed: $result"
        }

        return @{
            Success = ($exitCode -eq 0)
            Output = $result
            ExitCode = $exitCode
        }
    }
    catch {
        Pop-Location
        if ($IgnoreErrors) {
            return @{
                Success = $false
                Output = $_.Exception.Message
                ExitCode = 1
            }
        }
        throw
    }
}function Test-DockerAvailable {
    [CmdletBinding()]
    param()

    try {
        $null = docker --version 2>&1
        $null = docker compose version 2>&1
        return $true
    }
    catch {
        Write-ColorOutput '✗ Docker or Docker Compose not available' 'Red'
        Write-ColorOutput '  Please ensure Docker Desktop is installed and running' 'Yellow'
        return $false
    }
}

#endregion

#region Validation Functions

function Test-DockerComposeFiles {
    [CmdletBinding()]
    param()

    Write-ColorOutput "`nValidating Docker Compose configuration..." 'Cyan'

    $checks = @(
        (Test-FileExists -Path $script:dockerComposeMain -Name 'docker-compose.yml exists')
        (Test-FileExists -Path $script:dockerComposeMcp -Name 'docker-compose.mcp-persistent.yml exists')
    )

    # Validate YAML syntax using Docker Compose native validation
    Write-ColorOutput '  Running: docker compose config --quiet --dry-run' 'Blue'
    $configResult = Invoke-DockerCompose -Arguments @('config', '--quiet', '--dry-run') -IgnoreErrors

    $checks += if ($configResult.Success) {
        New-Check -Name 'YAML syntax validation' -Status 'PASS'
    } else {
        New-Check -Name 'YAML syntax validation' -Status 'FAIL' -Details $configResult.Output
    }

    Write-CheckResults -Checks $checks
    return -not ($checks.Status -contains 'FAIL')
}

function Get-DockerComposeInventory {
    [CmdletBinding()]
    param()

    Write-ColorOutput "`nQuerying Docker Compose infrastructure..." 'Cyan'

    try {
        $baseArgs = @('--profile', 'full', 'config')

        # Query all resource types in parallel
        $inventory = @{
            Services = @((Invoke-DockerCompose -Arguments ($baseArgs + '--services')).Output | Where-Object { $_ -match '\S' })
            Networks = @((Invoke-DockerCompose -Arguments ($baseArgs + '--networks')).Output | Where-Object { $_ -match '\S' })
            Volumes  = @((Invoke-DockerCompose -Arguments ($baseArgs + '--volumes')).Output | Where-Object { $_ -match '\S' })
        }

        $inventory.ServiceCount = $inventory.Services.Count
        $inventory.NetworkCount = $inventory.Networks.Count
        $inventory.VolumeCount = $inventory.Volumes.Count

        Write-ColorOutput "  ✓ Services: $($inventory.ServiceCount)" 'Green'
        Write-ColorOutput "  ✓ Networks: $($inventory.NetworkCount)" 'Green'
        Write-ColorOutput "  ✓ Volumes: $($inventory.VolumeCount)" 'Green'

        return $inventory
    }
    catch {
        Write-ColorOutput "  ✗ Failed to query inventory: $($_.Exception.Message)" 'Red'
        return $null
    }
}function Test-McpServersConfig {
    [CmdletBinding()]
    param()

    Write-ColorOutput "`nValidating MCP servers configuration..." 'Cyan'

    $checks = @()

    # Check file exists
    $fileCheck = Test-FileExists -Path $script:mcpServersConfig -Name 'mcp-servers.json exists'
    $checks += $fileCheck
    if ($fileCheck.Status -eq 'FAIL') {
        Write-CheckResults -Checks $checks
        return $false
    }

    # Parse JSON
    try {
        $mcpConfig = Get-Content $script:mcpServersConfig -Raw | ConvertFrom-Json
        $checks += New-Check -Name 'JSON syntax valid' -Status 'PASS'
    }
    catch {
        $checks += New-Check -Name 'JSON syntax valid' -Status 'FAIL' -Details $_.Exception.Message
        Write-CheckResults -Checks $checks
        return $false
    }

    # Validate structure
    if (-not $mcpConfig.mcpServers) {
        $checks += New-Check -Name 'mcpServers key exists' -Status 'FAIL' -Details 'Missing mcpServers object'
        Write-CheckResults -Checks $checks
        return $false
    }

    $serverCount = @($mcpConfig.mcpServers.PSObject.Properties).Count
    $checks += New-Check -Name 'MCP servers defined' -Status 'PASS' -Details "$serverCount servers"

    # Validate each server
    foreach ($serverName in $mcpConfig.mcpServers.PSObject.Properties.Name) {
        $checks += Test-McpServer -ServerName $serverName -Server $mcpConfig.mcpServers.$serverName
    }

    Write-CheckResults -Checks $checks
    return -not ($checks.Status -contains 'FAIL')
}

function Test-McpServer {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$ServerName,

        [Parameter(Mandatory)]
        $Server
    )

    $checks = @()

    # Check required fields
    if (-not ($Server.command -and $Server.args)) {
        return New-Check -Name "Server '$ServerName' config" -Status 'FAIL' -Details 'Missing command or args'
    }

    $checks += New-Check -Name "Server '$ServerName' config" -Status 'PASS'

    # Validate Docker command format
    if ($Server.command -eq 'docker' -and $Server.args -contains 'run') {
        $checks += New-Check -Name "Server '$ServerName' uses Docker" -Status 'PASS'

        # Check Docker image exists
        if (-not $SkipImages) {
            $imageArg = $Server.args | Where-Object { $_ -notmatch '^-' -and $_ -ne 'run' -and $_ -ne 'docker' } | Select-Object -Last 1

            if ($imageArg) {
                $null = docker image inspect $imageArg 2>&1
                $checks += if ($LASTEXITCODE -eq 0) {
                    New-Check -Name "Image '$imageArg' exists" -Status 'PASS'
                } else {
                    New-Check -Name "Image '$imageArg' exists" -Status 'WARN' -Details 'Not found locally (will pull on first use)'
                }
            }
        }
    }

    return $checks
}

#endregion

#region Main Execution

function Invoke-Validation {
    [CmdletBinding()]
    param()

    # Header
    if (-not $Json) {
        Write-ColorOutput "$($script:Colors.Bold)DevContainer Infrastructure Validation (Docker Native)$($script:Colors.Reset)" 'Cyan'
        Write-ColorOutput "Version: 3.0.0 | Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" 'Blue'
        Write-ColorOutput "==========================================================`n" 'Cyan'
    }

    # Run validations
    $dockerAvailable = Test-DockerAvailable
    $results = @{
        docker_available = $dockerAvailable
        compose_syntax   = if ($dockerAvailable) { Test-DockerComposeFiles } else { $false }
        mcp_config       = Test-McpServersConfig
    }

    $inventory = if ($dockerAvailable) { Get-DockerComposeInventory } else { $null }
    $allPassed = -not ($results.Values -contains $false)

    # Output results
    if (-not $Json) {
        Write-ColorOutput "`n==========================================================" 'Cyan'
        Write-ColorOutput $(if ($allPassed) { "✓ All validations passed" } else { "✗ Some validations failed" }) $(if ($allPassed) { 'Green' } else { 'Red' })

        if ($allPassed -and $inventory) {
            Write-ColorOutput "`nInfrastructure Summary:" 'Cyan'
            Write-ColorOutput "  Services: $($inventory.ServiceCount)" 'Blue'
            Write-ColorOutput "  Networks: $($inventory.NetworkCount)" 'Blue'
            Write-ColorOutput "  Volumes: $($inventory.VolumeCount)" 'Blue'
        }
    }

    # Return structured result
    $output = @{ Success = $allPassed; ExitCode = if ($allPassed) { 0 } else { 1 }; Results = $results; Inventory = $inventory }

    if ($Json) {
        $jsonOutput = [ordered]@{
            success   = $allPassed
            timestamp = Get-Date -Format 'o'
            results   = $results
            inventory = if ($inventory) {
                @{
                    services = $inventory.Services
                    networks = $inventory.Networks
                    volumes  = $inventory.Volumes
                    counts   = @{
                        services = $inventory.ServiceCount
                        networks = $inventory.NetworkCount
                        volumes  = $inventory.VolumeCount
                    }
                }
            } else { @{} }
        }
        $jsonOutput | ConvertTo-Json -Depth 10 | Write-Host
    }

    return $output
}

# Execute main function
try {
    $result = Invoke-Validation

    if ($result -is [hashtable] -and $result.ContainsKey('ExitCode')) {
        exit $result.ExitCode
    }

    $errorMsg = "Validation function returned invalid result type: $($result.GetType().Name)"
    if ($Json) {
        @{ success = $false; timestamp = Get-Date -Format 'o'; error = $errorMsg } | ConvertTo-Json -Depth 10 | Write-Host
    } else {
        Write-Error $errorMsg
    }
    exit 1
}
catch {
    if ($Json) {
        @{
            success = $false
            timestamp = Get-Date -Format 'o'
            error = $_.Exception.Message
            stackTrace = $_.ScriptStackTrace
        } | ConvertTo-Json -Depth 10 | Write-Host
    } else {
        Write-ColorOutput "`nUnhandled error: $($_.Exception.Message)" 'Red'
        Write-ColorOutput "Stack trace: $($_.ScriptStackTrace)" 'Yellow'
    }
    exit 1
}

#endregion
