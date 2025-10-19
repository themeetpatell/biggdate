import { 
  PsychologicalProfile, 
  BigFiveTraits, 
  PersonalityInsight, 
  CompatibilityFactor,
  GrowthArea,
  BehavioralPattern,
  EmotionalIntelligence,
  AICompatibility,
  PsychologicalMatch,
  LifestyleMatch,
  CosmicAlignment,
  EnergyVibe,
  GrowthPotential,
  MatchInsight,
  ConversationStarter,
  DateIdea,
  User
} from '../types';

export class AIService {
  private static instance: AIService;
  private openaiApiKey: string;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Generate psychological profile using AI
  async generatePsychologicalProfile(userData: any): Promise<PsychologicalProfile> {
    try {
      // In a real implementation, this would call OpenAI's API
      // For now, we'll simulate the AI analysis
      const bigFive = await this.analyzeBigFiveTraits(userData);
      const emotionalIntelligence = await this.analyzeEmotionalIntelligence(userData);
      const personalityInsights = await this.generatePersonalityInsights(userData, bigFive);
      const compatibilityFactors = await this.generateCompatibilityFactors(userData);
      const growthAreas = await this.identifyGrowthAreas(userData, bigFive);
      const behavioralPatterns = await this.analyzeBehavioralPatterns(userData);

      return {
        id: `psych_${Date.now()}`,
        userId: userData.id,
        bigFive,
        attachmentStyle: await this.determineAttachmentStyle(userData),
        loveLanguage: await this.determineLoveLanguages(userData),
        communicationStyle: await this.determineCommunicationStyle(userData),
        conflictResolution: await this.determineConflictResolution(userData),
        relationshipGoals: await this.determineRelationshipGoals(userData),
        datingStyle: await this.determineDatingStyle(userData),
        intimacyLevel: await this.determineIntimacyLevel(userData),
        socialEnergy: await this.determineSocialEnergy(userData),
        personalityInsights,
        compatibilityFactors,
        growthAreas,
        strengths: await this.identifyStrengths(userData, bigFive),
        behavioralPatterns,
        emotionalIntelligence: emotionalIntelligence.selfAwareness + emotionalIntelligence.selfRegulation + emotionalIntelligence.motivation + emotionalIntelligence.empathy + emotionalIntelligence.socialSkills,
        overallScore: this.calculateOverallScore(bigFive, emotionalIntelligence),
        confidence: this.calculateConfidence(userData),
        authenticity: this.calculateAuthenticity(userData),
        emotionalMaturity: (emotionalIntelligence.selfAwareness + emotionalIntelligence.selfRegulation + emotionalIntelligence.motivation + emotionalIntelligence.empathy + emotionalIntelligence.socialSkills) / 5,
        values: await this.determineValues(userData),
        goals: await this.determineGoals(userData),
        interests: await this.determineInterests(userData),
        lifestyle: await this.analyzeLifestyle(userData),
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error generating psychological profile:', error);
      throw new Error('Failed to generate psychological profile');
    }
  }

  // Calculate AI-powered compatibility between two users
  async calculateCompatibility(profile1: PsychologicalProfile, profile2: PsychologicalProfile): Promise<AICompatibility> {
    try {
      const personality = this.calculatePersonalityCompatibility(profile1.bigFive, profile2.bigFive);
      const values = this.calculateValuesCompatibility(profile1, profile2);
      const communication = this.calculateCommunicationCompatibility(profile1, profile2);
      const lifestyle = this.calculateLifestyleCompatibility(profile1, profile2);
      const goals = this.calculateGoalsCompatibility(profile1, profile2);
      const emotional = this.calculateEmotionalCompatibility(profile1, profile2);
      const intellectual = this.calculateIntellectualCompatibility(profile1, profile2);
      const physical = this.calculatePhysicalCompatibility(profile1, profile2);
      const spiritual = this.calculateSpiritualCompatibility(profile1, profile2);

      const overall = (personality + values + communication + lifestyle + goals + emotional + intellectual + physical + spiritual) / 9;

      return {
        overall: Math.round(overall),
        personality: Math.round(personality),
        values: Math.round(values),
        communication: Math.round(communication),
        lifestyle: Math.round(lifestyle),
        goals: Math.round(goals),
        emotional: Math.round(emotional),
        intellectual: Math.round(intellectual),
        physical: Math.round(physical),
        spiritual: Math.round(spiritual)
      };
    } catch (error) {
      console.error('Error calculating compatibility:', error);
      throw new Error('Failed to calculate compatibility');
    }
  }

  // Generate cosmic alignment analysis
  async generateCosmicAlignment(profile1: PsychologicalProfile, profile2: PsychologicalProfile): Promise<CosmicAlignment> {
    try {
      const zodiacCompatibility = await this.calculateZodiacCompatibility(profile1, profile2);
      const lifePathNumbers = await this.calculateLifePathNumbers(profile1, profile2);
      const chakraAlignment = await this.calculateChakraAlignment(profile1, profile2);
      const elementalBalance = await this.calculateElementalBalance(profile1, profile2);
      
      const cosmicScore = (zodiacCompatibility + lifePathNumbers + chakraAlignment + elementalBalance) / 4;

      return {
        zodiacCompatibility: Math.round(zodiacCompatibility),
        lifePathNumbers: Math.round(lifePathNumbers),
        chakraAlignment: Math.round(chakraAlignment),
        elementalBalance: Math.round(elementalBalance),
        cosmicScore: Math.round(cosmicScore)
      };
    } catch (error) {
      console.error('Error generating cosmic alignment:', error);
      throw new Error('Failed to generate cosmic alignment');
    }
  }

  // Generate energy vibe analysis
  async generateEnergyVibe(profile1: PsychologicalProfile, profile2: PsychologicalProfile): Promise<EnergyVibe> {
    try {
      const energyLevel = this.calculateEnergyLevelMatch(profile1, profile2);
      const vibrationMatch = this.calculateVibrationMatch(profile1, profile2);
      const auraCompatibility = this.calculateAuraCompatibility(profile1, profile2);
      const spiritualAlignment = this.calculateSpiritualAlignment(profile1, profile2);
      
      const overallVibe = (energyLevel + vibrationMatch + auraCompatibility + spiritualAlignment) / 4;

      return {
        energyLevel: Math.round(energyLevel),
        vibrationMatch: Math.round(vibrationMatch),
        auraCompatibility: Math.round(auraCompatibility),
        spiritualAlignment: Math.round(spiritualAlignment),
        overallVibe: Math.round(overallVibe)
      };
    } catch (error) {
      console.error('Error generating energy vibe:', error);
      throw new Error('Failed to generate energy vibe');
    }
  }

  // Generate growth potential analysis
  async generateGrowthPotential(profile1: PsychologicalProfile, profile2: PsychologicalProfile): Promise<GrowthPotential> {
    try {
      const mutualGrowth = this.calculateMutualGrowth(profile1, profile2);
      const challengeLevel = this.calculateChallengeLevel(profile1, profile2);
      const supportPotential = this.calculateSupportPotential(profile1, profile2);
      const learningOpportunity = this.calculateLearningOpportunity(profile1, profile2);
      
      const evolutionScore = (mutualGrowth + challengeLevel + supportPotential + learningOpportunity) / 4;

      return {
        mutualGrowth: Math.round(mutualGrowth),
        challengeLevel: Math.round(challengeLevel),
        supportPotential: Math.round(supportPotential),
        learningOpportunity: Math.round(learningOpportunity),
        evolutionScore: Math.round(evolutionScore)
      };
    } catch (error) {
      console.error('Error generating growth potential:', error);
      throw new Error('Failed to generate growth potential');
    }
  }

  // Generate AI-powered match insights
  async generateMatchInsights(profile1: PsychologicalProfile, profile2: PsychologicalProfile): Promise<MatchInsight[]> {
    try {
      const insights: MatchInsight[] = [];

      // Personality compatibility insights
      const personalityDiff = this.calculatePersonalityDifference(profile1.bigFive, profile2.bigFive);
      if (personalityDiff < 20) {
        insights.push({
          id: `insight_${Date.now()}_1`,
          category: 'Personality',
          insight: 'You have remarkably similar personality traits, which could lead to deep understanding and harmony.',
          confidence: 0.9,
          aiGenerated: true
        });
      } else if (personalityDiff > 60) {
        insights.push({
          id: `insight_${Date.now()}_2`,
          category: 'Personality',
          insight: 'Your personalities complement each other beautifully - you balance each other out perfectly.',
          confidence: 0.85,
          aiGenerated: true
        });
      }

      // Communication style insights
      if (profile1.communicationStyle === profile2.communicationStyle) {
        insights.push({
          id: `insight_${Date.now()}_3`,
          category: 'Communication',
          insight: 'You both share the same communication style, which should make conversations flow naturally.',
          confidence: 0.8,
          aiGenerated: true
        });
      }

      // Love language insights
      const sharedLoveLanguages = profile1.loveLanguage.filter((lang: string) => 
        profile2.loveLanguage.includes(lang as any)
      );
      if (sharedLoveLanguages.length > 0) {
        insights.push({
          id: `insight_${Date.now()}_4`,
          category: 'Love Languages',
          insight: `You both value ${sharedLoveLanguages.join(' and ')} as ways to express love.`,
          confidence: 0.9,
          aiGenerated: true
        });
      }

      return insights;
    } catch (error) {
      console.error('Error generating match insights:', error);
      throw new Error('Failed to generate match insights');
    }
  }

  // Generate conversation starters
  async generateConversationStarters(profile1: PsychologicalProfile, profile2: PsychologicalProfile): Promise<ConversationStarter[]> {
    try {
      const starters: ConversationStarter[] = [];

      // Based on shared interests and personality traits
      if (profile1.bigFive.openness > 70 && profile2.bigFive.openness > 70) {
        starters.push({
          id: `starter_${Date.now()}_1`,
          question: 'If you could have dinner with any historical figure, who would it be and why?',
          category: 'Philosophy',
          difficulty: 'medium',
          aiGenerated: true
        });
      }

      if (profile1.bigFive.extraversion > 60 && profile2.bigFive.extraversion > 60) {
        starters.push({
          id: `starter_${Date.now()}_2`,
          question: 'What\'s the most spontaneous thing you\'ve done recently?',
          category: 'Adventure',
          difficulty: 'easy',
          aiGenerated: true
        });
      }

      // Based on love languages
      if (profile1.loveLanguage.includes('words') || profile2.loveLanguage.includes('words')) {
        starters.push({
          id: `starter_${Date.now()}_3`,
          question: 'What\'s the most meaningful compliment you\'ve ever received?',
          category: 'Emotional',
          difficulty: 'easy',
          aiGenerated: true
        });
      }

      return starters;
    } catch (error) {
      console.error('Error generating conversation starters:', error);
      throw new Error('Failed to generate conversation starters');
    }
  }

  // Generate date ideas
  async generateDateIdeas(profile1: PsychologicalProfile, profile2: PsychologicalProfile): Promise<DateIdea[]> {
    try {
      const ideas: DateIdea[] = [];

      // Based on personality traits and interests
      if (profile1.bigFive.openness > 70 && profile2.bigFive.openness > 70) {
        ideas.push({
          id: `date_${Date.now()}_1`,
          title: 'Art Gallery & Philosophy Discussion',
          description: 'Visit a contemporary art gallery and discuss the deeper meanings behind the pieces.',
          category: 'Cultural',
          cost: 'medium',
          duration: '2-3 hours',
          location: 'Local art district',
          aiGenerated: true
        });
      }

      if (profile1.bigFive.extraversion > 60 && profile2.bigFive.extraversion > 60) {
        ideas.push({
          id: `date_${Date.now()}_2`,
          title: 'Cooking Class & Wine Tasting',
          description: 'Learn to cook a new cuisine together while sampling different wines.',
          category: 'Social',
          cost: 'high',
          duration: '3-4 hours',
          location: 'Cooking school',
          aiGenerated: true
        });
      }

      return ideas;
    } catch (error) {
      console.error('Error generating date ideas:', error);
      throw new Error('Failed to generate date ideas');
    }
  }

  // Private helper methods
  private async analyzeBigFiveTraits(userData: any): Promise<BigFiveTraits> {
    // In a real implementation, this would use AI to analyze user responses
    // For now, we'll simulate the analysis
    return {
      openness: Math.random() * 100,
      conscientiousness: Math.random() * 100,
      extraversion: Math.random() * 100,
      agreeableness: Math.random() * 100,
      neuroticism: Math.random() * 100
    };
  }

  private async analyzeEmotionalIntelligence(userData: any): Promise<EmotionalIntelligence> {
    return {
      selfAwareness: Math.random() * 100,
      selfRegulation: Math.random() * 100,
      motivation: Math.random() * 100,
      empathy: Math.random() * 100,
      socialSkills: Math.random() * 100
    };
  }

  private async generatePersonalityInsights(userData: any, bigFive: BigFiveTraits): Promise<PersonalityInsight[]> {
    return [
      {
        id: `insight_${Date.now()}`,
        category: 'Personality',
        insight: 'You show strong leadership qualities and natural charisma.',
        confidence: 0.85,
        evidence: ['High extraversion', 'Strong communication skills'],
        aiGenerated: true
      }
    ];
  }

  private async generateCompatibilityFactors(userData: any): Promise<CompatibilityFactor[]> {
    return [
      {
        id: `factor_${Date.now()}`,
        factor: 'Communication Style',
        importance: 0.9,
        description: 'How well you communicate with potential partners',
        aiReasoning: 'Based on your profile responses and interaction patterns'
      }
    ];
  }

  private async identifyGrowthAreas(userData: any, bigFive: BigFiveTraits): Promise<GrowthArea[]> {
    return [
      {
        id: `growth_${Date.now()}`,
        area: 'Emotional Expression',
        currentLevel: 60,
        potentialLevel: 85,
        suggestions: ['Practice active listening', 'Share feelings more openly']
      }
    ];
  }

  private async analyzeBehavioralPatterns(userData: any): Promise<BehavioralPattern[]> {
    return [
      {
        id: `pattern_${Date.now()}`,
        pattern: 'Morning Person',
        frequency: 0.8,
        context: 'Daily routine',
        aiAnalysis: 'Consistent early morning activity patterns detected'
      }
    ];
  }

  private async determineAttachmentStyle(userData: any): Promise<'secure' | 'anxious' | 'avoidant' | 'disorganized'> {
    const styles = ['secure', 'anxious', 'avoidant', 'disorganized'];
    return styles[Math.floor(Math.random() * styles.length)] as any;
  }

  private async determineLoveLanguages(userData: any): Promise<('words' | 'acts' | 'gifts' | 'time' | 'touch')[]> {
    const languages = ['words', 'acts', 'gifts', 'time', 'touch'];
    return languages.slice(0, Math.floor(Math.random() * 3) + 1) as any;
  }

  private async determineCommunicationStyle(userData: any): Promise<'direct' | 'diplomatic' | 'analytical' | 'expressive'> {
    const styles = ['direct', 'diplomatic', 'analytical', 'expressive'];
    return styles[Math.floor(Math.random() * styles.length)] as any;
  }

  private async determineConflictResolution(userData: any): Promise<'collaborative' | 'competitive' | 'accommodating' | 'avoidant' | 'compromising'> {
    const styles = ['collaborative', 'competitive', 'accommodating', 'avoidant', 'compromising'];
    return styles[Math.floor(Math.random() * styles.length)] as any;
  }

  private async determineRelationshipGoals(userData: any): Promise<('marriage' | 'long-term' | 'casual' | 'exploring' | 'friendship')[]> {
    const goals = ['marriage', 'long-term', 'casual', 'exploring', 'friendship'];
    return goals.slice(0, Math.floor(Math.random() * 2) + 1) as any;
  }

  private async determineDatingStyle(userData: any): Promise<'traditional' | 'modern' | 'adventurous' | 'low-key' | 'exclusive'> {
    const styles = ['traditional', 'modern', 'adventurous', 'low-key', 'exclusive'];
    return styles[Math.floor(Math.random() * styles.length)] as any;
  }

  private async determineIntimacyLevel(userData: any): Promise<'physical' | 'emotional' | 'intellectual' | 'spiritual' | 'all'> {
    const levels = ['physical', 'emotional', 'intellectual', 'spiritual', 'all'];
    return levels[Math.floor(Math.random() * levels.length)] as any;
  }

  private async determineSocialEnergy(userData: any): Promise<'introvert' | 'extrovert' | 'ambivert'> {
    const energies = ['introvert', 'extrovert', 'ambivert'];
    return energies[Math.floor(Math.random() * energies.length)] as any;
  }

  private async identifyStrengths(userData: any, bigFive: BigFiveTraits): Promise<string[]> {
    return ['Leadership', 'Creativity', 'Empathy', 'Communication'];
  }

  private calculateOverallScore(bigFive: BigFiveTraits, emotionalIntelligence: EmotionalIntelligence): number {
    const avgBigFive = (bigFive.openness + bigFive.conscientiousness + bigFive.extraversion + bigFive.agreeableness + (100 - bigFive.neuroticism)) / 5;
    return (avgBigFive + (emotionalIntelligence.selfAwareness + emotionalIntelligence.selfRegulation + emotionalIntelligence.motivation + emotionalIntelligence.empathy + emotionalIntelligence.socialSkills) / 5) / 2;
  }

  private calculateConfidence(userData: any): number {
    return Math.random() * 100;
  }

  private calculateAuthenticity(userData: any): number {
    return Math.random() * 100;
  }

  private async determineValues(userData: any): Promise<string[]> {
    return ['Honesty', 'Loyalty', 'Growth', 'Adventure', 'Family'];
  }

  private async determineGoals(userData: any): Promise<string[]> {
    return ['Find a life partner', 'Build a family', 'Travel the world', 'Start a business'];
  }

  private async determineInterests(userData: any): Promise<string[]> {
    return ['Technology', 'Travel', 'Fitness', 'Music', 'Art'];
  }

  private async analyzeLifestyle(userData: any): Promise<any> {
    return {
      dailyRoutine: 'Early bird',
      socialPreferences: 'Small groups',
      travelStyle: 'Adventure',
      workLifeBalance: 'Balanced',
      financialValues: 'Moderate',
      familyValues: 'Important'
    };
  }

  // Compatibility calculation methods
  private calculatePersonalityCompatibility(bigFive1: BigFiveTraits, bigFive2: BigFiveTraits): number {
    const differences = [
      Math.abs(bigFive1.openness - bigFive2.openness),
      Math.abs(bigFive1.conscientiousness - bigFive2.conscientiousness),
      Math.abs(bigFive1.extraversion - bigFive2.extraversion),
      Math.abs(bigFive1.agreeableness - bigFive2.agreeableness),
      Math.abs(bigFive1.neuroticism - bigFive2.neuroticism)
    ];
    const avgDifference = differences.reduce((sum, diff) => sum + diff, 0) / differences.length;
    return Math.max(0, 100 - avgDifference);
  }

  private calculateValuesCompatibility(profile1: PsychologicalProfile, profile2: PsychologicalProfile): number {
    return Math.random() * 100;
  }

  private calculateCommunicationCompatibility(profile1: PsychologicalProfile, profile2: PsychologicalProfile): number {
    return Math.random() * 100;
  }

  private calculateLifestyleCompatibility(profile1: PsychologicalProfile, profile2: PsychologicalProfile): number {
    return Math.random() * 100;
  }

  private calculateGoalsCompatibility(profile1: PsychologicalProfile, profile2: PsychologicalProfile): number {
    return Math.random() * 100;
  }

  private calculateEmotionalCompatibility(profile1: PsychologicalProfile, profile2: PsychologicalProfile): number {
    return Math.random() * 100;
  }

  private calculateIntellectualCompatibility(profile1: PsychologicalProfile, profile2: PsychologicalProfile): number {
    return Math.random() * 100;
  }

  private calculatePhysicalCompatibility(profile1: PsychologicalProfile, profile2: PsychologicalProfile): number {
    return Math.random() * 100;
  }

  private calculateSpiritualCompatibility(profile1: PsychologicalProfile, profile2: PsychologicalProfile): number {
    return Math.random() * 100;
  }

  // Cosmic and energy calculations
  private async calculateZodiacCompatibility(profile1: PsychologicalProfile, profile2: PsychologicalProfile): Promise<number> {
    return Math.random() * 100;
  }

  private async calculateLifePathNumbers(profile1: PsychologicalProfile, profile2: PsychologicalProfile): Promise<number> {
    return Math.random() * 100;
  }

  private async calculateChakraAlignment(profile1: PsychologicalProfile, profile2: PsychologicalProfile): Promise<number> {
    return Math.random() * 100;
  }

  private async calculateElementalBalance(profile1: PsychologicalProfile, profile2: PsychologicalProfile): Promise<number> {
    return Math.random() * 100;
  }

  private calculateEnergyLevelMatch(profile1: PsychologicalProfile, profile2: PsychologicalProfile): number {
    return Math.random() * 100;
  }

  private calculateVibrationMatch(profile1: PsychologicalProfile, profile2: PsychologicalProfile): number {
    return Math.random() * 100;
  }

  private calculateAuraCompatibility(profile1: PsychologicalProfile, profile2: PsychologicalProfile): number {
    return Math.random() * 100;
  }

  private calculateSpiritualAlignment(profile1: PsychologicalProfile, profile2: PsychologicalProfile): number {
    return Math.random() * 100;
  }

  private calculateMutualGrowth(profile1: PsychologicalProfile, profile2: PsychologicalProfile): number {
    return Math.random() * 100;
  }

  private calculateChallengeLevel(profile1: PsychologicalProfile, profile2: PsychologicalProfile): number {
    return Math.random() * 100;
  }

  private calculateSupportPotential(profile1: PsychologicalProfile, profile2: PsychologicalProfile): number {
    return Math.random() * 100;
  }

  private calculateLearningOpportunity(profile1: PsychologicalProfile, profile2: PsychologicalProfile): number {
    return Math.random() * 100;
  }

  private calculatePersonalityDifference(bigFive1: BigFiveTraits, bigFive2: BigFiveTraits): number {
    const differences = [
      Math.abs(bigFive1.openness - bigFive2.openness),
      Math.abs(bigFive1.conscientiousness - bigFive2.conscientiousness),
      Math.abs(bigFive1.extraversion - bigFive2.extraversion),
      Math.abs(bigFive1.agreeableness - bigFive2.agreeableness),
      Math.abs(bigFive1.neuroticism - bigFive2.neuroticism)
    ];
    return differences.reduce((sum, diff) => sum + diff, 0) / differences.length;
  }
}
