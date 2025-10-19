// Frontend type definitions for backend use

export interface DiscoveryProfile {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  industry: string;
  location: string;
  bio: string;
  profileImage?: string;
  isVerified: boolean;
  compatibilityScore?: number;
  mutualConnections?: string[];
  sharedInterests?: string[];
}

export interface PsychologicalProfile {
  id: string;
  userId: string;
  bigFive: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  attachmentStyle: 'secure' | 'anxious' | 'avoidant' | 'disorganized';
  loveLanguage: ('words' | 'acts' | 'gifts' | 'time' | 'touch')[];
  communicationStyle: 'direct' | 'diplomatic' | 'analytical' | 'expressive';
  emotionalIntelligence: number;
  conflictResolution: 'collaborative' | 'competitive' | 'accommodating' | 'avoidant' | 'compromising';
  values: string[];
  goals: string[];
  relationshipGoals: string[];
  datingStyle: string;
  intimacyLevel: string;
  socialEnergy: string;
  personalityInsights: PersonalityInsight[];
  compatibilityFactors: CompatibilityFactor[];
  growthAreas: GrowthArea[];
  strengths: string[];
  behavioralPatterns: BehavioralPattern[];
  overallScore: number;
  confidence: number;
  authenticity: number;
  emotionalMaturity: number;
  interests: string[];
  lifestyle: {
    dailyRoutine: string;
    socialPreferences: string;
    travelStyle: string;
    workLifeBalance: string;
    financialValues: string;
    familyValues: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CosmicProfile {
  id: string;
  userId: string;
  zodiacSign: string;
  lifePathNumber: number;
  chakraAlignment: {
    root: number;
    sacral: number;
    solarPlexus: number;
    heart: number;
    throat: number;
    thirdEye: number;
    crown: number;
  };
  elementalBalance: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
  energyLevel: number;
  vibration: number;
  aura: string;
  spiritualAlignment: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Match {
  id: string;
  userId: string;
  matchId: string;
  aiCompatibility: {
    overall: number;
    personality: number;
    values: number;
    communication: number;
    lifestyle: number;
    goals: number;
    emotional: number;
    intellectual: number;
    physical: number;
    spiritual: number;
  };
  psychologicalMatch: {
    attachmentCompatibility: number;
    loveLanguageAlignment: number;
    communicationCompatibility: number;
    conflictResolutionMatch: number;
    emotionalIntelligenceMatch: number;
  };
  lifestyleMatch: {
    dailyRoutine: number;
    socialPreferences: number;
    travelStyle: number;
    workLifeBalance: number;
    financialValues: number;
    familyValues: number;
  };
  cosmicAlignment: {
    zodiacCompatibility: number;
    lifePathNumbers: number;
    chakraAlignment: number;
    elementalBalance: number;
    cosmicScore: number;
  };
  energyVibe: {
    energyLevel: number;
    vibrationMatch: number;
    auraCompatibility: number;
    spiritualAlignment: number;
    overallVibe: number;
  };
  growthPotential: {
    mutualGrowth: number;
    challengeLevel: number;
    supportPotential: number;
    learningOpportunity: number;
    evolutionScore: number;
  };
  overallScore: number;
  uniquenessScore: number;
  longTermPotential: number;
  matchInsights: MatchInsight[];
  conversationStarters: ConversationStarter[];
  dateIdeas: DateIdea[];
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchInsight {
  id: string;
  category: string;
  insight: string;
  confidence: number;
  aiGenerated: boolean;
}

export interface ConversationStarter {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  aiGenerated: boolean;
}

export interface DateIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  cost: 'low' | 'medium' | 'high';
  duration: string;
  location: string;
  aiGenerated: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  isVerified: boolean;
  safetyScore: number;
  premiumTier: 'free' | 'silver' | 'gold' | 'platinum' | 'diamond';
  globalLocation: {
    country: string;
    city: string;
    timezone: string;
    coordinates: { lat: number; lng: number };
    region: string;
    language: string;
  };
  psychologicalProfile?: PsychologicalProfile;
  cosmicProfile?: CosmicProfile;
  createdAt: Date;
  updatedAt: Date;
}

// Additional types needed for AI service
export interface BigFiveTraits {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface PersonalityInsight {
  id: string;
  category: string;
  insight: string;
  confidence: number;
  evidence: string[];
  aiGenerated: boolean;
}

export interface CompatibilityFactor {
  id: string;
  factor: string;
  importance: number;
  description: string;
  aiReasoning: string;
}

export interface GrowthArea {
  id: string;
  area: string;
  currentLevel: number;
  potentialLevel: number;
  suggestions: string[];
}

export interface BehavioralPattern {
  id: string;
  pattern: string;
  frequency: number;
  context: string;
  aiAnalysis: string;
}

export interface EmotionalIntelligence {
  selfAwareness: number;
  selfRegulation: number;
  motivation: number;
  empathy: number;
  socialSkills: number;
}

export interface AICompatibility {
  overall: number;
  personality: number;
  values: number;
  communication: number;
  lifestyle: number;
  goals: number;
  emotional: number;
  intellectual: number;
  physical: number;
  spiritual: number;
}

export interface PsychologicalMatch {
  attachmentCompatibility: number;
  loveLanguageAlignment: number;
  communicationCompatibility: number;
  conflictResolutionMatch: number;
  emotionalIntelligenceMatch: number;
}

export interface LifestyleMatch {
  dailyRoutine: number;
  socialPreferences: number;
  travelStyle: number;
  workLifeBalance: number;
  financialValues: number;
  familyValues: number;
}

export interface CosmicAlignment {
  zodiacCompatibility: number;
  lifePathNumbers: number;
  chakraAlignment: number;
  elementalBalance: number;
  cosmicScore: number;
}

export interface EnergyVibe {
  energyLevel: number;
  vibrationMatch: number;
  auraCompatibility: number;
  spiritualAlignment: number;
  overallVibe: number;
}

export interface GrowthPotential {
  mutualGrowth: number;
  challengeLevel: number;
  supportPotential: number;
  learningOpportunity: number;
  evolutionScore: number;
}
