#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Co-Builders Database...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📝 Creating .env file from template...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created. Please update the database credentials.\n');
  } else {
    console.log('❌ No .env.example file found. Creating basic .env file...');
    const basicEnv = `# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=cobuilders
DB_PASSWORD=cobuilders123
DB_NAME=cobuilders_dev

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Server Configuration
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3002
`;
    fs.writeFileSync(envPath, basicEnv);
    console.log('✅ Basic .env file created. Please update the database credentials.\n');
  }
}

// Function to run command and handle errors
function runCommand(command, description) {
  try {
    console.log(`🔄 ${description}...`);
    execSync(command, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log(`✅ ${description} completed.\n`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

// Check if PostgreSQL is running
function checkPostgreSQL() {
  try {
    console.log('🔍 Checking PostgreSQL connection...');
    execSync('psql --version', { stdio: 'pipe' });
    console.log('✅ PostgreSQL is installed.\n');
  } catch (error) {
    console.error('❌ PostgreSQL is not installed or not in PATH.');
    console.log('Please install PostgreSQL and ensure it\'s running.\n');
    process.exit(1);
  }
}

// Create database if it doesn't exist
function createDatabase() {
  try {
    console.log('🗄️  Creating database if it doesn\'t exist...');
    const dbName = process.env.DB_NAME || 'cobuilders_dev';
    const dbUser = process.env.DB_USER || 'cobuilders';
    const dbPassword = process.env.DB_PASSWORD || 'cobuilders123';
    
    // Set password for psql
    process.env.PGPASSWORD = dbPassword;
    
    // Try to create database (will fail if it exists, which is fine)
    try {
      execSync(`createdb -h localhost -U ${dbUser} ${dbName}`, { stdio: 'pipe' });
      console.log('✅ Database created successfully.\n');
    } catch (createError) {
      // Database might already exist, try to connect
      try {
        execSync(`psql -h localhost -U ${dbUser} -d ${dbName} -c "SELECT 1;"`, { stdio: 'pipe' });
        console.log('✅ Database already exists and is accessible.\n');
      } catch (connectError) {
        console.error('❌ Cannot connect to database. Please check your credentials.');
        console.log('Make sure PostgreSQL is running and the user has proper permissions.\n');
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

// Main setup function
async function setupDatabase() {
  try {
    // Load environment variables
    require('dotenv').config();
    
    checkPostgreSQL();
    createDatabase();
    
    // Run migrations
    runCommand('npm run migrate', 'Running database migrations');
    
    // Run seeds
    runCommand('npm run seed', 'Seeding database with initial data');
    
    console.log('🎉 Database setup completed successfully!');
    console.log('\n📊 Database Summary:');
    console.log('   - Users table created');
    console.log('   - Profiles table created');
    console.log('   - Skills table created');
    console.log('   - Matches table created');
    console.log('   - Messages table created');
    console.log('   - Workspace tables created');
    console.log('   - Sample data seeded');
    console.log('\n🚀 You can now start the backend server with: npm run dev');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup
setupDatabase();
