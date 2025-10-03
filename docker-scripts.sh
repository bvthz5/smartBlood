#!/bin/bash

# SmartBlood Docker Management Scripts

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to start development environment
start_dev() {
    print_header "Starting SmartBlood Development Environment"
    print_status "Building and starting development containers..."
    docker-compose -f docker-compose.dev.yml up --build -d
    print_status "Development environment started!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend: http://localhost:5000"
    print_status "Database: localhost:5432"
}

# Function to start production environment
start_prod() {
    print_header "Starting SmartBlood Production Environment"
    print_status "Building and starting production containers..."
    docker-compose up --build -d
    print_status "Production environment started!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend: http://localhost:5000"
    print_status "Database: localhost:5432"
}

# Function to stop all services
stop_all() {
    print_header "Stopping SmartBlood Services"
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    print_status "All services stopped!"
}

# Function to view logs
logs() {
    if [ "$1" = "dev" ]; then
        docker-compose -f docker-compose.dev.yml logs -f
    else
        docker-compose logs -f
    fi
}

# Function to clean up
cleanup() {
    print_header "Cleaning Up Docker Resources"
    print_warning "This will remove all containers, images, and volumes!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v --rmi all
        docker-compose -f docker-compose.dev.yml down -v --rmi all
        docker system prune -f
        print_status "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to show status
status() {
    print_header "SmartBlood Service Status"
    echo "Production Services:"
    docker-compose ps
    echo ""
    echo "Development Services:"
    docker-compose -f docker-compose.dev.yml ps
}

# Function to show help
show_help() {
    echo "SmartBlood Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev       Start development environment"
    echo "  prod      Start production environment"
    echo "  stop      Stop all services"
    echo "  logs      Show logs (add 'dev' for development logs)"
    echo "  status    Show service status"
    echo "  cleanup   Remove all containers, images, and volumes"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev          # Start development environment"
    echo "  $0 logs dev     # Show development logs"
    echo "  $0 cleanup      # Clean up all Docker resources"
}

# Main script logic
case "$1" in
    "dev")
        start_dev
        ;;
    "prod")
        start_prod
        ;;
    "stop")
        stop_all
        ;;
    "logs")
        logs "$2"
        ;;
    "status")
        status
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
