# SmartBlood Fast Docker Management Script (PowerShell)

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

# Colors for output
$Colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Blue"
    White = "White"
    Cyan = "Cyan"
}

function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Header {
    param([string]$Title)
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host " $Title" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
}

function Test-DockerRunning {
    try {
        $null = docker info 2>$null
        return $true
    }
    catch {
        return $false
    }
}

function Start-DockerDesktop {
    Write-Status "Starting Docker Desktop..."
    try {
        Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe" -WindowStyle Hidden
        Write-Status "Docker Desktop is starting. Please wait..."
        
        # Wait for Docker to be ready
        $maxWait = 60
        $waited = 0
        while (-not (Test-DockerRunning) -and $waited -lt $maxWait) {
            Start-Sleep -Seconds 2
            $waited += 2
            Write-Host "." -NoNewline -ForegroundColor Yellow
        }
        Write-Host ""
        
        if (Test-DockerRunning) {
            Write-Status "Docker Desktop is ready!"
            return $true
        } else {
            Write-Error "Docker Desktop failed to start within $maxWait seconds"
            return $false
        }
    }
    catch {
        Write-Error "Failed to start Docker Desktop: $_"
        return $false
    }
}

function Optimize-DockerPerformance {
    Write-Header "Optimizing Docker Performance"
    
    # Increase Docker memory if possible
    Write-Status "Checking Docker resources..."
    
    # Clean up unused resources
    Write-Status "Cleaning up unused Docker resources..."
    docker system prune -f --volumes 2>$null
    
    Write-Status "Docker performance optimized!"
}

function Start-FastDev {
    Write-Header "Starting SmartBlood Fast Development Environment"
    
    # Check if Docker is running
    if (-not (Test-DockerRunning)) {
        Write-Warning "Docker Desktop is not running. Attempting to start it..."
        if (-not (Start-DockerDesktop)) {
            Write-Error "Cannot start Docker Desktop. Please start it manually and try again."
            return
        }
    }
    
    # Optimize performance
    Optimize-DockerPerformance
    
    Write-Status "Building and starting optimized containers..."
    Write-Status "This may take a few minutes on first run..."
    
    # Stop any existing containers
    Write-Status "Stopping existing containers..."
    docker-compose -f docker-compose.dev.yml down 2>$null
    docker-compose -f docker-compose.fast.yml down 2>$null
    
    # Build and start with fast configuration
    try {
        docker-compose -f docker-compose.fast.yml up --build -d
        
        Write-Status "Fast development environment started!"
        Write-Status "Services are starting up..."
        
        # Wait and check services
        Start-Sleep -Seconds 10
        
        Write-Status "Checking service status..."
        docker-compose -f docker-compose.fast.yml ps
        
        Write-Header "Access Information"
        Write-Status "Frontend: http://localhost:3000" -ForegroundColor Cyan
        Write-Status "Backend API: http://localhost:5000" -ForegroundColor Cyan
        Write-Status "Database: localhost:5432" -ForegroundColor Cyan
        Write-Status "Admin Login: admin@smartblood.com / Admin123" -ForegroundColor Cyan
        
        Write-Header "Useful Commands"
        Write-Status "View logs: .\docker-fast.ps1 logs"
        Write-Status "Stop services: .\docker-fast.ps1 stop"
        Write-Status "Check status: .\docker-fast.ps1 status"
        
    }
    catch {
        Write-Error "Failed to start services: $_"
        Write-Status "Falling back to manual setup..."
        Start-ManualSetup
    }
}

function Start-ManualSetup {
    Write-Header "Starting Manual Setup"
    Write-Status "Setting up backend..."
    
    # Backend setup
    Set-Location backend
    if (-not (Test-Path "venv")) {
        Write-Status "Creating Python virtual environment..."
        python -m venv venv
    }
    
    Write-Status "Activating virtual environment..."
    & ".\venv\Scripts\Activate.ps1"
    
    Write-Status "Installing Python dependencies..."
    pip install -r requirements.txt
    
    Write-Status "Setting up environment..."
    if (-not (Test-Path ".env")) {
        Copy-Item "env.template" ".env"
        Write-Warning "Please edit .env file with your database settings"
    }
    
    Write-Status "Starting backend server..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\Activate.ps1; python run.py"
    
    Set-Location ..
    
    Write-Status "Setting up frontend..."
    Set-Location frontend
    
    Write-Status "Installing Node.js dependencies..."
    npm install
    
    Write-Status "Starting frontend development server..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
    
    Set-Location ..
    
    Write-Status "Manual setup complete!"
    Write-Status "Frontend: http://localhost:5173"
    Write-Status "Backend: http://localhost:5000"
}

function Stop-All {
    Write-Header "Stopping SmartBlood Services"
    docker-compose -f docker-compose.dev.yml down 2>$null
    docker-compose -f docker-compose.fast.yml down 2>$null
    
    # Kill any manual processes
    Get-Process | Where-Object {$_.ProcessName -eq "python" -and $_.MainWindowTitle -like "*run.py*"} | Stop-Process -Force 2>$null
    Get-Process | Where-Object {$_.ProcessName -eq "node" -and $_.MainWindowTitle -like "*vite*"} | Stop-Process -Force 2>$null
    
    Write-Status "All services stopped!"
}

function Show-Logs {
    param([string]$Service = "")
    
    if ($Service -ne "") {
        docker-compose -f docker-compose.fast.yml logs -f $Service
    } else {
        docker-compose -f docker-compose.fast.yml logs -f
    }
}

function Show-Status {
    Write-Header "SmartBlood Service Status"
    
    if (Test-DockerRunning) {
        Write-Host "Fast Services:" -ForegroundColor White
        docker-compose -f docker-compose.fast.yml ps
        Write-Host ""
        Write-Host "Development Services:" -ForegroundColor White
        docker-compose -f docker-compose.dev.yml ps
    } else {
        Write-Warning "Docker is not running. Checking manual processes..."
        $pythonProcesses = Get-Process | Where-Object {$_.ProcessName -eq "python"}
        $nodeProcesses = Get-Process | Where-Object {$_.ProcessName -eq "node"}
        
        if ($pythonProcesses) {
            Write-Status "Python processes running: $($pythonProcesses.Count)"
        }
        if ($nodeProcesses) {
            Write-Status "Node processes running: $($nodeProcesses.Count)"
        }
    }
}

function Cleanup-All {
    Write-Header "Cleaning Up All Resources"
    Write-Warning "This will remove all containers, images, volumes, and manual processes!"
    $confirmation = Read-Host "Are you sure? (y/N)"
    
    if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
        Stop-All
        
        if (Test-DockerRunning) {
            docker-compose -f docker-compose.dev.yml down -v --rmi all 2>$null
            docker-compose -f docker-compose.fast.yml down -v --rmi all 2>$null
            docker system prune -f --volumes
        }
        
        # Clean up manual setup
        Remove-Item -Path "backend\venv" -Recurse -Force -ErrorAction SilentlyContinue
        Remove-Item -Path "frontend\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
        
        Write-Status "Cleanup completed!"
    } else {
        Write-Status "Cleanup cancelled."
    }
}

function Show-Help {
    Write-Host "SmartBlood Fast Docker Management Script" -ForegroundColor White
    Write-Host ""
    Write-Host "Usage: .\docker-fast.ps1 [COMMAND]" -ForegroundColor White
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor White
    Write-Host "  start     Start optimized development environment" -ForegroundColor Green
    Write-Host "  manual    Start with manual setup (no Docker)" -ForegroundColor Green
    Write-Host "  stop      Stop all services" -ForegroundColor Green
    Write-Host "  logs      Show logs (optionally specify service name)" -ForegroundColor Green
    Write-Host "  status    Show service status" -ForegroundColor Green
    Write-Host "  cleanup   Remove all containers, images, and volumes" -ForegroundColor Green
    Write-Host "  help      Show this help message" -ForegroundColor Green
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor White
    Write-Host "  .\docker-fast.ps1 start              # Start optimized environment" -ForegroundColor Yellow
    Write-Host "  .\docker-fast.ps1 logs backend       # Show backend logs only" -ForegroundColor Yellow
    Write-Host "  .\docker-fast.ps1 manual             # Start without Docker" -ForegroundColor Yellow
}

# Main script logic
switch ($Command.ToLower()) {
    "start" { Start-FastDev }
    "manual" { Start-ManualSetup }
    "stop" { Stop-All }
    "logs" { Show-Logs }
    "status" { Show-Status }
    "cleanup" { Cleanup-All }
    "help" { Show-Help }
    default { 
        Write-Error "Unknown command: $Command"
        Show-Help
        exit 1
    }
}
