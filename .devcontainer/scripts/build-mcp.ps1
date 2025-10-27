#Requires -Version 7.0
<#
.SYNOPSIS
    Build MCP DevContainer Cluster - Complete automation script
    
.DESCRIPTION
    Builds all MCP servers, infrastructure containers, and deploys the complete cluster.
    Supports selective building, parallel execution, and comprehensive health checking.
    
.PARAMETER ServerName
    Build specific MCP server (filesystem, git, fetch, memory)
    
.PARAMETER ContainerName
    Build specific container (k8s-plugin, mariadb, postgres, buildx, runner)
    
.PARAMETER All
    Build everything (default behavior)
    
.PARAMETER Parallel
    Enable parallel builds (faster but more resource intensive)
    
.PARAMETER NoCacheParam
    Force rebuild without cache
    
.PARAMETER PullBase
    Pull latest base images first
    
.EXAMPLE
    .\build-mcp.ps1 -All
    
.EXAMPLE
    .\build-mcp.ps1 -ServerName filesystem -NoCacheParam
    
.EXAMPLE
    .\build-mcp.ps1 -ContainerName buildx -Parallel
#>

[CmdletBinding()]
param(
  [string]$ServerName,
  [string]$ContainerName,
  [switch]$All,
  [switch]$Parallel,
  [switch]$NoCacheParam,
  [switch]$PullBase
)

# ============================================================================
# SCRIPT CONFIGURATION
# ============================================================================

$ErrorActionPreference = "Stop"
$InformationPreference = "Continue"

# Enable Docker BuildKit
$env:DOCKER_BUILDKIT = "1"
$env:COMPOSE_DOCKER_CLI_BUILD = "1"

# Script paths
$ScriptRoot = Split-Path -Parent $PSCommandPath
$DevContainerRoot = Split-Path -Parent $ScriptRoot

# MCP Servers (stdio-based)
$MCPServers = @("filesystem", "git", "fetch", "memory")

# Infrastructure Containers (docker-compose services)
$Containers = @("k8s-plugin", "mariadb", "postgres", "buildx", "runner", "gateway")

# Colors for output
$Colors = @{
  Success = "Green"
  Info    = "Cyan"
  Warning = "Yellow"
  Error   = "Red"
  Header  = "Magenta"
}

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

function Write-ColorOutput {
  param(
    [string]$Message,
    [string]$Color = "White",
    [switch]$NoNewline
  )
    
  if ($Colors.ContainsKey($Color)) {
    $Color = $Colors[$Color]
  }
    
  Write-Host $Message -ForegroundColor $Color -NoNewline:$NoNewline
}

function Write-Success { param([string]$Message) Write-ColorOutput "✅ $Message" -Color Success }
function Write-Info { param([string]$Message) Write-ColorOutput "ℹ️  $Message" -Color Info }
function Write-Warning { param([string]$Message) Write-ColorOutput "⚠️  $Message" -Color Warning }
function Write-Error { param([string]$Message) Write-ColorOutput "❌ $Message" -Color Error }
function Write-Header { param([string]$Message) Write-ColorOutput "`n🚀 $Message" -Color Header }

function Test-DockerRunning {
  try {
    docker version --format "{{.Server.Version}}" | Out-Null
    return $true
  }
  catch {
    return $false
  }
}

function Test-BuildKitRunning {
  try {
    $containers = docker ps --filter "name=buildkit-daemon" --format "{{.Names}}"
    return $containers -contains "buildkit-daemon"
  }
  catch {
    return $false
  }
}

# ============================================================================
# BUILD FUNCTIONS
# ============================================================================

function Build-MCPServer {
  param(
    [string]$ServerName,
    [switch]$NoCache
  )
    
  Write-Info "Building MCP Server: $ServerName"
    
  $contextPath = Join-Path $DevContainerRoot "mcp" $ServerName
  $imageName = "mcp-$ServerName`:latest"
    
  if (-not (Test-Path $contextPath)) {
    Write-Error "MCP server context not found: $contextPath"
    return $false
  }
    
  $buildArgs = @(
    "build",
    "-t", $imageName,
    "-f", "$contextPath/Dockerfile"
  )
    
  if ($NoCache) {
    $buildArgs += "--no-cache"
  }
    
  if ($PullBase) {
    $buildArgs += "--pull"
  }
    
  $buildArgs += $contextPath
    
  try {
    Write-Info "Docker build command: docker $($buildArgs -join ' ')"
    & docker @buildArgs
        
    if ($LASTEXITCODE -eq 0) {
      Write-Success "Built MCP server: $ServerName"
      return $true
    }
    else {
      Write-Error "Failed to build MCP server: $ServerName"
      return $false
    }
  }
  catch {
    Write-Error "Exception building MCP server ${ServerName}: $($_.Exception.Message)"
    return $false
  }
}

function Build-Container {
  param(
    [string]$ContainerName,
    [switch]$NoCache
  )
    
  Write-Info "Building Container: $ContainerName"
    
  $contextPath = Join-Path $DevContainerRoot "containers" $ContainerName
  $imageName = "$ContainerName`:latest"
    
  if (-not (Test-Path $contextPath)) {
    Write-Error "Container context not found: $contextPath"
    return $false
  }
    
  $buildArgs = @(
    "build",
    "-t", $imageName,
    "-f", "$contextPath/Dockerfile"
  )
    
  if ($NoCache) {
    $buildArgs += "--no-cache"
  }
    
  if ($PullBase) {
    $buildArgs += "--pull"
  }
    
  $buildArgs += $contextPath
    
  try {
    Write-Info "Docker build command: docker $($buildArgs -join ' ')"
    & docker @buildArgs
        
    if ($LASTEXITCODE -eq 0) {
      Write-Success "Built container: $ContainerName"
      return $true
    }
    else {
      Write-Error "Failed to build container: $ContainerName"
      return $false
    }
  }
  catch {
    Write-Error "Exception building container ${ContainerName}: $($_.Exception.Message)"
    return $false
  }
}

function Start-BuildKit {
  if (Test-BuildKitRunning) {
    Write-Info "BuildKit daemon already running"
    return $true
  }
    
  Write-Info "Starting BuildKit daemon..."
    
  try {
    $composeFile = Join-Path $DevContainerRoot "docker-compose.mcp.yml"
    Push-Location $DevContainerRoot
        
    & docker-compose -f $composeFile up -d buildkit
        
    if ($LASTEXITCODE -eq 0) {
      Write-Success "BuildKit daemon started"
            
      # Wait for health check
      Write-Info "Waiting for BuildKit to be healthy..."
      for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep 2
        $health = docker inspect buildkit-daemon --format "{{.State.Health.Status}}" 2>$null
        if ($health -eq "healthy") {
          Write-Success "BuildKit daemon is healthy"
          return $true
        }
      }
            
      Write-Warning "BuildKit started but health check timeout"
      return $true
    }
    else {
      Write-Error "Failed to start BuildKit daemon"
      return $false
    }
  }
  catch {
    Write-Error "Exception starting BuildKit: $($_.Exception.Message)"
    return $false
  }
  finally {
    Pop-Location
  }
}

function Deploy-Monitoring {
  Write-Info "Deploying Gateway monitoring stack..."
    
  try {
    $composeFile = Join-Path $DevContainerRoot "docker-compose.mcp.yml"
    Push-Location $DevContainerRoot
        
    & docker-compose -f $composeFile up -d nginx prometheus grafana
        
    if ($LASTEXITCODE -eq 0) {
      Write-Success "Gateway monitoring stack deployed"
            
      Write-Info "Monitoring endpoints:"
      Write-Info "  - nginx: http://localhost"
      Write-Info "  - prometheus: http://localhost:9090"
      Write-Info "  - grafana: http://localhost:3000 (admin/admin)"
            
      return $true
    }
    else {
      Write-Error "Failed to deploy monitoring stack"
      return $false
    }
  }
  catch {
    Write-Error "Exception deploying monitoring: $($_.Exception.Message)"
    return $false
  }
  finally {
    Pop-Location
  }
}

function Show-BuildSummary {
  param(
    [hashtable]$Results
  )
    
  Write-Header "Build Summary"
    
  $successful = @()
  $failed = @()
    
  foreach ($item in $Results.Keys) {
    if ($Results[$item]) {
      $successful += $item
    }
    else {
      $failed += $item
    }
  }
    
  if ($successful.Count -gt 0) {
    Write-Success "Successfully built ($($successful.Count)):"
    foreach ($item in $successful) {
      Write-ColorOutput "  ✅ $item" -Color Success
    }
  }
    
  if ($failed.Count -gt 0) {
    Write-Error "Failed to build ($($failed.Count)):"
    foreach ($item in $failed) {
      Write-ColorOutput "  ❌ $item" -Color Error
    }
  }
    
  # Show image sizes
  Write-Info "`nImage sizes:"
  try {
    $images = docker images --filter "reference=mcp-*" --filter "reference=*:latest" --format "table {{.Repository}}:{{.Tag}}`t{{.Size}}" | Select-Object -Skip 1
    foreach ($image in $images) {
      Write-ColorOutput "  📦 $image" -Color Info
    }
  }
  catch {
    Write-Warning "Could not retrieve image sizes"
  }
}

function Test-Services {
  Write-Header "Testing Service Health"
    
  $composeFile = Join-Path $DevContainerRoot "docker-compose.mcp.yml"
  Push-Location $DevContainerRoot
    
  try {
    Write-Info "Checking service status..."
    & docker-compose -f $composeFile ps
        
    Write-Info "`nRunning health checks..."
    $services = @("postgres-db", "mariadb", "buildkit", "nginx", "prometheus", "grafana")
        
    foreach ($service in $services) {
      try {
        $health = docker inspect $service --format "{{.State.Health.Status}}" 2>$null
        if ($health -eq "healthy") {
          Write-Success "Service $service is healthy"
        }
        elseif ($health -eq "unhealthy") {
          Write-Error "Service $service is unhealthy"
        }
        else {
          Write-Warning "Service $service health status: $health"
        }
      }
      catch {
        Write-Warning "Could not check health for service: $service"
      }
    }
  }
  finally {
    Pop-Location
  }
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

function Main {
  Write-Header "MCP DevContainer Cluster Build Script"
  Write-Info "Building MCP servers and infrastructure containers..."
    
  # Pre-flight checks
  if (-not (Test-DockerRunning)) {
    Write-Error "Docker daemon is not running. Please start Docker and try again."
    exit 1
  }
    
  Write-Success "Docker daemon is running"
    
  # Pull base images if requested
  if ($PullBase) {
    Write-Info "Pulling latest base images..."
    $baseImages = @(
      "node:22-alpine",
      "python:3.14.0-slim-bookworm",
      "python:3.15.0a1-slim-bookworm",
      "postgres:16-alpine",
      "mariadb:11.4-jammy",
      "moby/buildkit:latest",
      "myoung34/github-runner:latest",
      "nginx:alpine",
      "prom/prometheus:latest",
      "grafana/grafana:latest",
      "ghcr.io/github/github-mcp-server:latest"
    )
        
    foreach ($image in $baseImages) {
      Write-Info "Pulling $image..."
      docker pull $image
    }
  }
    
  # Start BuildKit if needed
  Start-BuildKit | Out-Null
    
  # Determine if building all (default behavior when no specific targets)
  $BuildAll = $All -or (-not $ServerName -and -not $ContainerName)
  
  $results = @{}
    
  # Build MCP servers
  if ($ServerName) {
    $results[$ServerName] = Build-MCPServer -ServerName $ServerName -NoCache:$NoCacheParam
  }
  elseif ($BuildAll -or (-not $ContainerName)) {
    foreach ($server in $MCPServers) {
      $results[$server] = Build-MCPServer -ServerName $server -NoCache:$NoCacheParam
    }
  }
    
  # Build containers
  if ($ContainerName) {
    $results[$ContainerName] = Build-Container -ContainerName $ContainerName -NoCache:$NoCacheParam
  }
  elseif ($BuildAll -or (-not $ServerName)) {
    foreach ($container in $Containers) {
      $results[$container] = Build-Container -ContainerName $container -NoCache:$NoCacheParam
    }
  }
    
  # Deploy monitoring stack
  if ($BuildAll) {
    Deploy-Monitoring | Out-Null
  }
    
  # Show results
  Show-BuildSummary -Results $results
    
  # Test services if everything was built
  if ($BuildAll) {
    Test-Services
  }
    
  Write-Header "Build Complete!"
  Write-Info "Next steps:"
  Write-Info "  1. Open VS Code in devcontainer"
  Write-Info "  2. Test MCP servers in Copilot Chat"
  Write-Info "  3. Access monitoring at http://localhost"
  Write-Info ""
  Write-Info "Build script location: $PSCommandPath"
}

# Execute main function
Main