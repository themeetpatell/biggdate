#!/usr/bin/env node

const knex = require('knex');
const config = require('../knexfile.js');

console.log('🔍 Testing database connection...\n');

async function testConnection() {
  const db = knex(config.development);
  
  try {
    // Test basic connection
    console.log('🔄 Testing basic connection...');
    await db.raw('SELECT 1');
    console.log('✅ Basic connection successful');
    
    // Test database version
    console.log('🔄 Getting database version...');
    const version = await db.raw('SELECT version()');
    console.log('✅ Database version:', version.rows[0].version.split(' ')[0]);
    
    // Test if tables exist
    console.log('🔄 Checking if tables exist...');
    const tables = await db.raw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tables.rows.length > 0) {
      console.log('✅ Tables found:');
      tables.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log('⚠️  No tables found. Run migrations first: npm run migrate');
    }
    
    // Test sample data
    console.log('🔄 Checking for sample data...');
    try {
      const userCount = await db('users').count('* as count');
      const profileCount = await db('profiles').count('* as count');
      const skillCount = await db('skills').count('* as count');
      
      console.log('✅ Sample data found:');
      console.log(`   - Users: ${userCount[0].count}`);
      console.log(`   - Profiles: ${profileCount[0].count}`);
      console.log(`   - Skills: ${skillCount[0].count}`);
    } catch (error) {
      console.log('⚠️  Tables exist but no data found. Run seeds: npm run seed');
    }
    
    console.log('\n🎉 Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check your .env file configuration');
    console.log('3. Verify database credentials');
    console.log('4. Run: npm run db:setup');
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

// Run the test
testConnection();
