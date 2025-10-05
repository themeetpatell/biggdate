# Co-Builders Database Setup Guide

## 🗄️ **Database Overview**

The Co-Builders application uses PostgreSQL as the primary database with Knex.js for query building and migrations. The database is designed to support cofounder matching, user profiles, messaging, and workspace collaboration.

## 📋 **Prerequisites**

### **Required Software**
- **PostgreSQL 12+** - Database server
- **Node.js 18+** - Runtime environment
- **npm** - Package manager

### **Installation**

#### **macOS (using Homebrew)**
```bash
# Install PostgreSQL
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Create a user and database
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

# Create a user and database
sudo -u postgres createuser -s cobuilders
sudo -u postgres createdb cobuilders_dev
```

#### **Windows**
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Install with default settings
3. Create user and database using pgAdmin or command line

## 🚀 **Quick Setup**

### **1. Environment Configuration**
```bash
cd backend
cp env.example .env
```

Edit the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=cobuilders
DB_PASSWORD=cobuilders123
DB_NAME=cobuilders_dev
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Run Database Setup**
```bash
npm run db:setup
```

This will:
- Create the database if it doesn't exist
- Run all migrations
- Seed the database with sample data

## 📊 **Database Schema**

### **Core Tables**

#### **Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  avatar_url VARCHAR,
  bio TEXT,
  location VARCHAR,
  phone VARCHAR,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  preferences JSONB DEFAULT '{}',
  last_active TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Profiles Table**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  company VARCHAR NOT NULL,
  company_stage VARCHAR NOT NULL,
  industry VARCHAR NOT NULL,
  location VARCHAR NOT NULL,
  bio TEXT NOT NULL,
  vision TEXT NOT NULL,
  values JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]',
  achievements JSONB DEFAULT '[]',
  funding JSONB DEFAULT '{}',
  team_size INTEGER DEFAULT 1,
  looking_for JSONB DEFAULT '{}',
  availability VARCHAR DEFAULT 'actively-looking',
  website VARCHAR,
  linkedin_url VARCHAR,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Skills Table**
```sql
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR UNIQUE NOT NULL,
  category VARCHAR NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **Matches Table**
```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  matched_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR DEFAULT 'pending',
  match_score DECIMAL(5,2),
  match_reasons JSONB DEFAULT '[]',
  matched_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Messages Table**
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type VARCHAR DEFAULT 'text',
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Workspace Tables**

#### **Projects Table**
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  status VARCHAR DEFAULT 'planning',
  priority VARCHAR DEFAULT 'medium',
  start_date DATE,
  due_date DATE,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Milestones Table**
```sql
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  status VARCHAR DEFAULT 'pending',
  target_date DATE,
  completed_date DATE,
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Tasks Table**
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  status VARCHAR DEFAULT 'todo',
  priority VARCHAR DEFAULT 'medium',
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  due_date DATE,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

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

## 📝 **Sample Data**

The database comes pre-seeded with:

### **Users (5 sample users)**
- Alex Chen - CTO & Co-Founder (TechFlow AI)
- Sarah Martinez - CEO & Co-Founder (HealthAI Solutions)
- David Kim - Head of Design & Co-Founder (CreativeFlow)
- Emma Wilson - VP Product & Co-Founder (DataFlow Analytics)
- Michael Rodriguez - CMO & Co-Founder (GrowthFlow Marketing)

### **Skills (50+ skills)**
- Technical: React, Node.js, Python, AWS, etc.
- Business: Product Management, Marketing, Sales, etc.
- Design: UI/UX Design, Brand Design, etc.
- Industries: Fintech, Healthcare, SaaS, etc.

### **Profiles**
- Complete founder profiles with company information
- Skills, achievements, and funding details
- Looking-for preferences and availability

## 🔍 **Database Connection Testing**

### **Test Connection**
```bash
# Using psql
psql -h localhost -U cobuilders -d cobuilders_dev -c "SELECT version();"

# Using Node.js
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

## 🛠️ **Troubleshooting**

### **Common Issues**

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

#### **Migration Errors**
```bash
# Check migration status
npm run db:status

# Rollback and re-run
npm run migrate:rollback
npm run migrate
```

### **Reset Everything**
```bash
# Drop and recreate database
dropdb -h localhost -U cobuilders cobuilders_dev
createdb -h localhost -U cobuilders cobuilders_dev
npm run db:setup
```

## 📊 **Database Monitoring**

### **Performance Monitoring**
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check database size
SELECT pg_size_pretty(pg_database_size('cobuilders_dev'));

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### **Query Performance**
```sql
-- Enable query logging
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();
```

## 🔒 **Security Considerations**

### **Production Setup**
1. **Change default passwords**
2. **Use SSL connections**
3. **Restrict database access**
4. **Regular backups**
5. **Monitor access logs**

### **Environment Variables**
```env
# Production database settings
DB_HOST=your-production-host
DB_PORT=5432
DB_USER=your-secure-user
DB_PASSWORD=your-strong-password
DB_NAME=cobuilders_prod
```

## 📚 **Additional Resources**

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Knex.js Documentation](https://knexjs.org/)
- [Database Design Best Practices](https://www.postgresql.org/docs/current/ddl.html)

---

## 🎉 **You're Ready!**

Once the database is set up, you can:
1. Start the backend server: `npm run dev`
2. Connect the frontend to the API
3. Begin development and testing

The database is now ready to support all Co-Builders features including user management, cofounder matching, messaging, and workspace collaboration!
