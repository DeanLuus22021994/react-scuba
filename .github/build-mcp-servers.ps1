#!/usr/bin/env pwsh
# Build script for all MCP Docker servers with advanced caching
# Usage: ./.github/build-mcp-servers.ps1 [server-name]
# If no server name provided, builds all servers
# 
# OPTIMIZATION: Uses Docker BuildKit cache mounts for instant rebuilds

param(
  [string]$ServerName = "all",
  [switch]$NoCacheParam,
  [switch]$Parallel,
  [switch]$PullBase
)

$ErrorActionPreference = "Stop"

# Enable Docker BuildKit for advanced caching
$env:DOCKER_BUILDKIT = "1"
$env:BUILDKIT_PROGRESS = "plain"

# Color output functions
function Write-Success { param($Message) Write-Host "✓ $Message" -ForegroundColor Green }
function Write-Info { param($Message) Write-Host "ℹ $Message" -ForegroundColor Cyan }
function Write-Warning { param($Message) Write-Host "⚠ $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "✗ $Message" -ForegroundColor Red }

# Check if Docker is running
try {
  docker info | Out-Null
  Write-Success "Docker is running"
}
catch {
  Write-Error "Docker is not running. Please start Docker Desktop."
  exit 1
}

# Change to .github directory
Set-Location $PSScriptRoot

# Define MCP servers to build
$servers = @(
  @{ Name = "filesystem"; Dockerfile = "filesystem.dockerfile"; Tag = "mcp-filesystem:latest" },
  @{ Name = "postgres"; Dockerfile = "postgres.dockerfile"; Tag = "mcp-postgres:latest" },
  @{ Name = "sqlite"; Dockerfile = "sqlite.dockerfile"; Tag = "mcp-sqlite:latest" },
  @{ Name = "memory"; Dockerfile = "memory.dockerfile"; Tag = "mcp-memory:latest" },
  @{ Name = "git"; Dockerfile = "git.dockerfile"; Tag = "mcp-git:latest" },
  @{ Name = "fetch"; Dockerfile = "fetch.dockerfile"; Tag = "mcp-fetch:latest" }
)

# Filter servers if specific one requested
if ($ServerName -ne "all") {
  $servers = $servers | Where-Object { $_.Name -eq $ServerName }
  if ($servers.Count -eq 0) {
    Write-Error "Server '$ServerName' not found. Available: filesystem, postgres, sqlite, memory, git, fetch"
    exit 1
  }
}

# Build function
function Build-MCPServer {
  param($Server)
    
  Write-Info "Building $($Server.Name) MCP server with BuildKit caching..."
    
  $buildArgs = @(
    "build",
    "-f", $Server.Dockerfile,
    "-t", $Server.Tag,
    "."
  )
    
  if ($NoCacheParam) {
    $buildArgs += "--no-cache"
  }
  else {
    # Enable inline cache for faster subsequent builds
    $buildArgs += "--build-arg", "BUILDKIT_INLINE_CACHE=1"
  }
    
  $buildArgs += "--progress=plain"
    
  try {
    $output = docker @buildArgs 2>&1
    if ($LASTEXITCODE -eq 0) {
      Write-Success "Built $($Server.Tag)"
      return $true
    }
    else {
      Write-Error "Failed to build $($Server.Name): $output"
      return $false
    }
  }
  catch {
    Write-Error "Failed to build $($Server.Name): $_"
    return $false
  }
}

# Pull base images for caching
if ($PullBase) {
  Write-Info "Pulling base images for optimal caching..."
  $baseImages = @(
    "node:22-alpine",
    "python:3.12-alpine",
    "postgres:16-alpine",
    "alpine:3.21"
  )
  
  foreach ($image in $baseImages) {
    try {
      Write-Info "Pulling $image..."
      docker pull $image
      Write-Success "Pulled $image"
    }
    catch {
      Write-Warning "Failed to pull $image, will use cached version"
    }
  }
}

# Pull GitHub official image
Write-Info "Pulling official GitHub MCP server image..."
try {
  docker pull ghcr.io/github/github-mcp-server:latest
  Write-Success "Pulled ghcr.io/github/github-mcp-server:latest"
}
catch {
  Write-Warning "Failed to pull GitHub image, will use cached version"
}

# Build servers
$startTime = Get-Date
$results = @()

if ($Parallel) {
  Write-Info "Building servers in parallel..."
  $results = $servers | ForEach-Object -Parallel {
    # Import the Build-MCPServer function into parallel scope
    $server = $_
    $buildArgs = @(
      "build",
      "-f", $server.Dockerfile,
      "-t", $server.Tag,
      "."
    )
    if ($using:NoCacheParam) { $buildArgs += "--no-cache" }
    $buildArgs += "--progress=plain"
        
    docker @buildArgs 2>&1 | Out-Null
    @{ Name = $server.Name; Success = ($LASTEXITCODE -eq 0) }
  } -ThrottleLimit 3
}
else {
  Write-Info "Building servers sequentially..."
  $results = $servers | ForEach-Object {
    $success = Build-MCPServer $_
    @{ Name = $_.Name; Success = $success }
  }
}

$endTime = Get-Date
$duration = $endTime - $startTime

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Build Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$successCount = ($results | Where-Object { $_.Success }).Count
$totalCount = $results.Count

foreach ($result in $results) {
  if ($result.Success) {
    Write-Success "$($result.Name) - Built successfully"
  }
  else {
    Write-Error "$($result.Name) - Build failed"
  }
}

Write-Host "`nTotal: $successCount/$totalCount successful" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })
Write-Host "Duration: $($duration.TotalSeconds.ToString('0.00'))s" -ForegroundColor Cyan

# List images
Write-Host "`nBuilt MCP Server Images:" -ForegroundColor Cyan
docker images --filter "reference=mcp-*" --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"

if ($successCount -eq $totalCount) {
  Write-Success "`nAll MCP servers built successfully!"
  Write-Info "BuildKit cache is persisted - subsequent builds will be instant!"
  Write-Info "To use these servers, ensure your .vscode/mcp.json references the correct image tags."
  Write-Host "`nCache Management:" -ForegroundColor Cyan
  Write-Host "  View cache: docker buildx du" -ForegroundColor Gray
  Write-Host "  Clear cache: docker buildx prune" -ForegroundColor Gray
  exit 0
}
else {
  Write-Warning "`nSome builds failed. Check the output above for details."
  exit 1
}