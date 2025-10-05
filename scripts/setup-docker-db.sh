#!/bin/bash

echo "🐳 Setting up Co-Builders Database with Docker..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Navigate to project root
cd "$(dirname "$0")/.."

# Create .env file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating .env file..."
    cp backend/env.example backend/.env
    echo "✅ .env file created"
    echo ""
fi

# Start database services
echo "🚀 Starting database services..."
docker-compose -f docker-compose.db.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose -f docker-compose.db.yml ps

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker-compose -f docker-compose.db.yml exec postgres pg_isready -U cobuilders -d cobuilders_dev; do
    echo "Waiting for PostgreSQL..."
    sleep 2
done

echo "✅ PostgreSQL is ready!"
echo ""

# Run database migrations
echo "🔄 Running database migrations..."
cd backend
npm install
npm run migrate

# Run database seeds
echo "🌱 Seeding database..."
npm run seed

echo ""
echo "🎉 Database setup completed successfully!"
echo ""
echo "📊 Services running:"
echo "   - PostgreSQL: localhost:5432"
echo "   - Redis: localhost:6379"
echo "   - Adminer (DB Admin): http://localhost:8080"
echo ""
echo "🔗 Connection details:"
echo "   - Database: cobuilders_dev"
echo "   - Username: cobuilders"
echo "   - Password: cobuilders123"
echo ""
echo "🚀 You can now start the backend server with:"
echo "   cd backend && npm run dev"
echo ""
echo "🛑 To stop the database services:"
echo "   docker-compose -f docker-compose.db.yml down"
echo ""
echo "🔄 To restart the database services:"
echo "   docker-compose -f docker-compose.db.yml restart"
