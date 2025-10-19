const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const { connectDB } = require('../config/database');

// Founder Profile Management
router.get('/founders/:founderId', authMiddleware, async (req, res) => {
  try {
    const { founderId } = req.params;
    const db = await connectDB();
    
    // Get founder profile with enhanced data
    const founder = await db('founders')
      .where('id', founderId)
      .first();
    
    if (!founder) {
      return res.status(404).json({ error: 'Founder not found' });
    }
    
    // Get founder skills, interests, and values
    const skills = await db('founder_skills')
      .where('founder_id', founderId)
      .select('skill');
    
    const interests = await db('founder_interests')
      .where('founder_id', founderId)
      .select('interest');
    
    const values = await db('founder_values')
      .where('founder_id', founderId)
      .select('value');
    
    // Calculate VisionMatch score (AI-powered)
    const visionMatchScore = await calculateVisionMatchScore(founder);
    
    // Determine builder archetype
    const builderArchetype = determineBuilderArchetype(founder, skills);
    
    // Assess risk profile
    const riskProfile = assessRiskProfile(founder);
    
    // Get compatibility insights
    const compatibilityInsights = await getCompatibilityInsights(founderId);
    
    res.json({
      founder: {
        ...founder,
        skills: skills.map(s => s.skill),
        interests: interests.map(i => i.interest),
        values: values.map(v => v.value)
      },
      visionMatchScore,
      builderArchetype,
      riskProfile,
      compatibilityInsights
    });
    
  } catch (error) {
    console.error('Error fetching founder profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/founders/profile', authMiddleware, [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('company').notEmpty().withMessage('Company name is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('stage').notEmpty().withMessage('Funding stage is required'),
  body('industry').notEmpty().withMessage('Industry is required'),
  body('skills').isArray().withMessage('Skills must be an array'),
  body('interests').isArray().withMessage('Interests must be an array'),
  body('values').isArray().withMessage('Values must be an array'),
  body('goals').isArray().withMessage('Goals must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const founderId = req.user.id;
    const db = await connectDB();
    
    const {
      firstName, lastName, company, title, location, stage, industry,
      funding, teamSize, skills, interests, values, goals, pitchVideoUrl
    } = req.body;
    
    // Update founder profile
    await db('founders')
      .where('id', founderId)
      .update({
        first_name: firstName,
        last_name: lastName,
        company,
        title,
        location,
        stage,
        industry,
        funding: funding || null,
        team_size: teamSize || null,
        pitch_video_url: pitchVideoUrl || null,
        updated_at: new Date()
      });
    
    // Update skills
    await db('founder_skills').where('founder_id', founderId).del();
    if (skills.length > 0) {
      const skillData = skills.map(skill => ({
        founder_id: founderId,
        skill,
        created_at: new Date()
      }));
      await db('founder_skills').insert(skillData);
    }
    
    // Update interests
    await db('founder_interests').where('founder_id', founderId).del();
    if (interests.length > 0) {
      const interestData = interests.map(interest => ({
        founder_id: founderId,
        interest,
        created_at: new Date()
      }));
      await db('founder_interests').insert(interestData);
    }
    
    // Update values
    await db('founder_values').where('founder_id', founderId).del();
    if (values.length > 0) {
      const valueData = values.map(value => ({
        founder_id: founderId,
        value,
        created_at: new Date()
      }));
      await db('founder_values').insert(valueData);
    }
    
    // Update goals
    await db('founder_goals').where('founder_id', founderId).del();
    if (goals.length > 0) {
      const goalData = goals.map(goal => ({
        founder_id: founderId,
        goal,
        created_at: new Date()
      }));
      await db('founder_goals').insert(goalData);
    }
    
    // Get updated profile
    const updatedFounder = await db('founders').where('id', founderId).first();
    
    res.json({
      message: 'Profile updated successfully',
      founder: updatedFounder
    });
    
  } catch (error) {
    console.error('Error updating founder profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// VisionMatch AI & Compatibility
router.post('/compatibility', authMiddleware, [
  body('founderId1').notEmpty().withMessage('Founder ID 1 is required'),
  body('founderId2').notEmpty().withMessage('Founder ID 2 is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { founderId1, founderId2 } = req.body;
    const db = await connectDB();
    
    // Get both founder profiles
    const founder1 = await db('founders').where('id', founderId1).first();
    const founder2 = await db('founders').where('id', founderId2).first();
    
    if (!founder1 || !founder2) {
      return res.status(404).json({ error: 'One or both founders not found' });
    }
    
    // Calculate compatibility score using AI algorithm
    const compatibilityScore = await calculateCompatibilityScore(founder1, founder2);
    
    // Generate insights and recommendations
    const insights = await generateCompatibilityInsights(founder1, founder2, compatibilityScore);
    
    // Check for red flags
    const redFlags = await detectRedFlags(founder1, founder2);
    
    // Generate recommendations
    const recommendations = await generateRecommendations(founder1, founder2, compatibilityScore);
    
    res.json({
      score: compatibilityScore,
      breakdown: {
        visionAlignment: insights.visionAlignment,
        riskSync: insights.riskSync,
        emotionalAvailability: insights.emotionalAvailability,
        lifestyleCompatibility: insights.lifestyleCompatibility,
        communicationStyle: insights.communicationStyle
      },
      insights,
      redFlags,
      recommendations
    });
    
  } catch (error) {
    console.error('Error calculating compatibility:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Daily Match Discovery
router.get('/daily-matches', authMiddleware, async (req, res) => {
  try {
    const founderId = req.user.id;
    const db = await connectDB();
    
    // Get founder preferences and filters
    const founder = await db('founders').where('id', founderId).first();
    const preferences = await db('founder_preferences').where('founder_id', founderId).first();
    
    // Get potential matches using AI algorithm
    const matches = await getDailyMatches(founder, preferences);
    
    // Calculate next batch time
    const nextBatchTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    
    res.json({
      matches,
      nextBatchTime,
      totalAvailable: matches.length,
      filters: preferences || {}
    });
    
  } catch (error) {
    console.error('Error fetching daily matches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Emotional Intelligence & Check-ins
router.post('/emotional-checkin', authMiddleware, [
  body('mood').isIn(['excellent', 'good', 'neutral', 'challenging', 'difficult']).withMessage('Valid mood is required'),
  body('energy').isInt({ min: 1, max: 10 }).withMessage('Energy level must be 1-10'),
  body('stress').isInt({ min: 1, max: 10 }).withMessage('Stress level must be 1-10'),
  body('focus').isInt({ min: 1, max: 10 }).withMessage('Focus level must be 1-10'),
  body('notes').optional().isString().withMessage('Notes must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const founderId = req.user.id;
    const { mood, energy, stress, focus, notes } = req.body;
    const db = await connectDB();
    
    // Save emotional check-in
    const checkInId = await db('emotional_checkins').insert({
      founder_id: founderId,
      mood,
      energy,
      stress,
      focus,
      notes: notes || null,
      created_at: new Date()
    });
    
    // Get the saved check-in
    const checkIn = await db('emotional_checkins').where('id', checkInId[0]).first();
    
    // Analyze emotional state and provide insights
    const currentState = await analyzeEmotionalState(founderId);
    const insights = await generateEmotionalInsights(founderId);
    const recommendations = await generateEmotionalRecommendations(founderId, currentState);
    
    res.json({
      checkIn,
      currentState,
      insights,
      recommendations
    });
    
  } catch (error) {
    console.error('Error submitting emotional check-in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Builder Retreats
router.get('/retreats/upcoming', authMiddleware, async (req, res) => {
  try {
    const db = await connectDB();
    
    const retreats = await db('builder_retreats')
      .where('start_date', '>', new Date())
      .orderBy('start_date', 'asc')
      .select('*');
    
    res.json({ retreats });
    
  } catch (error) {
    console.error('Error fetching upcoming retreats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/retreats/:retreatId/register', authMiddleware, async (req, res) => {
  try {
    const { retreatId } = req.params;
    const founderId = req.user.id;
    const db = await connectDB();
    
    // Check if already registered
    const existingRegistration = await db('retreat_registrations')
      .where({ retreat_id: retreatId, founder_id: founderId })
      .first();
    
    if (existingRegistration) {
      return res.status(400).json({ error: 'Already registered for this retreat' });
    }
    
    // Register for retreat
    await db('retreat_registrations').insert({
      retreat_id: retreatId,
      founder_id: founderId,
      registration_date: new Date(),
      status: 'confirmed'
    });
    
    res.json({ message: 'Successfully registered for retreat' });
    
  } catch (error) {
    console.error('Error registering for retreat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Inner Circle & Referrals
router.get('/inner-circle/connections', authMiddleware, async (req, res) => {
  try {
    const founderId = req.user.id;
    const db = await connectDB();
    
    const connections = await db('inner_circle_connections')
      .where('founder_id', founderId)
      .select('*');
    
    res.json({ connections });
    
  } catch (error) {
    console.error('Error fetching inner circle connections:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/inner-circle/referrals', authMiddleware, [
  body('referredFounderId').notEmpty().withMessage('Referred founder ID is required'),
  body('message').notEmpty().withMessage('Referral message is required'),
  body('confidence').isIn(['high', 'medium', 'low']).withMessage('Valid confidence level is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const referrerId = req.user.id;
    const { referredFounderId, message, confidence } = req.body;
    const db = await connectDB();
    
    // Create referral
    await db('referrals').insert({
      referrer_id: referrerId,
      referred_founder_id: referredFounderId,
      message,
      confidence,
      status: 'pending',
      created_at: new Date()
    });
    
    res.json({ message: 'Referral submitted successfully' });
    
  } catch (error) {
    console.error('Error submitting referral:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions (AI algorithms)
async function calculateVisionMatchScore(founder) {
  // This would integrate with actual AI service
  // For now, return a calculated score based on profile completeness
  const factors = {
    profileCompleteness: 0.3,
    skillDiversity: 0.2,
    goalClarity: 0.25,
    networkStrength: 0.25
  };
  
  let score = 0;
  
  // Profile completeness
  if (founder.company && founder.title && founder.location) score += factors.profileCompleteness * 100;
  
  // Skill diversity (mock calculation)
  score += factors.skillDiversity * 85;
  
  // Goal clarity (mock calculation)
  score += factors.goalClarity * 90;
  
  // Network strength (mock calculation)
  score += factors.networkStrength * 80;
  
  return Math.round(score);
}

function determineBuilderArchetype(founder, skills) {
  // Simple archetype determination based on skills and company stage
  const skillNames = skills.map(s => s.skill.toLowerCase());
  
  if (skillNames.some(s => s.includes('technical') || s.includes('engineering'))) {
    return 'Hacker-Strategist';
  } else if (skillNames.some(s => s.includes('sales') || s.includes('marketing'))) {
    return 'Hustler-Strategist';
  } else if (skillNames.some(s => s.includes('design') || s.includes('ux'))) {
    return 'Designer-Strategist';
  } else {
    return 'Strategist';
  }
}

function assessRiskProfile(founder) {
  // Simple risk assessment based on company stage and funding
  if (founder.stage === 'Seed' || founder.stage === 'Pre-seed') {
    return 'High';
  } else if (founder.stage === 'Series A') {
    return 'Medium-High';
  } else if (founder.stage === 'Series B' || founder.stage === 'Series C') {
    return 'Medium';
  } else {
    return 'Low';
  }
}

async function calculateCompatibilityScore(founder1, founder2) {
  // This would use actual AI/ML model
  // For now, calculate based on various factors
  
  let score = 0;
  
  // Industry compatibility
  if (founder1.industry === founder2.industry) score += 20;
  else if (founder1.industry && founder2.industry) score += 10;
  
  // Stage compatibility
  const stage1 = getStageNumber(founder1.stage);
  const stage2 = getStageNumber(founder2.stage);
  const stageDiff = Math.abs(stage1 - stage2);
  if (stageDiff === 0) score += 25;
  else if (stageDiff === 1) score += 20;
  else if (stageDiff === 2) score += 15;
  else score += 10;
  
  // Location compatibility (same timezone bonus)
  if (founder1.location && founder2.location) {
    const timezone1 = getTimezone(founder1.location);
    const timezone2 = getTimezone(founder2.location);
    if (timezone1 === timezone2) score += 15;
    else if (Math.abs(timezone1 - timezone2) <= 3) score += 10;
    else score += 5;
  }
  
  // Add some randomness for demo purposes
  score += Math.floor(Math.random() * 20);
  
  return Math.min(100, Math.max(0, score));
}

function getStageNumber(stage) {
  const stages = {
    'Pre-seed': 1,
    'Seed': 2,
    'Series A': 3,
    'Series B': 4,
    'Series C': 5,
    'Series D+': 6
  };
  return stages[stage] || 1;
}

function getTimezone(location) {
  // Mock timezone calculation
  if (location.includes('San Francisco') || location.includes('CA')) return -8;
  if (location.includes('New York') || location.includes('NY')) return -5;
  if (location.includes('London')) return 0;
  if (location.includes('Berlin')) return 1;
  return 0;
}

async function getDailyMatches(founder, preferences) {
  // This would use AI to find optimal matches
  // For now, return mock data
  return [
    {
      id: 'match_001',
      name: 'Sarah Kim',
      title: 'CTO & Co-founder',
      company: 'DataVault Analytics',
      location: 'Austin, TX',
      stage: 'Series A',
      compatibilityScore: 92,
      visionAlignment: 89,
      riskSync: 94,
      emotionalAvailability: 87,
      builderArchetype: 'Hacker-Designer',
      mutualConnections: 3,
      sharedInterests: ['AI/ML', 'Data Science', 'Product Strategy'],
      lastActive: '1 hour ago'
    }
  ];
}

async function analyzeEmotionalState(founderId) {
  // This would analyze emotional patterns over time
  return {
    overallMood: 'optimistic',
    energyTrend: 'stable',
    stressLevel: 'moderate',
    focusQuality: 'high',
    recommendations: ['Consider taking a short break', 'Your energy is well-balanced']
  };
}

async function generateEmotionalInsights(founderId) {
  return {
    weeklyPattern: 'Your energy peaks on Tuesdays and Thursdays',
    stressTriggers: ['Funding discussions', 'Team conflicts'],
    copingStrategies: ['Exercise', 'Meditation', 'Team building activities']
  };
}

async function generateEmotionalRecommendations(founderId, currentState) {
  return [
    'Schedule important meetings during your peak energy hours',
    'Take 5-minute breaks every 90 minutes',
    'Practice stress-reduction techniques before high-pressure situations'
  ];
}

async function getCompatibilityInsights(founderId) {
  return {
    communicationStyle: 'Direct and efficient',
    conflictResolution: 'Solution-oriented',
    growthMindset: 'High',
    workLifeBalance: 'Work-focused with room for improvement'
  };
}

async function generateCompatibilityInsights(founder1, founder2, score) {
  return {
    visionAlignment: Math.floor(score * 0.9),
    riskSync: Math.floor(score * 0.85),
    emotionalAvailability: Math.floor(score * 0.95),
    lifestyleCompatibility: Math.floor(score * 0.8),
    communicationStyle: Math.floor(score * 0.88)
  };
}

async function detectRedFlags(founder1, founder2) {
  // This would use AI to detect potential compatibility issues
  return [];
}

async function generateRecommendations(founder1, founder2, score) {
  return [
    'Schedule a video call to discuss shared goals',
    'Share your pitch decks to align on vision',
    'Discuss work-life balance expectations early'
  ];
}

module.exports = router;
