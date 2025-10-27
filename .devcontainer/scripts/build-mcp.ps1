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
$MCPServers = @("filesystem", "git", "fetch", "github", "memory", "python-experimental")

# Infrastructure Containers (docker-compose services)
$Containers = @("k8s-plugin", "mariadb", "postgres", "buildx", "runner")

# Exporter Containers
$Exporters = @("cadvisor", "node-exporter", "postgres-exporter", "mysql-exporter")

# Gateway Services
$GatewayServices = @("nginx", "prometheus", "grafana")

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

function Deploy-Exporters {
  Write-Info "Deploying metric exporters..."
    
  try {
    $composeFile = Join-Path $DevContainerRoot "docker-compose.mcp.yml"
    Push-Location $DevContainerRoot
        
    # Deploy all exporters
    & docker-compose -f $composeFile up -d $Exporters
        
    if ($LASTEXITCODE -eq 0) {
      Write-Success "Metric exporters deployed"
            
      Write-Info "Exporter endpoints:"
      Write-Info "  - cAdvisor: http://localhost:8080 (Container metrics)"
      Write-Info "  - Node Exporter: http://localhost:9100 (System metrics)"
      Write-Info "  - Postgres Exporter: http://localhost:9187 (Database metrics)"
      Write-Info "  - MySQL Exporter: http://localhost:9104 (Database metrics)"
            
      return $true
    }
    else {
      Write-Error "Failed to deploy exporters"
      return $false
    }
  }
  catch {
    Write-Error "Exception deploying exporters: $($_.Exception.Message)"
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
        
    # Deploy gateway services
    & docker-compose -f $composeFile up -d $GatewayServices
        
    if ($LASTEXITCODE -eq 0) {
      Write-Success "Gateway monitoring stack deployed"
            
      Write-Info "Monitoring endpoints:"
      Write-Info "  - Nginx: http://localhost (Reverse proxy + SSL termination)"
      Write-Info "  - Prometheus: http://localhost:9090 (Metrics collection)"
      Write-Info "  - Grafana: http://localhost:3000 (admin/admin - Dashboards)"
            
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
        
    # Core infrastructure services
    $coreServices = @("postgres-db", "mariadb", "buildkit")
        
    # Gateway services
    $gatewayServices = $GatewayServices
        
    # Exporter services
    $exporterServices = $Exporters
        
    Write-Info "`n🔧 Core Infrastructure:"
    foreach ($service in $coreServices) {
      try {
        $health = docker inspect $service --format "{{.State.Health.Status}}" 2>$null
        if ($health -eq "healthy") {
          Write-Success "  $service is healthy"
        }
        elseif ($health -eq "unhealthy") {
          Write-Error "  $service is unhealthy"
        }
        else {
          Write-Warning "  $service health status: $health"
        }
      }
      catch {
        Write-Warning "  Could not check health for: $service"
      }
    }
        
    Write-Info "`n📊 Metric Exporters:"
    foreach ($service in $exporterServices) {
      try {
        $running = docker inspect $service --format "{{.State.Running}}" 2>$null
        if ($running -eq "true") {
          Write-Success "  $service is running"
        }
        else {
          Write-Error "  $service is not running"
        }
      }
      catch {
        Write-Warning "  Could not check status for: $service"
      }
    }
        
    Write-Info "`n🔍 Gateway Monitoring:"
    foreach ($service in $gatewayServices) {
      try {
        $health = docker inspect $service --format "{{.State.Health.Status}}" 2>$null
        $running = docker inspect $service --format "{{.State.Running}}" 2>$null
            
        if ($health -eq "healthy") {
          Write-Success "  $service is healthy"
        }
        elseif ($running -eq "true") {
          Write-Success "  $service is running (no health check)"
        }
        else {
          Write-Error "  $service is not running"
        }
      }
      catch {
        Write-Warning "  Could not check health for: $service"
      }
    }
        
    # Test Prometheus targets
    Write-Info "`n🎯 Testing Prometheus scrape targets..."
    try {
      Start-Sleep -Seconds 5
      $prometheusTargets = Invoke-RestMethod -Uri "http://localhost:9090/api/v1/targets" -ErrorAction SilentlyContinue
      $activeTargets = $prometheusTargets.data.activeTargets | Where-Object { $_.health -eq "up" }
            
      if ($activeTargets) {
        Write-Success "  Prometheus has $($activeTargets.Count) active targets:"
        foreach ($target in $activeTargets) {
          Write-ColorOutput "    ✅ $($target.labels.job) - $($target.scrapeUrl)" -Color Success
        }
      }
      else {
        Write-Warning "  No active Prometheus targets found (may still be initializing)"
      }
    }
    catch {
      Write-Warning "  Could not query Prometheus targets (service may still be starting)"
    }
        
    # Test Grafana API
    Write-Info "`n📈 Testing Grafana API..."
    try {
      $grafanaHealth = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -ErrorAction SilentlyContinue
      if ($grafanaHealth.database -eq "ok") {
        Write-Success "  Grafana database is healthy"
      }
      if ($grafanaHealth.version) {
        Write-Info "  Grafana version: $($grafanaHealth.version)"
      }
    }
    catch {
      Write-Warning "  Could not query Grafana API (service may still be starting)"
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
    
  # Deploy exporters first (metrics providers)
  if ($BuildAll) {
    Write-Info "`n📊 Deploying metric exporters..."
    Deploy-Exporters | Out-Null
        
    # Wait for exporters to initialize
    Write-Info "Waiting for exporters to initialize (10s)..."
    Start-Sleep -Seconds 10
  }
    
  # Deploy monitoring stack (metrics consumers)
  if ($BuildAll) {
    Write-Info "`n🔍 Deploying monitoring gateway stack..."
    Deploy-Monitoring | Out-Null
        
    # Wait for monitoring stack to scrape first metrics
    Write-Info "Waiting for Prometheus to scrape metrics (15s)..."
    Start-Sleep -Seconds 15
  }
    
  # Show results
  Show-BuildSummary -Results $results
    
  # Test services if everything was built
  if ($BuildAll) {
    Test-Services
  }
    
  Write-Header "Build Complete!"
    
  if ($BuildAll) {
    Write-Info "`n📋 Access Points:"
    Write-ColorOutput "  🌐 Nginx Gateway:      http://localhost" -Color Info
    Write-ColorOutput "  📊 Grafana Dashboards: http://localhost:3000 (admin/admin)" -Color Info
    Write-ColorOutput "  🔍 Prometheus UI:      http://localhost:9090" -Color Info
    Write-ColorOutput "  📈 cAdvisor:           http://localhost:8080" -Color Info
    Write-ColorOutput "  💾 Node Exporter:      http://localhost:9100/metrics" -Color Info
    Write-ColorOutput "  🗄️  Postgres Exporter:  http://localhost:9187/metrics" -Color Info
    Write-ColorOutput "  🗄️  MySQL Exporter:     http://localhost:9104/metrics" -Color Info
        
    Write-Info "`n🎯 Prometheus Targets:"
    Write-Info "  All exporters are automatically scraped by Prometheus"
    Write-Info "  View targets at: http://localhost:9090/targets"
        
    Write-Info "`n📈 Grafana Dashboards:"
    Write-Info "  Pre-configured datasources: Prometheus"
    Write-Info "  Import dashboards from: https://grafana.com/grafana/dashboards/"
    Write-Info "  Recommended IDs: 893 (Docker), 1860 (Node), 9628 (PostgreSQL)"
  }
    
  Write-Info "`n🚀 Next steps:"
  Write-Info "  1. Open VS Code in devcontainer"
  Write-Info "  2. Test MCP servers in Copilot Chat"
  Write-Info "  3. Access monitoring at http://localhost"
  Write-Info "  4. View Prometheus metrics at http://localhost:9090"
  Write-Info "  5. Create Grafana dashboards at http://localhost:3000"
  Write-Info ""
  Write-Info "Build script location: $PSCommandPath"
}

# Execute main function
Main