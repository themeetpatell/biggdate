// Re-export frontend types
export * from './frontend';

// Backend-specific types
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
}

export interface JWTConfig {
  secret: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

export interface AppConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  corsOrigin: string;
  database: DatabaseConfig;
  redis: RedisConfig;
  jwt: JWTConfig;
  aws?: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
  };
  email?: {
    service: string;
    user: string;
    pass: string;
  };
}

// Database Models
export interface UserModel {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_image?: string;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface FounderProfileModel {
  id: string;
  user_id: string;
  title: string;
  company: string;
  company_stage: string;
  industry: string;
  location: string;
  bio: string;
  vision: string;
  values: string[];
  skills: any[];
  achievements: any[];
  funding: any;
  team_size: number;
  looking_for: any;
  availability: string;
  pitch_deck?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CompatibilityScoreModel {
  id: string;
  founder_id: string;
  match_id: string;
  overall_score: number;
  vision_alignment: number;
  skill_complementarity: number;
  industry_fit: number;
  stage_compatibility: number;
  location_proximity: number;
  values_alignment: number;
  calculated_at: Date;
}

export interface MatchModel {
  id: string;
  founder_id: string;
  match_id: string;
  compatibility_score: number;
  status: string;
  mutual_connections: string[];
  shared_interests: string[];
  introduction_message?: string;
  created_at: Date;
  updated_at: Date;
}

// Request/Response Types
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: UserModel;
  accessToken: string;
  refreshToken: string;
}

// Error Types
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Service Types
export interface MatchingService {
  calculateCompatibility(founderId: string, matchId: string): Promise<CompatibilityScoreModel>;
  getDailyMatches(founderId: string, limit?: number): Promise<any[]>;
  getMutualConnections(founderId: string, matchId: string): Promise<string[]>;
  generateIntroductionSuggestions(founderId: string, matchId: string): Promise<string[]>;
}

export interface NotificationService {
  sendMatchNotification(founderId: string, matchId: string): Promise<void>;
  sendIntroductionRequest(fromId: string, toId: string, message: string): Promise<void>;
  sendEventReminder(eventId: string, attendeeIds: string[]): Promise<void>;
}

// Middleware Types
export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
}

export interface ValidationRule {
  field: string;
  rules: string[];
  customMessage?: string;
}
