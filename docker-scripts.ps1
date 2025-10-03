# SmartBlood Docker Management Scripts (PowerShell)

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
    Write-Host "================================" -ForegroundColor Blue
    Write-Host " $Title" -ForegroundColor Blue
    Write-Host "================================" -ForegroundColor Blue
}

function Start-Dev {
    Write-Header "Starting SmartBlood Development Environment"
    Write-Status "Building and starting development containers..."
    docker-compose -f docker-compose.dev.yml up --build -d
    Write-Status "Development environment started!"
    Write-Status "Frontend: http://localhost:3000"
    Write-Status "Backend: http://localhost:5000"
    Write-Status "Database: localhost:5432"
}

function Start-Prod {
    Write-Header "Starting SmartBlood Production Environment"
    Write-Status "Building and starting production containers..."
    docker-compose up --build -d
    Write-Status "Production environment started!"
    Write-Status "Frontend: http://localhost:3000"
    Write-Status "Backend: http://localhost:5000"
    Write-Status "Database: localhost:5432"
}

function Stop-All {
    Write-Header "Stopping SmartBlood Services"
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    Write-Status "All services stopped!"
}

function Show-Logs {
    param([string]$Environment = "prod")
    
    if ($Environment -eq "dev") {
        docker-compose -f docker-compose.dev.yml logs -f
    } else {
        docker-compose logs -f
    }
}

function Cleanup-Docker {
    Write-Header "Cleaning Up Docker Resources"
    Write-Warning "This will remove all containers, images, and volumes!"
    $confirmation = Read-Host "Are you sure? (y/N)"
    
    if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
        docker-compose down -v --rmi all
        docker-compose -f docker-compose.dev.yml down -v --rmi all
        docker system prune -f
        Write-Status "Cleanup completed!"
    } else {
        Write-Status "Cleanup cancelled."
    }
}

function Show-Status {
    Write-Header "SmartBlood Service Status"
    Write-Host "Production Services:" -ForegroundColor White
    docker-compose ps
    Write-Host ""
    Write-Host "Development Services:" -ForegroundColor White
    docker-compose -f docker-compose.dev.yml ps
}

function Show-Help {
    Write-Host "SmartBlood Docker Management Script" -ForegroundColor White
    Write-Host ""
    Write-Host "Usage: .\docker-scripts.ps1 [COMMAND]" -ForegroundColor White
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor White
    Write-Host "  dev       Start development environment" -ForegroundColor Green
    Write-Host "  prod      Start production environment" -ForegroundColor Green
    Write-Host "  stop      Stop all services" -ForegroundColor Green
    Write-Host "  logs      Show logs (use -Environment dev for development logs)" -ForegroundColor Green
    Write-Host "  status    Show service status" -ForegroundColor Green
    Write-Host "  cleanup   Remove all containers, images, and volumes" -ForegroundColor Green
    Write-Host "  help      Show this help message" -ForegroundColor Green
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor White
    Write-Host "  .\docker-scripts.ps1 dev                    # Start development environment" -ForegroundColor Yellow
    Write-Host "  .\docker-scripts.ps1 logs -Environment dev  # Show development logs" -ForegroundColor Yellow
    Write-Host "  .\docker-scripts.ps1 cleanup                # Clean up all Docker resources" -ForegroundColor Yellow
}

# Main script logic
switch ($Command.ToLower()) {
    "dev" { Start-Dev }
    "prod" { Start-Prod }
    "stop" { Stop-All }
    "logs" { Show-Logs }
    "status" { Show-Status }
    "cleanup" { Cleanup-Docker }
    "help" { Show-Help }
    default { 
        Write-Error "Unknown command: $Command"
        Show-Help
        exit 1
    }
}
