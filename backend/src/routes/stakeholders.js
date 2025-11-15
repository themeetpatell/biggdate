const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');
const { db } = require('../config/database');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, status, search, favorite } = req.query;
    
    let query = db('stakeholders').where('user_id', userId);
    
    if (type) {
      query = query.where('type', type);
    }
    
    if (status) {
      query = query.where('status', status);
    }
    
    if (favorite === 'true') {
      query = query.where('is_favorite', true);
    }
    
    if (search) {
      query = query.where(function() {
        this.where('name', 'ilike', `%${search}%`)
          .orWhere('email', 'ilike', `%${search}%`)
          .orWhere('company', 'ilike', `%${search}%`)
          .orWhere('title', 'ilike', `%${search}%`);
      });
    }
    
    const stakeholders = await query
      .orderBy('created_at', 'desc')
      .select('*');
    
    const parsedStakeholders = stakeholders.map(s => ({
      ...s,
      tags: typeof s.tags === 'string' ? JSON.parse(s.tags) : s.tags,
      custom_fields: typeof s.custom_fields === 'string' ? JSON.parse(s.custom_fields) : s.custom_fields
    }));
    
    res.json({ stakeholders: parsedStakeholders });
  } catch (error) {
    console.error('Error fetching stakeholders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const stakeholder = await db('stakeholders')
      .where({ id, user_id: userId })
      .first();
    
    if (!stakeholder) {
      return res.status(404).json({ error: 'Stakeholder not found' });
    }
    
    const parsedStakeholder = {
      ...stakeholder,
      tags: typeof stakeholder.tags === 'string' ? JSON.parse(stakeholder.tags) : stakeholder.tags,
      custom_fields: typeof stakeholder.custom_fields === 'string' ? JSON.parse(stakeholder.custom_fields) : stakeholder.custom_fields
    };
    
    res.json({ stakeholder: parsedStakeholder });
  } catch (error) {
    console.error('Error fetching stakeholder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authMiddleware, [
  body('name').notEmpty().withMessage('Name is required'),
  body('type').isIn([
    'advisor',
    'investor',
    'mentor',
    'early-adopter',
    'beta-tester',
    'supporter',
    'team-prospect'
  ]).withMessage('Invalid stakeholder type'),
  body('email').optional().isEmail().withMessage('Invalid email format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const userId = req.user.id;
    
    const {
      name,
      email,
      phone,
      company,
      title,
      linkedin_url,
      twitter_handle,
      type,
      notes,
      tags,
      custom_fields,
      last_contact_date,
      next_followup_date,
      relationship_strength,
      is_favorite
    } = req.body;
    
    const [stakeholder] = await db('stakeholders')
      .insert({
        user_id: userId,
        name,
        email,
        phone,
        company,
        title,
        linkedin_url,
        twitter_handle,
        type,
        notes,
        tags: tags ? JSON.stringify(tags) : '[]',
        custom_fields: custom_fields ? JSON.stringify(custom_fields) : '{}',
        last_contact_date,
        next_followup_date,
        relationship_strength: relationship_strength || 5,
        is_favorite: is_favorite || false,
        status: 'active'
      })
      .returning('*');
    
    const parsedStakeholder = {
      ...stakeholder,
      tags: typeof stakeholder.tags === 'string' ? JSON.parse(stakeholder.tags) : stakeholder.tags,
      custom_fields: typeof stakeholder.custom_fields === 'string' ? JSON.parse(stakeholder.custom_fields) : stakeholder.custom_fields
    };
    
    res.status(201).json({ stakeholder: parsedStakeholder });
  } catch (error) {
    console.error('Error creating stakeholder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authMiddleware, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('type').optional().isIn([
    'advisor',
    'investor',
    'mentor',
    'early-adopter',
    'beta-tester',
    'supporter',
    'team-prospect'
  ]).withMessage('Invalid stakeholder type'),
  body('email').optional().isEmail().withMessage('Invalid email format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const userId = req.user.id;
    
    const stakeholder = await db('stakeholders')
      .where({ id, user_id: userId })
      .first();
    
    if (!stakeholder) {
      return res.status(404).json({ error: 'Stakeholder not found' });
    }
    
    const updateData = {};
    const allowedFields = [
      'name', 'email', 'phone', 'company', 'title', 'linkedin_url',
      'twitter_handle', 'type', 'status', 'notes', 'tags', 'custom_fields',
      'last_contact_date', 'next_followup_date', 'relationship_strength', 'is_favorite'
    ];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'tags' || field === 'custom_fields') {
          updateData[field] = JSON.stringify(req.body[field]);
        } else {
          updateData[field] = req.body[field];
        }
      }
    });
    
    updateData.updated_at = db.fn.now();
    
    const [updated] = await db('stakeholders')
      .where({ id, user_id: userId })
      .update(updateData)
      .returning('*');
    
    const parsedStakeholder = {
      ...updated,
      tags: typeof updated.tags === 'string' ? JSON.parse(updated.tags) : updated.tags,
      custom_fields: typeof updated.custom_fields === 'string' ? JSON.parse(updated.custom_fields) : updated.custom_fields
    };
    
    res.json({ stakeholder: parsedStakeholder });
  } catch (error) {
    console.error('Error updating stakeholder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const deleted = await db('stakeholders')
      .where({ id, user_id: userId })
      .delete();
    
    if (!deleted) {
      return res.status(404).json({ error: 'Stakeholder not found' });
    }
    
    res.json({ message: 'Stakeholder deleted successfully' });
  } catch (error) {
    console.error('Error deleting stakeholder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stats/summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await db('stakeholders')
      .where('user_id', userId)
      .select('type')
      .count('* as count')
      .groupBy('type');
    
    const total = await db('stakeholders')
      .where('user_id', userId)
      .count('* as total')
      .first();
    
    const favorites = await db('stakeholders')
      .where({ user_id: userId, is_favorite: true })
      .count('* as count')
      .first();
    
    const upcomingFollowups = await db('stakeholders')
      .where('user_id', userId)
      .whereNotNull('next_followup_date')
      .where('next_followup_date', '<=', db.raw("CURRENT_DATE + INTERVAL '7 days'"))
      .count('* as count')
      .first();
    
    const typeMap = {};
    stats.forEach(stat => {
      typeMap[stat.type] = parseInt(stat.count);
    });
    
    res.json({
      total: parseInt(total.total),
      favorites: parseInt(favorites.count),
      upcomingFollowups: parseInt(upcomingFollowups.count),
      byType: typeMap
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

