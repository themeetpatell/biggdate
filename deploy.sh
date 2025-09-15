#!/bin/bash

# BiggDate Production Deployment Script
set -e

echo "🚀 Starting BiggDate Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_warning "Creating .env file with default values..."
    cat > .env << EOF
# Database Configuration
DB_PASSWORD=secure_password_123
REDIS_PASSWORD=redis_password_123

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_change_in_production

# Monitoring
GRAFANA_PASSWORD=admin123
RABBITMQ_PASSWORD=rabbit_password_123

# API Configuration
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
EOF
    print_warning "Please update the .env file with your production values before deploying!"
fi

# Build the application
print_status "Building the application..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Build completed successfully!"
else
    print_error "Build failed. Please fix the errors and try again."
    exit 1
fi

# Build and start the containers
print_status "Building and starting Docker containers..."
docker-compose up --build -d

if [ $? -eq 0 ]; then
    print_status "Containers started successfully!"
else
    print_error "Failed to start containers. Please check the logs and try again."
    exit 1
fi

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Check if services are running
print_status "Checking service health..."

# Check frontend
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    print_status "✅ Frontend is running on http://localhost:3000"
else
    print_warning "⚠️  Frontend health check failed"
fi

# Check backend
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    print_status "✅ Backend is running on http://localhost:5000"
else
    print_warning "⚠️  Backend health check failed"
fi

# Check database
if docker-compose exec postgres pg_isready -U biggdate_user -d biggdate_prod > /dev/null 2>&1; then
    print_status "✅ Database is running"
else
    print_warning "⚠️  Database health check failed"
fi

# Check Redis
if docker-compose exec redis redis-cli ping > /dev/null 2>&1; then
    print_status "✅ Redis is running"
else
    print_warning "⚠️  Redis health check failed"
fi

print_status "🎉 Deployment completed!"
print_status "Frontend: http://localhost:3000"
print_status "Backend API: http://localhost:5000"
print_status "Grafana: http://localhost:3001 (admin/admin123)"
print_status "RabbitMQ Management: http://localhost:15672 (startupmatch/rabbit_password_123)"

print_warning "Remember to:"
print_warning "1. Update the .env file with production values"
print_warning "2. Set up SSL certificates for production"
print_warning "3. Configure your domain name"
print_warning "4. Set up monitoring and alerting"

echo ""
print_status "To stop the services, run: docker-compose down"
print_status "To view logs, run: docker-compose logs -f"
