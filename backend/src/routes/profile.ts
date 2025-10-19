import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// Get profile
router.get('/', (req: Request, res: Response) => {
  try {
    // Mock profile data
    const profile = {
      id: '1',
      userId: '1',
      title: 'CEO & Co-Founder',
      company: 'TechFlow Solutions',
      companyStage: 'series-a',
      industry: 'saas',
      location: 'San Francisco, CA',
      bio: 'Serial entrepreneur with 10+ years building B2B SaaS platforms.',
      vision: 'Democratizing AI-powered workflow automation for businesses of all sizes.',
      values: ['Innovation', 'Transparency', 'Customer Success'],
      skills: [
        { id: '1', name: 'Product Strategy', category: 'business', level: 'expert' },
        { id: '2', name: 'Team Building', category: 'leadership', level: 'expert' }
      ],
      achievements: [
        { id: '1', title: 'Raised $15M Series A', description: 'Led successful Series A round', year: 2023, category: 'funding' }
      ],
      funding: { totalRaised: 15000000, lastRound: 'Series A', investors: ['Sequoia'] },
      teamSize: 45,
      lookingFor: {
        roles: ['CTO', 'VP Engineering'],
        industries: ['saas', 'ai-ml'],
        stages: ['series-a', 'series-b'],
        locations: ['San Francisco', 'Remote'],
        archetypes: ['hacker', 'designer']
      },
      availability: 'actively-looking',
      website: 'https://techflow.com',
      linkedInUrl: 'https://linkedin.com/in/ceo',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create profile
router.post('/', (req: Request, res: Response) => {
  try {
    const profileData = req.body;
    
    // In real app, save to database
    console.log('Creating profile:', profileData);

    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: { id: '1', ...profileData }
    });
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update profile
router.put('/', (req: Request, res: Response) => {
  try {
    const profileData = req.body;
    
    // In real app, update in database
    console.log('Updating profile:', profileData);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { id: '1', ...profileData }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Upload profile image
router.post('/image', (req: Request, res: Response) => {
  try {
    // In real app, handle file upload to cloud storage
    const imageUrl = 'https://example.com/profile-image.jpg';

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: { imageUrl }
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
