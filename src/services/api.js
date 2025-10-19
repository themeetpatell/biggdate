// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Mock Auth API - Simulates authentication without backend
export const authApi = {
  login: async (credentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    const mockUser = {
      id: '1',
      email: credentials.email,
      firstName: 'Alex',
      lastName: 'Chen',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const mockTokens = {
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    };
    
    return {
      user: mockUser,
      accessToken: mockTokens.accessToken,
      refreshToken: mockTokens.refreshToken
    };
  },

  register: async (userData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful registration
    const mockUser = {
      id: '1',
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      company: userData.company || '',
      title: userData.title || '',
      location: userData.location || '',
      bio: userData.bio || '',
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const mockTokens = {
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    };
    
    return {
      user: mockUser,
      accessToken: mockTokens.accessToken,
      refreshToken: mockTokens.refreshToken
    };
  },

  logout: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  refreshToken: async (refreshToken) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      accessToken: 'mock-refreshed-access-token-' + Date.now()
    };
  },
};

// Mock Discovery API
export const discoveryApi = {
  getProfiles: async (filters) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return empty array - the component will use mock data from Redux store
    return { profiles: [] };
  },

  sendPitch: async (profileId, pitch) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Pitch sent successfully' };
  },

  likeProfile: async (profileId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, message: 'Profile liked successfully' };
  },
};


// Mock Pitches API
export const pitchesApi = {
  getPitches: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { 
      pitches: [
        {
          id: 1,
          from: {
            name: 'Sarah Johnson',
            title: 'CTO & Co-Founder',
            company: 'HealthAI',
            location: 'Boston, MA',
            avatar: 'SJ',
            verified: true
          },
          subject: 'Potential Co-Founder Opportunity',
          message: 'Hi! I saw your profile and I think we\'d make an incredible team. I\'m building HealthAI, a platform that uses AI to revolutionize healthcare diagnostics. Your experience in scaling teams and your passion for impact-driven products really resonates with me. Would love to discuss how we could potentially work together!',
          receivedAt: '2 hours ago',
          read: false,
          status: 'new',
          compatibility: 92,
          sharedInterests: ['AI/ML', 'Healthcare', 'Impact'],
          mutualConnections: 3
        }
      ]
    };
  },

  replyToPitch: async (pitchId, reply) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Reply sent successfully' };
  },

  markAsRead: async (pitchId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  },
};


// Mock Profile API
export const profileApi = {
  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { profile: null }; // Will use mock data from Redux store
  },

  updateProfile: async (profileData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, profile: profileData };
  },

  uploadAvatar: async (file) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, url: URL.createObjectURL(file) };
  },
};

export { ApiError };
