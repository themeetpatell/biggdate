import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye,
  Heart,
  X,
  Clock,
  Users,
  Target,
  Award,
  Star,
  MessageCircle,
  Play,
  Pause,
  Volume2,
  Share2,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Sparkles,
  Zap,
  Globe,
  TrendingUp,
  Lightbulb,
  Rocket
} from 'lucide-react';

const RevealMode = () => {
  const [activeMatch, setActiveMatch] = useState(0);
  const [showVoiceNote, setShowVoiceNote] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [revealMatches, setRevealMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  // Load reveal matches data on component mount
  useEffect(() => {
    loadRevealMatches();
  }, []);

  const loadRevealMatches = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const matches = [
        {
          id: 1,
          name: "Sarah Chen",
          role: "CTO",
          stage: "Series A",
          company: "EcoTech Solutions",
          timeAgo: "1 day ago",
          mutualValues: ["Innovation", "Impact", "Learning"],
          sharedInterests: ["Sustainable Tech", "AI/ML", "Clean Energy"],
          vision: "Building the future of sustainable technology through AI-powered solutions that help businesses reduce their carbon footprint while increasing efficiency.",
          manifesto: "I believe technology should serve humanity and the planet. Every line of code I write, every product I build, is with the intention of creating a more sustainable and equitable world. I'm here to find someone who shares this vision and wants to build something meaningful together.",
          voiceNote: {
            duration: "2:34",
            transcript: "Hi! I'm really excited about this connection. I'd love to tell you more about my vision for sustainable tech and hear about your journey..."
          },
          creativeReveal: {
            type: "video",
            title: "My Vision in 60 Seconds",
            thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop"
          },
          stats: {
            yearsExperience: 8,
            companiesFounded: 1,
            successfulExits: 0,
            teamSize: 25
          },
          achievements: [
            "Forbes 30 Under 30",
            "TechCrunch Disrupt Winner",
            "Green Tech Innovation Award"
          ],
          socialProof: {
            linkedinConnections: 5000,
            twitterFollowers: 12000,
            githubStars: 2500
          }
        },
        {
          id: 2,
          name: "Alex Rodriguez",
          role: "Founder & CEO",
          stage: "Seed",
          company: "HealthTech Innovations",
          timeAgo: "2 days ago",
          mutualValues: ["Growth", "Leadership", "Innovation"],
          sharedInterests: ["Healthcare", "AI/ML", "Mobile Apps"],
          vision: "Democratizing healthcare access through innovative mobile-first solutions that make quality healthcare affordable and accessible to everyone, regardless of their location or economic status.",
          manifesto: "Healthcare is a fundamental human right, not a privilege. I'm building technology that breaks down barriers and makes quality healthcare accessible to everyone. I'm looking for a co-founder who shares this mission and wants to make a real impact on people's lives.",
          voiceNote: {
            duration: "1:45",
            transcript: "Hey there! I'm passionate about using technology to solve real healthcare problems. Would love to connect and explore how we can work together..."
          },
          creativeReveal: {
            type: "image",
            title: "My Workspace",
            thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop"
          },
          stats: {
            yearsExperience: 6,
            companiesFounded: 1,
            successfulExits: 0,
            teamSize: 12
          },
          achievements: [
            "Y Combinator Alumni",
            "Healthcare Innovation Award",
            "Startup of the Year Finalist"
          ],
          socialProof: {
            linkedinConnections: 3000,
            twitterFollowers: 8000,
            githubStars: 1200
          }
        },
        {
          id: 3,
          name: "Maya Patel",
          role: "Product Manager",
          stage: "Growth",
          company: "FinTech Solutions",
          timeAgo: "3 days ago",
          mutualValues: ["Impact", "Learning", "Community"],
          sharedInterests: ["Financial Inclusion", "Mobile Banking", "User Experience"],
          vision: "Creating financial products that empower underserved communities and help them build wealth through accessible, user-friendly mobile banking solutions.",
          manifesto: "Financial inclusion is the key to economic equality. I'm passionate about building products that give everyone access to the financial tools they need to succeed. Looking for someone who wants to make finance more accessible and inclusive.",
          voiceNote: {
            duration: "3:12",
            transcript: "Hello! I'm excited about the possibility of working together on something that could really change people's lives through better financial products..."
          },
          creativeReveal: {
            type: "presentation",
            title: "My Product Vision",
            thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
          },
          stats: {
            yearsExperience: 7,
            companiesFounded: 0,
            successfulExits: 0,
            teamSize: 50
          },
          achievements: [
            "Product Manager of the Year",
            "FinTech Innovation Award",
            "User Experience Excellence Award"
          ],
          socialProof: {
            linkedinConnections: 4000,
            twitterFollowers: 6000,
            githubStars: 800
          }
        }
      ];
      
      setRevealMatches(matches);
    } catch (error) {
      console.error('Error loading reveal matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Current match from loaded data
  const currentMatch = revealMatches[activeMatch];

  const handleMoveToJourney = async (matchId) => {
    setActionLoading(prev => ({ ...prev, [matchId]: true }));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove from reveal matches
      setRevealMatches(prev => prev.filter(match => match.id !== matchId));
      
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
      // Navigate to Journey Mode
      navigate('/journey');
    } catch (error) {
      console.error('Error moving to journey:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [matchId]: false }));
    }
  };

  const handleEndConnection = async (matchId) => {
    setActionLoading(prev => ({ ...prev, [matchId]: true }));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Remove from matches
      setRevealMatches(prev => prev.filter(match => match.id !== matchId));
      
      // If no more matches, go back to home
      if (revealMatches.length <= 1) {
        navigate('/home');
      } else {
        // Move to next match
        setActiveMatch(prev => Math.min(prev, revealMatches.length - 2));
      }
    } catch (error) {
      console.error('Error ending connection:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [matchId]: false }));
    }
  };

  const handleBookmark = async (matchId) => {
    setActionLoading(prev => ({ ...prev, [matchId]: true }));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Toggle bookmark status
      setRevealMatches(prev => 
        prev.map(match => 
          match.id === matchId 
            ? { ...match, isBookmarked: !match.isBookmarked }
            : match
        )
      );
    } catch (error) {
      console.error('Error bookmarking match:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [matchId]: false }));
    }
  };

  const handlePlayVoiceNote = () => {
    setIsPlaying(!isPlaying);
    // Play/pause voice note
  };

  const handleNextMatch = () => {
    if (activeMatch < revealMatches.length - 1) {
      setActiveMatch(activeMatch + 1);
    }
  };

  const handlePrevMatch = () => {
    if (activeMatch > 0) {
      setActiveMatch(activeMatch - 1);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading matches...</p>
        </div>
      </div>
    );
  }

  // Show no matches state
  if (revealMatches.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Matches Yet</h2>
          <p className="text-gray-600 mb-6">You don't have any matches in Reveal Mode right now.</p>
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-slide-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>Moving to Journey Mode!</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reveal Mode</h1>
            <p className="text-gray-600">Level 2 - Series A Stage</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-2xl">
              <Eye className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-700">{revealMatches.length} Matches</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMatch}
                disabled={activeMatch === 0}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-sm text-gray-500">
                {activeMatch + 1} of {revealMatches.length}
              </span>
              <button
                onClick={handleNextMatch}
                disabled={activeMatch === revealMatches.length - 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Vision Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Match Header */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 border-b border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{currentMatch.name}</h2>
                    <p className="text-xl text-gray-600">{currentMatch.role} • {currentMatch.stage}</p>
                    <p className="text-gray-500">{currentMatch.company}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{currentMatch.timeAgo}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{currentMatch.compatibility}%</div>
                    <div className="text-sm text-gray-500">Compatibility</div>
                  </div>
                  <button
                    onClick={() => handleBookmark(currentMatch.id)}
                    disabled={actionLoading[currentMatch.id]}
                    className={`p-3 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      currentMatch.isBookmarked 
                        ? 'text-yellow-500 bg-yellow-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {actionLoading[currentMatch.id] ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                    ) : (
                      <Bookmark className={`w-6 h-6 ${currentMatch.isBookmarked ? 'fill-current' : ''}`} />
                    )}
                  </button>
                </div>
              </div>

              {/* Shared Values & Interests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Shared Values</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentMatch.mutualValues.map((value, index) => (
                      <span key={index} className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm rounded-full">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Shared Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentMatch.sharedInterests.map((interest, index) => (
                      <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 text-sm rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Vision & Manifesto */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Vision */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-500" />
                    Vision
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{currentMatch.vision}</p>
                </div>

                {/* Manifesto */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Rocket className="w-6 h-6 text-purple-500" />
                    Why I'm Here
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{currentMatch.manifesto}</p>
                </div>
              </div>

              {/* Stats & Achievements */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Track Record</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Years Experience</span>
                      <span className="font-semibold">{currentMatch.stats.yearsExperience}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Companies Founded</span>
                      <span className="font-semibold">{currentMatch.stats.companiesFounded}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Successful Exits</span>
                      <span className="font-semibold">{currentMatch.stats.successfulExits}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Current Funding</span>
                      <span className="font-semibold text-green-600">{currentMatch.stats.currentFunding}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Achievements</h3>
                  <div className="space-y-2">
                    {currentMatch.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-700">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Voice Note & Creative Reveal */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Voice Note */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-blue-600" />
                    Voice Note
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={handlePlayVoiceNote}
                      className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                    <div>
                      <div className="font-semibold text-gray-900">{currentMatch.voiceNote.duration}</div>
                      <div className="text-sm text-gray-600">Personal message</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic">"{currentMatch.voiceNote.transcript}"</p>
                </div>

                {/* Creative Reveal */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Creative Reveal
                  </h3>
                  <div className="relative">
                    <img
                      src={currentMatch.creativeReveal.thumbnail}
                      alt={currentMatch.creativeReveal.title}
                      className="w-full h-32 object-cover rounded-xl mb-3"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl flex items-center justify-center">
                      <button className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-gray-900 hover:bg-opacity-100 transition-all duration-300">
                        <Play className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900">{currentMatch.creativeReveal.title}</h4>
                  <p className="text-sm text-gray-600 capitalize">{currentMatch.creativeReveal.type}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-50 px-8 py-6 flex items-center justify-between">
              <button
                onClick={() => handleEndConnection(currentMatch.id)}
                disabled={actionLoading[currentMatch.id]}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading[currentMatch.id] ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    Ending...
                  </div>
                ) : (
                  'End Connection'
                )}
              </button>
              <div className="flex items-center gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-semibold">
                  <MessageCircle className="w-5 h-5 inline mr-2" />
                  Send Message
                </button>
                <button
                  onClick={() => handleMoveToJourney(currentMatch.id)}
                  disabled={actionLoading[currentMatch.id]}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading[currentMatch.id] ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Moving...
                    </div>
                  ) : (
                    <>
                      <Heart className="w-5 h-5 inline mr-2" />
                      Move to Journey
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevealMode;
