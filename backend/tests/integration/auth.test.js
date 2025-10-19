const request = require('supertest');
const { app } = require('../../src/server');
const { db } = require('../../src/config/database');
const bcrypt = require('bcryptjs');

describe('Authentication API', () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    // Setup test database
    await db.migrate.latest();
    await db.seed.run();
  });

  afterAll(async () => {
    // Cleanup test database
    await db.destroy();
  });

  beforeEach(async () => {
    // Clear test data before each test
    await db('users').del();
    await db('refresh_tokens').del();
    await db('password_reset_tokens').del();
  });

  describe('POST /api/auth/register', () => {
    const validUserData = {
      email: 'test@example.com',
      password: 'TestPass123!',
      firstName: 'John',
      lastName: 'Doe',
      location: 'San Francisco, CA',
      phone: '+1-555-123-4567'
    };

    it('should register a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('tokens');
      expect(response.body.user.email).toBe(validUserData.email);
      expect(response.body.user.firstName).toBe(validUserData.firstName);
      expect(response.body.user.lastName).toBe(validUserData.lastName);
      expect(response.body.tokens).toHaveProperty('accessToken');
      expect(response.body.tokens).toHaveProperty('refreshToken');

      // Verify user was created in database
      const dbUser = await db('users').where('email', validUserData.email).first();
      expect(dbUser).toBeTruthy();
      expect(dbUser.email).toBe(validUserData.email);
      expect(dbUser.first_name).toBe(validUserData.firstName);
      expect(dbUser.last_name).toBe(validUserData.lastName);
      expect(dbUser.is_active).toBe(true);
      expect(dbUser.email_verified).toBe(false);

      // Verify password was hashed
      const isPasswordValid = await bcrypt.compare(validUserData.password, dbUser.password_hash);
      expect(isPasswordValid).toBe(true);

      // Verify refresh token was stored
      const refreshToken = await db('refresh_tokens')
        .where('user_id', dbUser.id)
        .first();
      expect(refreshToken).toBeTruthy();
    });

    it('should reject registration with invalid email', async () => {
      const invalidData = { ...validUserData, email: 'invalid-email' };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.details).toHaveLength(1);
      expect(response.body.details[0].msg).toContain('valid email address');
    });

    it('should reject registration with weak password', async () => {
      const invalidData = { ...validUserData, password: 'weak' };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.details).toHaveLength(1);
      expect(response.body.details[0].msg).toContain('at least 8 characters long');
    });

    it('should reject registration with existing email', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(201);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(409);

      expect(response.body).toHaveProperty('error', 'User with this email already exists');
      expect(response.body).toHaveProperty('code', 'USER_EXISTS');
    });

    it('should reject registration with missing required fields', async () => {
      const incompleteData = {
        email: 'test@example.com',
        password: 'TestPass123!'
        // Missing firstName and lastName
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.details).toHaveLength(2); // firstName and lastName missing
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      const hashedPassword = await bcrypt.hash('TestPass123!', 12);
      const [userId] = await db('users').insert({
        email: 'test@example.com',
        password_hash: hashedPassword,
        first_name: 'John',
        last_name: 'Doe',
        is_active: true
      }).returning('id');

      testUser = { id: userId, email: 'test@example.com' };
    });

    it('should login user with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPass123!'
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('tokens');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.tokens).toHaveProperty('accessToken');
      expect(response.body.tokens).toHaveProperty('refreshToken');

      // Verify last_active was updated
      const dbUser = await db('users').where('id', testUser.id).first();
      expect(dbUser.last_active).toBeTruthy();
    });

    it('should reject login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'TestPass123!'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid email or password');
      expect(response.body).toHaveProperty('code', 'INVALID_CREDENTIALS');
    });

    it('should reject login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123!'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid email or password');
      expect(response.body).toHaveProperty('code', 'INVALID_CREDENTIALS');
    });

    it('should reject login with deactivated account', async () => {
      // Deactivate the test user
      await db('users')
        .where('id', testUser.id)
        .update({ is_active: false });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPass123!'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Account is deactivated. Please contact support.');
      expect(response.body).toHaveProperty('code', 'ACCOUNT_DEACTIVATED');
    });

    it('should reject login with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'TestPass123!'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken;

    beforeEach(async () => {
      // Create a test user and generate tokens
      const hashedPassword = await bcrypt.hash('TestPass123!', 12);
      const [userId] = await db('users').insert({
        email: 'test@example.com',
        password_hash: hashedPassword,
        first_name: 'John',
        last_name: 'Doe',
        is_active: true
      }).returning('id');

      testUser = { id: userId, email: 'test@example.com' };

      // Generate refresh token
      const jwt = require('jsonwebtoken');
      refreshToken = jwt.sign(
        { userId: testUser.id, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET || 'test_refresh_secret',
        { expiresIn: '7d' }
      );

      // Store refresh token in database
      await db('refresh_tokens').insert({
        user_id: testUser.id,
        token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
    });

    it('should refresh access token with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Token refreshed successfully');
      expect(response.body).toHaveProperty('tokens');
      expect(response.body.tokens).toHaveProperty('accessToken');
      expect(response.body.tokens).toHaveProperty('refreshToken');
    });

    it('should reject refresh with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid refresh token');
      expect(response.body).toHaveProperty('code', 'INVALID_REFRESH_TOKEN');
    });

    it('should reject refresh with missing token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Refresh token is required');
      expect(response.body).toHaveProperty('code', 'NO_REFRESH_TOKEN');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken: 'some-token' })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Logout successful');
    });

    it('should logout user without refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({})
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Logout successful');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    beforeEach(async () => {
      // Create a test user
      const hashedPassword = await bcrypt.hash('TestPass123!', 12);
      const [userId] = await db('users').insert({
        email: 'test@example.com',
        password_hash: hashedPassword,
        first_name: 'John',
        last_name: 'Doe',
        is_active: true
      }).returning('id');

      testUser = { id: userId, email: 'test@example.com' };
    });

    it('should send password reset email for existing user', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'test@example.com' })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'If an account with that email exists, a password reset link has been sent');

      // Verify reset token was created
      const resetToken = await db('password_reset_tokens')
        .where('user_id', testUser.id)
        .first();
      expect(resetToken).toBeTruthy();
      expect(resetToken.expires_at).toBeTruthy();
    });

    it('should not reveal if user exists for non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'If an account with that email exists, a password reset link has been sent');

      // Verify no reset token was created
      const resetTokens = await db('password_reset_tokens').select('*');
      expect(resetTokens).toHaveLength(0);
    });

    it('should reject request with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'invalid-email' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });
  });

  describe('Rate Limiting', () => {
    it('should limit authentication attempts', async () => {
      const validData = {
        email: 'test@example.com',
        password: 'TestPass123!'
      };

      // Make multiple login attempts
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/auth/login')
          .send(validData)
          .expect(401); // Will fail due to no user existing
      }

      // 6th attempt should be rate limited
      const response = await request(app)
        .post('/api/auth/login')
        .send(validData)
        .expect(429);

      expect(response.body).toHaveProperty('error', 'Too many authentication attempts, please try again later.');
      expect(response.body).toHaveProperty('code', 'RATE_LIMIT_EXCEEDED');
    });
  });
});
