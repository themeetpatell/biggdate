import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// Mock discovery profiles data
const discoveryProfiles = [
  {
    founder: {
      id: '1',
      userId: '1',
      title: 'CEO & Co-Founder',
      company: 'TechFlow Solutions',
      companyStage: 'series-a',
      industry: 'saas',
      location: 'San Francisco, CA',
      bio: 'Serial entrepreneur with 10+ years building B2B SaaS platforms. Previously founded two companies that achieved successful exits.',
      vision: 'Democratizing AI-powered workflow automation for businesses of all sizes.',
      values: ['Innovation', 'Transparency', 'Customer Success', 'Work-Life Balance'],
      skills: [
        { id: '1', name: 'Product Strategy', category: 'business', level: 'expert' },
        { id: '2', name: 'Team Building', category: 'leadership', level: 'expert' },
        { id: '3', name: 'Fundraising', category: 'business', level: 'advanced' }
      ],
      achievements: [
        { id: '1', title: 'Raised $15M Series A', description: 'Led successful Series A round', year: 2023, category: 'funding' },
        { id: '2', title: 'Built 50+ person team', description: 'Scaled team from 5 to 50+ employees', year: 2022, category: 'team' }
      ],
      funding: { totalRaised: 15000000, lastRound: 'Series A', investors: ['Sequoia', 'Andreessen Horowitz'] },
      teamSize: 45,
      lookingFor: {
        roles: ['CTO', 'VP Engineering', 'Head of Product'],
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
    },
    compatibilityScore: 92,
    mutualConnections: 3,
    sharedInterests: ['AI/ML', 'SaaS', 'Product Management'],
    introductionSuggestions: [
      'Both worked on AI-powered products',
      'Mutual connection at Sequoia',
      'Similar company stage and goals'
    ]
  },
  {
    founder: {
      id: '2',
      userId: '2',
      title: 'CTO & Co-Founder',
      company: 'HealthAI',
      companyStage: 'series-b',
      industry: 'healthtech',
      location: 'Boston, MA',
      bio: 'AI researcher turned entrepreneur. PhD in Machine Learning from MIT. Building the future of healthcare diagnostics.',
      vision: 'Making healthcare more accessible and accurate through AI-powered diagnostic tools.',
      values: ['Impact', 'Innovation', 'Ethics', 'Collaboration'],
      skills: [
        { id: '1', name: 'Machine Learning', category: 'technical', level: 'expert' },
        { id: '2', name: 'Python', category: 'technical', level: 'expert' },
        { id: '3', name: 'Healthcare', category: 'business', level: 'advanced' }
      ],
      achievements: [
        { id: '1', title: 'FDA Approval', description: 'Led team to FDA approval for AI diagnostic tool', year: 2023, category: 'product' },
        { id: '2', title: 'Published 20+ Papers', description: 'Research published in top-tier journals', year: 2022, category: 'awards' }
      ],
      funding: { totalRaised: 25000000, lastRound: 'Series B', investors: ['GV', 'Khosla Ventures'] },
      teamSize: 75,
      lookingFor: {
        roles: ['CEO', 'COO', 'Head of Business Development'],
        industries: ['healthtech', 'ai-ml'],
        stages: ['series-b', 'growth'],
        locations: ['Boston', 'San Francisco'],
        archetypes: ['hustler', 'operator']
      },
      availability: 'open-to-opportunities',
      website: 'https://healthai.com',
      linkedInUrl: 'https://linkedin.com/in/cto',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    compatibilityScore: 88,
    mutualConnections: 2,
    sharedInterests: ['AI/ML', 'Healthcare', 'Research'],
    introductionSuggestions: [
      'Both in AI/ML space with different applications',
      'Mutual connection at MIT',
      'Complementary skills and experience'
    ]
  }
];

// Get discovery profiles
router.post('/profiles', (req: Request, res: Response) => {
  try {
    const { query, filters, page = 1, limit = 10, sortBy = 'compatibility', sortOrder = 'desc' } = req.body;

    // Filter profiles based on query and filters
    let filteredProfiles = [...discoveryProfiles];

    if (query) {
      filteredProfiles = filteredProfiles.filter(profile =>
        profile.founder.company.toLowerCase().includes(query.toLowerCase()) ||
        profile.founder.bio.toLowerCase().includes(query.toLowerCase()) ||
        profile.founder.skills.some(skill => 
          skill.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }

    if (filters) {
      if (filters.industries?.length) {
        filteredProfiles = filteredProfiles.filter(profile =>
          filters.industries.includes(profile.founder.industry)
        );
      }

      if (filters.stages?.length) {
        filteredProfiles = filteredProfiles.filter(profile =>
          filters.stages.includes(profile.founder.companyStage)
        );
      }

      if (filters.locations?.length) {
        filteredProfiles = filteredProfiles.filter(profile =>
          filters.locations.some((loc: string) => 
            profile.founder.location.toLowerCase().includes(loc.toLowerCase())
          )
        );
      }

      if (filters.minCompatibilityScore) {
        filteredProfiles = filteredProfiles.filter(profile =>
          profile.compatibilityScore >= filters.minCompatibilityScore
        );
      }
    }

    // Sort profiles
    filteredProfiles.sort((a, b) => {
      if (sortBy === 'compatibility') {
        return sortOrder === 'desc' 
          ? b.compatibilityScore - a.compatibilityScore
          : a.compatibilityScore - b.compatibilityScore;
      }
      return 0;
    });

    // Paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProfiles = filteredProfiles.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedProfiles,
      pagination: {
        page,
        limit,
        total: filteredProfiles.length,
        totalPages: Math.ceil(filteredProfiles.length / limit)
      }
    });
  } catch (error) {
    console.error('Discovery profiles error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Connect with founder
router.post('/connect/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // In real app, create connection record in database
    console.log(`User connecting with founder ${id}`);

    res.json({
      success: true,
      message: 'Connection request sent successfully'
    });
  } catch (error) {
    console.error('Connect error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Request introduction
router.post('/introduction', (req: Request, res: Response) => {
  try {
    const { founderId, message } = req.body;

    // In real app, create introduction request in database
    console.log(`Introduction request to founder ${founderId}: ${message}`);

    res.json({
      success: true,
      message: 'Introduction request sent successfully'
    });
  } catch (error) {
    console.error('Introduction request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
