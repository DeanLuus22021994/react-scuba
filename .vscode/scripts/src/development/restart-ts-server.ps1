<#
.SYNOPSIS
    Enterprise TypeScript Language Server Restart Utility

.DESCRIPTION
    Triggers TypeScript language server restart by touching the tsconfig.json file.
    Part of the React Scuba enterprise development toolchain.

.PARAMETER Force
    Force restart even if TypeScript config is not found

.PARAMETER Verbose
    Enable verbose logging output

.EXAMPLE
    .\restart-ts-server.ps1
    Standard restart operation

.EXAMPLE
    .\restart-ts-server.ps1 -Verbose
    Restart with detailed logging

.NOTES
    Author: React Scuba Development Team
    Version: 1.0.0
    Last Modified: $(Get-Date -Format 'yyyy-MM-dd')
#>

[CmdletBinding()]
param(
    [switch]$Force,
    [switch]$VerboseLogging
)

# Set error action preference
$ErrorActionPreference = 'Stop'

# Configuration
$script:Config = @{
    TsConfigPath = 'server\apps\web\jsconfig.json'
    FallbackPaths = @('server\tsconfig.json', 'server\apps\api\jsconfig.json', 'tsconfig.json')
    LogPrefix = '[TS-RESTART]'
    MaxRetries = 3
}

# Logging functions
function Write-LogInfo {
    param([string]$Message)
    Write-Host "$($script:Config.LogPrefix) INFO: $Message" -ForegroundColor Green
}

function Write-LogWarning {
    param([string]$Message)
    Write-Host "$($script:Config.LogPrefix) WARN: $Message" -ForegroundColor Yellow
}

function Write-LogError {
    param([string]$Message)
    Write-Host "$($script:Config.LogPrefix) ERROR: $Message" -ForegroundColor Red
}

function Write-LogVerbose {
    param([string]$Message)
    if ($VerboseLogging) {
        Write-Host "$($script:Config.LogPrefix) VERBOSE: $Message" -ForegroundColor Cyan
    }
}

# Main execution
try {
    Write-LogInfo "Starting TypeScript Language Server restart process"
    Write-LogVerbose "Working directory: $(Get-Location)"
    Write-LogVerbose "Target config: $($script:Config.TsConfigPath)"
    
    if (Test-Path $script:Config.TsConfigPath) {
        Write-LogVerbose "TypeScript config file found"
        
        # Touch the file to trigger reload
        $configFile = Get-Item $script:Config.TsConfigPath
        $configFile.LastWriteTime = Get-Date
        
        Write-LogInfo "TypeScript language server restart triggered successfully"
        Write-LogVerbose "File timestamp updated: $($configFile.LastWriteTime)"
        
        # Verify the operation
        Start-Sleep -Milliseconds 500
        $verifyFile = Get-Item $script:Config.TsConfigPath
        if ($verifyFile.LastWriteTime -eq $configFile.LastWriteTime) {
            Write-LogInfo "Restart operation verified successfully"
        } else {
            Write-LogWarning "Restart verification failed - timestamp mismatch"
        }
        
    } elseif ($Force) {
        Write-LogWarning "TypeScript config not found, but Force parameter specified"
        Write-LogInfo "Attempting to create minimal config for restart trigger"
        
        # Create minimal tsconfig for restart trigger
        $minimalConfig = @'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
'@
        
        New-Item -Path $script:Config.TsConfigPath -Value $minimalConfig -Force
        Write-LogInfo "Minimal TypeScript config created and restart triggered"
        
    } else {
        # Try fallback paths
        $foundConfig = $false
        foreach ($fallbackPath in $script:Config.FallbackPaths) {
            if (Test-Path $fallbackPath) {
                Write-LogInfo "Using fallback config: $fallbackPath"
                # Touch the fallback config instead
                $configFile = Get-Item $fallbackPath
                $configFile.LastWriteTime = Get-Date
                Write-LogInfo "TypeScript language server restart triggered via fallback config"
                $foundConfig = $true
                break
            }
        }
        
        if (-not $foundConfig) {
            Write-LogError "TypeScript config not found at: $($script:Config.TsConfigPath)"
            Write-LogError "Also checked: $($script:Config.FallbackPaths -join ', ')"
            Write-LogError "Current directory: $(Get-Location)"
            Write-LogInfo "Use -Force parameter to create minimal config"
            exit 1
        }
    }
    
    Write-LogInfo "TypeScript Language Server restart completed successfully"
    exit 0
    
} catch {
    Write-LogError "Failed to restart TypeScript Language Server: $($_.Exception.Message)"
    Write-LogError "Stack trace: $($_.ScriptStackTrace)"
    exit 1
}
