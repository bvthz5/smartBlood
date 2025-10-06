# SmartBlood Docker Management Script
# PowerShell script for managing the complete SmartBlood system

param(
    [Parameter(Position=0)]
    [ValidateSet("start", "stop", "restart", "build", "logs", "status", "clean", "reset", "shell", "help")]
    [string]$Action = "help",
    
    [Parameter(Position=1)]
    [string]$Service = "",
    
    [switch]$Production,
    [switch]$Development,
    [switch]$Force
)

# Configuration
$ComposeFile = if ($Production) { "docker-compose.production.yml" } else { "docker-compose.dev.yml" }
$ProjectName = "smartblood"

# Colors for output
$Red = "`e[31m"
$Green = "`e[32m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Magenta = "`e[35m"
$Cyan = "`e[36m"
$White = "`e[37m"
$Reset = "`e[0m"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = $White)
    Write-Host "${Color}${Message}${Reset}"
}

function Write-Header {
    param([string]$Title)
    Write-ColorOutput "`n🚀 SmartBlood Docker Management" $Cyan
    Write-ColorOutput "================================" $Cyan
    Write-ColorOutput $Title $Yellow
    Write-Host ""
}

function Test-DockerRunning {
    try {
        docker version | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

function Start-DockerDesktop {
    Write-ColorOutput "🐳 Starting Docker Desktop..." $Yellow
    try {
        Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe" -WindowStyle Hidden
        Write-ColorOutput "✅ Docker Desktop started" $Green
        return $true
    }
    catch {
        Write-ColorOutput "❌ Failed to start Docker Desktop" $Red
        return $false
    }
}

function Get-SystemStatus {
    Write-Header "System Status Check"
    
    # Check Docker
    if (-not (Test-DockerRunning)) {
        Write-ColorOutput "❌ Docker is not running" $Red
        Write-ColorOutput "Attempting to start Docker Desktop..." $Yellow
        if (Start-DockerDesktop) {
            Write-ColorOutput "⏳ Waiting for Docker to start..." $Yellow
            Start-Sleep -Seconds 10
        } else {
            return
        }
    } else {
        Write-ColorOutput "✅ Docker is running" $Green
    }
    
    # Check containers
    Write-ColorOutput "`n📊 Container Status:" $Blue
    $containers = docker ps -a --filter "name=smartblood" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    Write-Host $containers
    
    # Check system resources
    Write-ColorOutput "`n💾 System Resources:" $Blue
    $stats = docker system df
    Write-Host $stats
}

function Start-SmartBlood {
    param([bool]$Build = $false)
    
    Write-Header "Starting SmartBlood System"
    
    if (-not (Test-DockerRunning)) {
        Write-ColorOutput "❌ Docker is not running" $Red
        if (Start-DockerDesktop) {
            Write-ColorOutput "⏳ Waiting for Docker to start..." $Yellow
            Start-Sleep -Seconds 15
        } else {
            return
        }
    }
    
    $cmd = "docker-compose -f $ComposeFile -p $ProjectName"
    
    if ($Build) {
        Write-ColorOutput "🔨 Building and starting services..." $Yellow
        $cmd += " up --build -d"
    } else {
        Write-ColorOutput "🚀 Starting services..." $Yellow
        $cmd += " up -d"
    }
    
    try {
        Invoke-Expression $cmd
        
        Write-ColorOutput "`n⏳ Waiting for services to be ready..." $Yellow
        Start-Sleep -Seconds 10
        
        # Check health
        Write-ColorOutput "`n🔍 Checking service health..." $Blue
        docker-compose -f $ComposeFile -p $ProjectName ps
        
        Write-ColorOutput "`n✅ SmartBlood system started successfully!" $Green
        Write-ColorOutput "🌐 Frontend: http://localhost:3000" $Cyan
        Write-ColorOutput "🔧 Backend API: http://localhost:5000" $Cyan
        Write-ColorOutput "🗄️  Database: localhost:5432" $Cyan
        Write-ColorOutput "📊 Redis: localhost:6379" $Cyan
        
        Write-ColorOutput "`n👤 Admin Login:" $Magenta
        Write-ColorOutput "   Email: admin@smartblood.com" $White
        Write-ColorOutput "   Password: Admin123" $White
        
    }
    catch {
        Write-ColorOutput "❌ Failed to start SmartBlood system" $Red
        Write-ColorOutput $_.Exception.Message $Red
    }
}

function Stop-SmartBlood {
    Write-Header "Stopping SmartBlood System"
    
    try {
        docker-compose -f $ComposeFile -p $ProjectName down
        
        Write-ColorOutput "✅ SmartBlood system stopped" $Green
    }
    catch {
        Write-ColorOutput "❌ Failed to stop SmartBlood system" $Red
        Write-ColorOutput $_.Exception.Message $Red
    }
}

function Restart-SmartBlood {
    Write-Header "Restarting SmartBlood System"
    
    Stop-SmartBlood
    Start-Sleep -Seconds 5
    Start-SmartBlood
}

function Build-SmartBlood {
    Write-Header "Building SmartBlood System"
    
    try {
        Write-ColorOutput "🔨 Building all services..." $Yellow
        docker-compose -f $ComposeFile -p $ProjectName build --no-cache
        
        Write-ColorOutput "✅ Build completed successfully" $Green
    }
    catch {
        Write-ColorOutput "❌ Build failed" $Red
        Write-ColorOutput $_.Exception.Message $Red
    }
}

function Show-Logs {
    param([string]$ServiceName = "")
    
    Write-Header "SmartBlood System Logs"
    
    try {
        if ($ServiceName) {
            Write-ColorOutput "📋 Showing logs for: $ServiceName" $Blue
            docker-compose -f $ComposeFile -p $ProjectName logs -f $ServiceName
        } else {
            Write-ColorOutput "📋 Showing logs for all services" $Blue
            docker-compose -f $ComposeFile -p $ProjectName logs -f
        }
    }
    catch {
        Write-ColorOutput "❌ Failed to show logs" $Red
        Write-ColorOutput $_.Exception.Message $Red
    }
}

function Clean-SmartBlood {
    Write-Header "Cleaning SmartBlood System"
    
    if (-not $Force) {
        $confirm = Read-Host "This will remove all containers, volumes, and images. Continue? (y/N)"
        if ($confirm -ne "y" -and $confirm -ne "Y") {
            Write-ColorOutput "❌ Operation cancelled" $Yellow
            return
        }
    }
    
    try {
        Write-ColorOutput "🧹 Stopping and removing containers..." $Yellow
        docker-compose -f $ComposeFile -p $ProjectName down -v --remove-orphans
        
        Write-ColorOutput "🗑️ Removing unused images..." $Yellow
        docker image prune -f
        
        Write-ColorOutput "🗑️ Removing unused volumes..." $Yellow
        docker volume prune -f
        
        Write-ColorOutput "✅ Cleanup completed" $Green
    }
    catch {
        Write-ColorOutput "❌ Cleanup failed" $Red
        Write-ColorOutput $_.Exception.Message $Red
    }
}

function Reset-SmartBlood {
    Write-Header "Resetting SmartBlood System"
    
    if (-not $Force) {
        $confirm = Read-Host "This will completely reset the system (including database data). Continue? (y/N)"
        if ($confirm -ne "y" -and $confirm -ne "Y") {
            Write-ColorOutput "❌ Operation cancelled" $Yellow
            return
        }
    }
    
    try {
        Write-ColorOutput "🛑 Stopping all services..." $Yellow
        docker-compose -f $ComposeFile -p $ProjectName down -v --remove-orphans
        
        Write-ColorOutput "🗑️ Removing all SmartBlood containers and volumes..." $Yellow
        docker container prune -f
        docker volume prune -f
        
        Write-ColorOutput "🔨 Rebuilding and starting fresh..." $Yellow
        Start-SmartBlood -Build $true
        
        Write-ColorOutput "✅ System reset completed" $Green
    }
    catch {
        Write-ColorOutput "❌ Reset failed" $Red
        Write-ColorOutput $_.Exception.Message $Red
    }
}

function Open-Shell {
    param([string]$ServiceName = "backend")
    
    Write-Header "Opening Shell for: $ServiceName"
    
    try {
        docker-compose -f $ComposeFile -p $ProjectName exec $ServiceName /bin/bash
    }
    catch {
        Write-ColorOutput "❌ Failed to open shell" $Red
        Write-ColorOutput $_.Exception.Message $Red
    }
}

function Show-Help {
    Write-Header "SmartBlood Docker Management Help"
    
    Write-ColorOutput "Available Commands:" $Blue
    Write-Host "  start     - Start the SmartBlood system"
    Write-Host "  stop      - Stop the SmartBlood system"
    Write-Host "  restart   - Restart the SmartBlood system"
    Write-Host "  build     - Build all Docker images"
    Write-Host "  logs      - Show system logs (optionally for specific service)"
    Write-Host "  status    - Show system status and health"
    Write-Host "  clean     - Clean up containers, images, and volumes"
    Write-Host "  reset     - Complete system reset (including database)"
    Write-Host "  shell     - Open shell in a service container"
    Write-Host "  help      - Show this help message"
    
    Write-ColorOutput "`nOptions:" $Blue
    Write-Host "  -Production    - Use production configuration"
    Write-Host "  -Development   - Use development configuration (default)"
    Write-Host "  -Force         - Skip confirmation prompts"
    Write-Host "  -Service <name> - Specify service name for logs/shell"
    
    Write-ColorOutput "`nExamples:" $Blue
    Write-Host "  .\docker-manage.ps1 start"
    Write-Host "  .\docker-manage.ps1 logs backend"
    Write-Host "  .\docker-manage.ps1 build -Production"
    Write-Host "  .\docker-manage.ps1 shell frontend"
    Write-Host "  .\docker-manage.ps1 reset -Force"
    
    Write-ColorOutput "`nServices:" $Blue
    Write-Host "  postgres  - PostgreSQL database"
    Write-Host "  backend   - Flask API server"
    Write-Host "  frontend  - React application"
    Write-Host "  redis     - Redis cache server"
}

# Main execution
switch ($Action.ToLower()) {
    "start" { Start-SmartBlood }
    "stop" { Stop-SmartBlood }
    "restart" { Restart-SmartBlood }
    "build" { Build-SmartBlood }
    "logs" { Show-Logs -ServiceName $Service }
    "status" { Get-SystemStatus }
    "clean" { Clean-SmartBlood }
    "reset" { Reset-SmartBlood }
    "shell" { Open-Shell -ServiceName $Service }
    "help" { Show-Help }
    default { Show-Help }
}
