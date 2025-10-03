# SmartBlood Docker Setup

This document provides comprehensive instructions for running the SmartBlood application using Docker containers.

## 🐳 Docker Architecture

The SmartBlood application consists of the following services:

- **PostgreSQL Database**: Stores all application data
- **Backend Flask API**: RESTful API server
- **Frontend React App**: User interface served by Nginx
- **Redis**: Optional caching service

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose v2.0+
- At least 4GB RAM available for Docker
- Ports 3000, 5000, 5432, and 6379 available

## 🚀 Quick Start

### Development Environment

```bash
# Start development environment
.\docker-scripts.ps1 dev

# Or using docker-compose directly
docker-compose -f docker-compose.dev.yml up --build -d
```

### Production Environment

```bash
# Start production environment
.\docker-scripts.ps1 prod

# Or using docker-compose directly
docker-compose up --build -d
```

## 🛠️ Management Commands

Use the provided PowerShell script for easy management:

```powershell
# Development commands
.\docker-scripts.ps1 dev          # Start development environment
.\docker-scripts.ps1 logs -Environment dev  # View development logs

# Production commands
.\docker-scripts.ps1 prod         # Start production environment
.\docker-scripts.ps1 logs         # View production logs

# General commands
.\docker-scripts.ps1 status       # Show service status
.\docker-scripts.ps1 stop         # Stop all services
.\docker-scripts.ps1 cleanup      # Remove all containers and volumes
.\docker-scripts.ps1 help         # Show help
```

## 🌐 Service URLs

Once started, access the services at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432
- **Redis**: localhost:6379

## 📁 File Structure

```
smartBlood/
├── docker-compose.yml          # Production configuration
├── docker-compose.dev.yml      # Development configuration
├── docker.env                  # Environment variables
├── docker-scripts.ps1          # PowerShell management script
├── docker-scripts.sh           # Bash management script (Linux/Mac)
├── backend/
│   ├── Dockerfile              # Backend container definition
│   ├── .dockerignore           # Backend ignore patterns
│   └── init.sql                # Database initialization
└── frontend/
    ├── Dockerfile              # Production frontend container
    ├── Dockerfile.dev          # Development frontend container
    ├── .dockerignore           # Frontend ignore patterns
    └── nginx.conf              # Nginx configuration
```

## 🔧 Configuration

### Environment Variables

Key environment variables can be configured in `docker.env`:

```env
# Database
DATABASE_URL=postgresql+psycopg2://postgres:123@postgres:5432/smartblood
POSTGRES_PASSWORD=123

# Admin User
ADMIN_EMAIL=smartblooda@gmail.com
ADMIN_PASSWORD=Admin@123

# Security
JWT_SECRET_KEY=your-jwt-secret-key-change-this-in-production
SECRET_KEY=your-flask-secret-key-change-this-in-production
```

### Port Configuration

Default ports can be changed in `docker-compose.yml`:

```yaml
ports:
  - "3000:3000"  # Frontend
  - "5000:5000"  # Backend
  - "5432:5432"  # PostgreSQL
  - "6379:6379"  # Redis
```

## 🗄️ Database Management

### Initial Setup

The database is automatically initialized when the PostgreSQL container starts for the first time. The Flask application will create all necessary tables.

### Data Persistence

Database data is persisted in Docker volumes:

- `postgres_data`: PostgreSQL data files
- `redis_data`: Redis data files

### Backup Database

```bash
# Create backup
docker exec smartblood-postgres pg_dump -U postgres smartblood > backup.sql

# Restore backup
docker exec -i smartblood-postgres psql -U postgres smartblood < backup.sql
```

## 🔍 Monitoring and Logs

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Development logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps

# Manual health check
curl http://localhost:5000/api/health
curl http://localhost:3000/health
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -ano | findstr :5000
   
   # Stop the service or change the port in docker-compose.yml
   ```

2. **Database Connection Issues**
   ```bash
   # Check PostgreSQL logs
   docker-compose logs postgres
   
   # Restart database
   docker-compose restart postgres
   ```

3. **Build Failures**
   ```bash
   # Clean build
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

4. **Permission Issues (Linux/Mac)**
   ```bash
   # Fix ownership
   sudo chown -R $USER:$USER .
   ```

### Reset Everything

```bash
# Complete reset (WARNING: This deletes all data)
.\docker-scripts.ps1 cleanup
```

## 🔒 Security Considerations

### Production Deployment

1. **Change Default Passwords**: Update all default passwords in `docker.env`
2. **Use Secrets**: Use Docker secrets for sensitive data
3. **Network Security**: Configure proper firewall rules
4. **SSL/TLS**: Use reverse proxy with SSL certificates
5. **Regular Updates**: Keep base images updated

### Environment Security

```bash
# Use environment-specific configurations
cp docker.env docker.prod.env
# Edit docker.prod.env with production values
docker-compose --env-file docker.prod.env up
```

## 📊 Performance Optimization

### Resource Limits

Add resource limits in `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

### Scaling

Scale services as needed:

```bash
# Scale backend instances
docker-compose up --scale backend=3
```

## 🚀 Deployment

### Production Deployment

1. **Prepare Environment**:
   ```bash
   cp docker.env docker.prod.env
   # Edit docker.prod.env with production values
   ```

2. **Deploy**:
   ```bash
   docker-compose --env-file docker.prod.env up -d
   ```

3. **Verify**:
   ```bash
   docker-compose ps
   curl http://your-domain.com/api/health
   ```

### CI/CD Integration

The Docker setup is ready for CI/CD integration:

```yaml
# Example GitHub Actions
- name: Build and Deploy
  run: |
    docker-compose build
    docker-compose up -d
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)

## 🆘 Support

If you encounter issues:

1. Check the logs: `.\docker-scripts.ps1 logs`
2. Verify service status: `.\docker-scripts.ps1 status`
3. Check Docker Desktop is running
4. Ensure ports are available
5. Review this documentation

For additional help, check the main project README.md file.
