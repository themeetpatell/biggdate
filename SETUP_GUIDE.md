# Co-Builders Database Setup Guide

## 🚀 **Quick Start Options**

Choose one of the following setup methods:

### **Option 1: Docker Setup (Recommended)**
If you have Docker installed, this is the easiest way to get started.

### **Option 2: Local PostgreSQL Setup**
If you prefer to install PostgreSQL locally on your system.

---

## 🐳 **Option 1: Docker Setup (Recommended)**

### **Prerequisites**
- Docker Desktop installed
- Docker Compose installed

### **Installation Steps**

#### **1. Install Docker**
- **macOS**: Download from [Docker Desktop for Mac](https://docs.docker.com/desktop/mac/install/)
- **Windows**: Download from [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/install/)
- **Linux**: Follow [Docker Engine installation guide](https://docs.docker.com/engine/install/)

#### **2. Run Setup Script**
```bash
# Make script executable and run
chmod +x scripts/setup-docker-db.sh
./scripts/setup-docker-db.sh
```

#### **3. Verify Setup**
```bash
# Check if services are running
docker-compose -f docker-compose.db.yml ps

# Access database admin interface
open http://localhost:8080
```

### **Docker Services**
- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`
- **Adminer (DB Admin)**: `http://localhost:8080`

### **Connection Details**
- **Database**: `cobuilders_dev`
- **Username**: `cobuilders`
- **Password**: `cobuilders123`

---

## 🗄️ **Option 2: Local PostgreSQL Setup**

### **Prerequisites**
- PostgreSQL 12+ installed
- Node.js 18+ installed

### **Installation Steps**

#### **macOS (using Homebrew)**
```bash
# Install PostgreSQL
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Create user and database
createuser -s cobuilders
createdb cobuilders_dev
```

#### **Ubuntu/Debian**
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create user and database
sudo -u postgres createuser -s cobuilders
sudo -u postgres createdb cobuilders_dev
```

#### **Windows**
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Install with default settings
3. Create user and database using pgAdmin or command line

### **Setup Database**
```bash
# Navigate to backend directory
cd backend

# Copy environment file
cp env.example .env

# Edit .env file with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=cobuilders
# DB_PASSWORD=your_password
# DB_NAME=cobuilders_dev

# Install dependencies
npm install

# Run database setup
npm run db:setup
```

---

## 📊 **Database Schema Overview**

The Co-Builders database includes the following tables:

### **Core Tables**
- **users** - User accounts and authentication
- **profiles** - Founder/cofounder profiles
- **skills** - Available skills and categories
- **matches** - Cofounder matching data
- **messages** - User messaging system

### **Workspace Tables**
- **projects** - Startup projects
- **milestones** - Project milestones
- **tasks** - Project tasks

### **Sample Data**
The database comes pre-seeded with:
- 5 sample users with complete profiles
- 50+ skills across different categories
- Sample projects and tasks

---

## 🔧 **Database Commands**

### **Migration Commands**
```bash
# Run all pending migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback

# Check migration status
npm run db:status
```

### **Seed Commands**
```bash
# Run all seed files
npm run seed

# Reset and reseed specific data
npm run seed:reset
```

### **Database Management**
```bash
# Complete database setup
npm run db:setup

# Reset entire database
npm run db:reset
```

---

## 🧪 **Testing the Setup**

### **Test Database Connection**
```bash
# Using psql (if installed locally)
psql -h localhost -U cobuilders -d cobuilders_dev -c "SELECT version();"

# Using Node.js
cd backend
node -e "
const knex = require('knex');
const config = require('./knexfile.js');
const db = knex(config.development);
db.raw('SELECT 1').then(() => {
  console.log('✅ Database connection successful');
  process.exit(0);
}).catch(err => {
  console.error('❌ Database connection failed:', err.message);
  process.exit(1);
});
"
```

### **Test API Endpoints**
```bash
# Start the backend server
cd backend
npm run dev

# Test health endpoint
curl http://localhost:5001/health

# Test database connection endpoint
curl http://localhost:5001/api/health
```

---

## 🛠️ **Troubleshooting**

### **Docker Issues**

#### **Docker Not Running**
```bash
# Start Docker Desktop
# On macOS: Open Docker Desktop app
# On Windows: Start Docker Desktop
# On Linux: sudo systemctl start docker
```

#### **Port Already in Use**
```bash
# Check what's using port 5432
lsof -i :5432

# Stop conflicting services
# Or change ports in docker-compose.db.yml
```

#### **Container Won't Start**
```bash
# Check container logs
docker-compose -f docker-compose.db.yml logs postgres

# Remove and recreate containers
docker-compose -f docker-compose.db.yml down -v
docker-compose -f docker-compose.db.yml up -d
```

### **Local PostgreSQL Issues**

#### **Connection Refused**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql
# or
sudo systemctl status postgresql

# Start PostgreSQL
brew services start postgresql
# or
sudo systemctl start postgresql
```

#### **Authentication Failed**
```bash
# Check user permissions
sudo -u postgres psql -c "\du"

# Create user with proper permissions
sudo -u postgres createuser -s cobuilders
sudo -u postgres createdb cobuilders_dev
```

#### **Database Does Not Exist**
```bash
# Create database
createdb -h localhost -U cobuilders cobuilders_dev
```

### **Migration Errors**
```bash
# Check migration status
npm run db:status

# Rollback and re-run
npm run migrate:rollback
npm run migrate
```

---

## 🔒 **Security Considerations**

### **Development Environment**
- Default credentials are provided for easy setup
- Database is only accessible from localhost
- No SSL required for local development

### **Production Environment**
- Change all default passwords
- Use SSL connections
- Restrict database access
- Regular backups
- Monitor access logs

---

## 📚 **Next Steps**

Once the database is set up:

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:3002
   - Backend API: http://localhost:5001
   - Database Admin (Docker): http://localhost:8080

4. **Test the Features**
   - User registration and login
   - Profile creation
   - Cofounder matching
   - Messaging system
   - Workspace features

---

## 🎉 **You're Ready!**

The Co-Builders database is now set up and ready to support:
- ✅ User authentication and profiles
- ✅ Cofounder matching algorithms
- ✅ Real-time messaging
- ✅ Workspace collaboration
- ✅ Project management
- ✅ Milestone tracking

Happy coding! 🚀
