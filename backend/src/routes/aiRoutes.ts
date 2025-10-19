import express, { Request, Response } from 'express';
import { AIService } from '../services/aiService';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const aiService = AIService.getInstance();

// Generate psychological profile for user
router.post('/profile/:userId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userData = req.body;

    const psychologicalProfile = await aiService.generatePsychologicalProfile({
      id: userId,
      ...userData
    });

    res.json({
      success: true,
      data: psychologicalProfile
    });
  } catch (error) {
    console.error('Error generating psychological profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate psychological profile'
    });
  }
});

// Calculate compatibility between two users
router.post('/compatibility', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { profile1, profile2 } = req.body;

    if (!profile1 || !profile2) {
      return res.status(400).json({
        success: false,
        error: 'Both profiles are required'
      });
    }

    const compatibility = await aiService.calculateCompatibility(profile1, profile2);

    return res.json({
      success: true,
      data: compatibility
    });
  } catch (error) {
    console.error('Error calculating compatibility:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to calculate compatibility'
    });
  }
});

// Generate cosmic alignment analysis
router.post('/cosmic-alignment', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { profile1, profile2 } = req.body;

    if (!profile1 || !profile2) {
      return res.status(400).json({
        success: false,
        error: 'Both profiles are required'
      });
    }

    const cosmicAlignment = await aiService.generateCosmicAlignment(profile1, profile2);

    return res.json({
      success: true,
      data: cosmicAlignment
    });
  } catch (error) {
    console.error('Error generating cosmic alignment:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate cosmic alignment'
    });
  }
});

// Generate energy vibe analysis
router.post('/energy-vibe', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { profile1, profile2 } = req.body;

    if (!profile1 || !profile2) {
      return res.status(400).json({
        success: false,
        error: 'Both profiles are required'
      });
    }

    const energyVibe = await aiService.generateEnergyVibe(profile1, profile2);

    return res.json({
      success: true,
      data: energyVibe
    });
  } catch (error) {
    console.error('Error generating energy vibe:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate energy vibe'
    });
  }
});

// Generate growth potential analysis
router.post('/growth-potential', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { profile1, profile2 } = req.body;

    if (!profile1 || !profile2) {
      return res.status(400).json({
        success: false,
        error: 'Both profiles are required'
      });
    }

    const growthPotential = await aiService.generateGrowthPotential(profile1, profile2);

    return res.json({
      success: true,
      data: growthPotential
    });
  } catch (error) {
    console.error('Error generating growth potential:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate growth potential'
    });
  }
});

// Generate match insights
router.post('/match-insights', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { profile1, profile2 } = req.body;

    if (!profile1 || !profile2) {
      return res.status(400).json({
        success: false,
        error: 'Both profiles are required'
      });
    }

    const insights = await aiService.generateMatchInsights(profile1, profile2);

    return res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Error generating match insights:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate match insights'
    });
  }
});

// Generate conversation starters
router.post('/conversation-starters', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { profile1, profile2 } = req.body;

    if (!profile1 || !profile2) {
      return res.status(400).json({
        success: false,
        error: 'Both profiles are required'
      });
    }

    const starters = await aiService.generateConversationStarters(profile1, profile2);

    return res.json({
      success: true,
      data: starters
    });
  } catch (error) {
    console.error('Error generating conversation starters:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate conversation starters'
    });
  }
});

// Generate date ideas
router.post('/date-ideas', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { profile1, profile2 } = req.body;

    if (!profile1 || !profile2) {
      return res.status(400).json({
        success: false,
        error: 'Both profiles are required'
      });
    }

    const ideas = await aiService.generateDateIdeas(profile1, profile2);

    return res.json({
      success: true,
      data: ideas
    });
  } catch (error) {
    console.error('Error generating date ideas:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate date ideas'
    });
  }
});

// Generate unique matches for user
router.post('/unique-matches/:userId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { userProfile, potentialMatches } = req.body;

    if (!userProfile || !potentialMatches) {
      return res.status(400).json({
        success: false,
        error: 'User profile and potential matches are required'
      });
    }

    // Generate matches for each potential match
    const matches = [];
    for (const potentialMatch of potentialMatches) {
      try {
        const compatibility = await aiService.calculateCompatibility(userProfile, potentialMatch.psychologicalProfile);
        const cosmicAlignment = await aiService.generateCosmicAlignment(userProfile, potentialMatch.psychologicalProfile);
        const energyVibe = await aiService.generateEnergyVibe(userProfile, potentialMatch.psychologicalProfile);
        const growthPotential = await aiService.generateGrowthPotential(userProfile, potentialMatch.psychologicalProfile);
        const insights = await aiService.generateMatchInsights(userProfile, potentialMatch.psychologicalProfile);
        const conversationStarters = await aiService.generateConversationStarters(userProfile, potentialMatch.psychologicalProfile);
        const dateIdeas = await aiService.generateDateIdeas(userProfile, potentialMatch.psychologicalProfile);

        const overallScore = (compatibility.overall + cosmicAlignment.cosmicScore + energyVibe.overallVibe + growthPotential.evolutionScore) / 4;
        const uniquenessScore = (cosmicAlignment.cosmicScore + energyVibe.overallVibe + growthPotential.evolutionScore) / 3;
        const longTermPotential = (compatibility.overall + growthPotential.evolutionScore) / 2;

        matches.push({
          id: `match_${userId}_${potentialMatch.id}_${Date.now()}`,
          userId,
          matchId: potentialMatch.id,
          aiCompatibility: compatibility,
          psychologicalMatch: {
            attachmentCompatibility: 85,
            loveLanguageAlignment: 80,
            communicationCompatibility: 90,
            conflictResolutionMatch: 75,
            emotionalIntelligenceMatch: 88
          },
          lifestyleMatch: {
            dailyRoutine: 80,
            socialPreferences: 85,
            travelStyle: 90,
            workLifeBalance: 75,
            financialValues: 88,
            familyValues: 82
          },
          cosmicAlignment,
          energyVibe,
          growthPotential,
          overallScore: Math.round(overallScore),
          uniquenessScore: Math.round(uniquenessScore),
          longTermPotential: Math.round(longTermPotential),
          matchInsights: insights,
          conversationStarters,
          dateIdeas,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } catch (error) {
        console.error(`Error processing match for user ${potentialMatch.id}:`, error);
        // Continue with other matches
      }
    }

    // Sort matches by overall score
    matches.sort((a, b) => b.overallScore - a.overallScore);

    return res.json({
      success: true,
      data: matches
    });
  } catch (error) {
    console.error('Error generating unique matches:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate unique matches'
    });
  }
});

// Find specific match types
router.post('/find-matches/:type', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const { userProfile, potentialMatches } = req.body;

    if (!userProfile || !potentialMatches) {
      return res.status(400).json({
        success: false,
        error: 'User profile and potential matches are required'
      });
    }

    // Generate all matches first
    const allMatches = [];
    for (const potentialMatch of potentialMatches) {
      try {
        const compatibility = await aiService.calculateCompatibility(userProfile, potentialMatch.psychologicalProfile);
        const cosmicAlignment = await aiService.generateCosmicAlignment(userProfile, potentialMatch.psychologicalProfile);
        const energyVibe = await aiService.generateEnergyVibe(userProfile, potentialMatch.psychologicalProfile);
        const growthPotential = await aiService.generateGrowthPotential(userProfile, potentialMatch.psychologicalProfile);

        const overallScore = (compatibility.overall + cosmicAlignment.cosmicScore + energyVibe.overallVibe + growthPotential.evolutionScore) / 4;

        allMatches.push({
          id: `match_${userProfile.userId}_${potentialMatch.id}_${Date.now()}`,
          userId: userProfile.userId,
          matchId: potentialMatch.id,
          aiCompatibility: compatibility,
          cosmicAlignment,
          energyVibe,
          growthPotential,
          overallScore: Math.round(overallScore),
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } catch (error) {
        console.error(`Error processing match for user ${potentialMatch.id}:`, error);
      }
    }

    // Filter based on match type
    let filteredMatches = [];
    switch (type) {
      case 'soulmate':
        filteredMatches = allMatches.filter(match => match.cosmicAlignment.cosmicScore >= 90);
        break;
      case 'growth':
        filteredMatches = allMatches.filter(match => match.growthPotential.evolutionScore >= 80);
        break;
      case 'energy':
        filteredMatches = allMatches.filter(match => match.energyVibe.overallVibe >= 85);
        break;
      case 'karmic':
        filteredMatches = allMatches.filter(match => 
          match.cosmicAlignment.cosmicScore >= 75 && match.growthPotential.mutualGrowth >= 70
        );
        break;
      case 'twin-flame':
        filteredMatches = allMatches.filter(match => 
          match.overallScore >= 90 && match.cosmicAlignment.cosmicScore >= 85
        );
        break;
      case 'adventure':
        filteredMatches = allMatches.filter(match => 
          match.aiCompatibility.personality >= 70 && match.energyVibe.overallVibe >= 75
        );
        break;
      case 'intellectual':
        filteredMatches = allMatches.filter(match => match.aiCompatibility.intellectual >= 85);
        break;
      case 'spiritual':
        filteredMatches = allMatches.filter(match => match.aiCompatibility.spiritual >= 80);
        break;
      default:
        filteredMatches = allMatches;
    }

    return res.json({
      success: true,
      data: filteredMatches
    });
  } catch (error) {
    console.error(`Error finding ${req.params.type} matches:`, error);
    return res.status(500).json({
      success: false,
      error: `Failed to find ${req.params.type} matches`
    });
  }
});

export default router;
