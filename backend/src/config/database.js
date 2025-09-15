const knex = require('knex');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

// Database configuration
const config = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'startupmatch',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'startupmatch_dev'
    },
    pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      destroyTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds'
    },
    debug: process.env.NODE_ENV === 'development'
  },
  
  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }
    },
    pool: {
      min: 5,
      max: 20,
      acquireTimeoutMillis: 60000,
      createTimeoutMillis: 60000,
      destroyTimeoutMillis: 10000,
      idleTimeoutMillis: 60000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};

// Create database instance
const db = knex(config[process.env.NODE_ENV || 'development']);

// Test database connection
const testConnection = async () => {
  try {
    await db.raw('SELECT 1');
    logger.info('✅ Database connection successful');
    return true;
  } catch (error) {
    logger.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Initialize database with tables
const initializeDatabase = async () => {
  try {
    // Check if tables exist
    const hasUsers = await db.schema.hasTable('users');
    const hasStartups = await db.schema.hasTable('startups');
    const hasMatches = await db.schema.hasTable('matches');
    const hasMessages = await db.schema.hasTable('messages');
    const hasSkills = await db.schema.hasTable('skills');
    const hasIntegrations = await db.schema.hasTable('integrations');

    if (!hasUsers) {
      logger.info('Creating users table...');
      await db.schema.createTable('users', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.string('email').unique().notNullable();
        table.string('password_hash').notNullable();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('avatar_url');
        table.text('bio');
        table.string('location');
        table.string('phone');
        table.boolean('email_verified').defaultTo(false);
        table.boolean('phone_verified').defaultTo(false);
        table.jsonb('preferences').defaultTo('{}');
        table.timestamp('last_active').defaultTo(db.fn.now());
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
        
        // Indexes
        table.index(['email']);
        table.index(['location']);
        table.index(['last_active']);
      });
    }

    if (!hasStartups) {
      logger.info('Creating startups table...');
      await db.schema.createTable('startups', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('founder_id').references('id').inTable('users').onDelete('CASCADE');
        table.string('name').notNullable();
        table.string('tagline').notNullable();
        table.text('description').notNullable();
        table.string('industry').notNullable();
        table.string('stage').notNullable();
        table.string('funding_amount');
        table.string('team_size').notNullable();
        table.string('location').notNullable();
        table.jsonb('images').defaultTo('[]');
        table.jsonb('social_links').defaultTo('{}');
        table.boolean('is_verified').defaultTo(false);
        table.boolean('is_active').defaultTo(true);
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
        
        // Indexes
        table.index(['founder_id']);
        table.index(['industry']);
        table.index(['stage']);
        table.index(['location']);
        table.index(['is_active']);
      });
    }

    if (!hasSkills) {
      logger.info('Creating skills table...');
      await db.schema.createTable('skills', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.string('name').unique().notNullable();
        table.string('category').notNullable();
        table.text('description');
        table.timestamp('created_at').defaultTo(db.fn.now());
        
        // Indexes
        table.index(['name']);
        table.index(['category']);
      });
    }

    if (!hasMatches) {
      logger.info('Creating matches table...');
      await db.schema.createTable('matches', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.uuid('startup_id').references('id').inTable('startups').onDelete('CASCADE');
        table.enum('status', ['pending', 'accepted', 'rejected', 'expired']).defaultTo('pending');
        table.decimal('match_score', 5, 2);
        table.jsonb('match_reasons').defaultTo('[]');
        table.timestamp('matched_at').defaultTo(db.fn.now());
        table.timestamp('responded_at');
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
        
        // Indexes
        table.index(['user_id']);
        table.index(['startup_id']);
        table.index(['status']);
        table.index(['match_score']);
        table.unique(['user_id', 'startup_id']);
      });
    }

    if (!hasMessages) {
      logger.info('Creating messages table...');
      await db.schema.createTable('messages', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('sender_id').references('id').inTable('users').onDelete('CASCADE');
        table.uuid('receiver_id').references('id').inTable('users').onDelete('CASCADE');
        table.text('content').notNullable();
        table.enum('type', ['text', 'image', 'file', 'system']).defaultTo('text');
        table.jsonb('metadata').defaultTo('{}');
        table.boolean('is_read').defaultTo(false);
        table.timestamp('read_at');
        table.timestamp('created_at').defaultTo(db.fn.now());
        
        // Indexes
        table.index(['sender_id']);
        table.index(['receiver_id']);
        table.index(['created_at']);
        table.index(['is_read']);
      });
    }

    if (!hasIntegrations) {
      logger.info('Creating integrations table...');
      await db.schema.createTable('integrations', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.string('platform').notNullable(); // linkedin, github, twitter, website
        table.string('external_id');
        table.string('access_token');
        table.string('refresh_token');
        table.jsonb('profile_data').defaultTo('{}');
        table.timestamp('last_sync').defaultTo(db.fn.now());
        table.boolean('is_active').defaultTo(true);
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
        
        // Indexes
        table.index(['user_id']);
        table.index(['platform']);
        table.index(['is_active']);
        table.unique(['user_id', 'platform']);
      });
    }

    // BiggDate specific tables
    const hasFounders = await db.schema.hasTable('founders');
    if (!hasFounders) {
      logger.info('Creating founders table...');
      await db.schema.createTable('founders', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.string('company').notNullable();
        table.string('title').notNullable();
        table.string('location').notNullable();
        table.string('stage').notNullable();
        table.string('industry').notNullable();
        table.string('funding');
        table.integer('team_size');
        table.string('pitch_video_url');
        table.string('startupos_profile');
        table.integer('vision_match_score');
        table.string('builder_archetype');
        table.string('risk_profile');
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
        
        // Indexes
        table.index(['user_id']);
        table.index(['company']);
        table.index(['stage']);
        table.index(['industry']);
        table.index(['location']);
      });
    }

    const hasFounderSkills = await db.schema.hasTable('founder_skills');
    if (!hasFounderSkills) {
      logger.info('Creating founder_skills table...');
      await db.schema.createTable('founder_skills', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('founder_id').references('id').inTable('founders').onDelete('CASCADE');
        table.string('skill').notNullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
        
        // Indexes
        table.index(['founder_id']);
        table.index(['skill']);
      });
    }

    const hasFounderInterests = await db.schema.hasTable('founder_interests');
    if (!hasFounderInterests) {
      logger.info('Creating founder_interests table...');
      await db.schema.createTable('founder_interests', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('founder_id').references('id').inTable('founders').onDelete('CASCADE');
        table.string('interest').notNullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
        
        // Indexes
        table.index(['founder_id']);
        table.index(['interest']);
      });
    }

    const hasFounderValues = await db.schema.hasTable('founder_values');
    if (!hasFounderValues) {
      logger.info('Creating founder_values table...');
      await db.schema.createTable('founder_values', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('founder_id').references('id').inTable('founders').onDelete('CASCADE');
        table.string('value').notNullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
        
        // Indexes
        table.index(['founder_id']);
        table.index(['value']);
      });
    }

    const hasFounderGoals = await db.schema.hasTable('founder_goals');
    if (!hasFounderGoals) {
      logger.info('Creating founder_goals table...');
      await db.schema.createTable('founder_goals', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('founder_id').references('id').inTable('founders').onDelete('CASCADE');
        table.string('goal').notNullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
        
        // Indexes
        table.index(['founder_id']);
        table.index(['goal']);
      });
    }

    const hasEmotionalCheckins = await db.schema.hasTable('emotional_checkins');
    if (!hasEmotionalCheckins) {
      logger.info('Creating emotional_checkins table...');
      await db.schema.createTable('emotional_checkins', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('founder_id').references('id').inTable('founders').onDelete('CASCADE');
        table.enum('mood', ['excellent', 'good', 'neutral', 'challenging', 'difficult']).notNullable();
        table.integer('energy').notNullable(); // 1-10 scale
        table.integer('stress').notNullable(); // 1-10 scale
        table.integer('focus').notNullable(); // 1-10 scale
        table.text('notes');
        table.timestamp('created_at').defaultTo(db.fn.now());
        
        // Indexes
        table.index(['founder_id']);
        table.index(['mood']);
        table.index(['created_at']);
      });
    }

    const hasBuilderRetreats = await db.schema.hasTable('builder_retreats');
    if (!hasBuilderRetreats) {
      logger.info('Creating builder_retreats table...');
      await db.schema.createTable('builder_retreats', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.string('name').notNullable();
        table.text('description');
        table.string('location').notNullable();
        table.date('start_date').notNullable();
        table.date('end_date').notNullable();
        table.integer('max_participants');
        table.decimal('price', 10, 2);
        table.string('status').defaultTo('upcoming');
        table.jsonb('activities').defaultTo('[]');
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
        
        // Indexes
        table.index(['start_date']);
        table.index(['location']);
        table.index(['status']);
      });
    }

    const hasRetreatRegistrations = await db.schema.hasTable('retreat_registrations');
    if (!hasRetreatRegistrations) {
      logger.info('Creating retreat_registrations table...');
      await db.schema.createTable('retreat_registrations', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('retreat_id').references('id').inTable('builder_retreats').onDelete('CASCADE');
        table.uuid('founder_id').references('id').inTable('founders').onDelete('CASCADE');
        table.timestamp('registration_date').defaultTo(db.fn.now());
        table.string('status').defaultTo('confirmed');
        table.timestamp('created_at').defaultTo(db.fn.now());
        
        // Indexes
        table.index(['retreat_id']);
        table.index(['founder_id']);
        table.index(['status']);
      });
    }

    const hasCompatibilityScores = await db.schema.hasTable('compatibility_scores');
    if (!hasCompatibilityScores) {
      logger.info('Creating compatibility_scores table...');
      await db.schema.createTable('compatibility_scores', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('founder_id_1').references('id').inTable('founders').onDelete('CASCADE');
        table.uuid('founder_id_2').references('id').inTable('founders').onDelete('CASCADE');
        table.integer('overall_score').notNullable();
        table.integer('vision_alignment');
        table.integer('risk_sync');
        table.integer('emotional_availability');
        table.integer('lifestyle_compatibility');
        table.integer('communication_style');
        table.jsonb('insights').defaultTo('{}');
        table.jsonb('red_flags').defaultTo('[]');
        table.jsonb('recommendations').defaultTo('[]');
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
        
        // Indexes
        table.index(['founder_id_1']);
        table.index(['founder_id_2']);
        table.index(['overall_score']);
        table.unique(['founder_id_1', 'founder_id_2']);
      });
    }

    logger.info('✅ Database initialization completed');
    return true;
  } catch (error) {
    logger.error('❌ Database initialization failed:', error);
    throw error;
  }
};

// Connect to database
const connectDB = async () => {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      await initializeDatabase();
      return db;
    } else {
      throw new Error('Database connection failed');
    }
  } catch (error) {
    logger.error('Database connection error:', error);
    throw error;
  }
};

// Close database connection
const closeDB = async () => {
  try {
    await db.destroy();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
  }
};

module.exports = {
  db,
  connectDB,
  closeDB,
  testConnection
};
