import React, { useState, useEffect } from 'react';
import { 
  Heart,
  MessageCircle,
  Send,
  Smile,
  Camera,
  Mic,
  Image,
  Paperclip,
  MoreVertical,
  Star,
  Trophy,
  Target,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  MapPin,
  Phone,
  Video,
  Gift,
  Sparkles,
  Zap,
  Crown,
  Award,
  TrendingUp,
  Globe,
  Music,
  BookOpen,
  Coffee,
  Plane,
  Home,
  Car,
  Gamepad2,
  Palette,
  Code,
  Briefcase,
  Wine,
  ChefHat,
  Building,
  Eye,
  X
} from 'lucide-react';

const JourneyMode = () => {
  const [activeTab, setActiveTab] = useState('dates');
  const [message, setMessage] = useState('');
  const [showGuidedPrompts, setShowGuidedPrompts] = useState(false);
  const [journeyMatches, setJourneyMatches] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [journeyMilestones, setJourneyMilestones] = useState([]);
  const [unlockedFeatures, setUnlockedFeatures] = useState([]);
  const [scheduledDates, setScheduledDates] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [virtualDateOptions, setVirtualDateOptions] = useState([]);
  const [showDateScheduler, setShowDateScheduler] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState('');
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [pitchMessage, setPitchMessage] = useState('');
  const [isSendingPitch, setIsSendingPitch] = useState(false);

  // Load journey data on component mount
  useEffect(() => {
    loadJourneyData();
  }, []);

  const loadJourneyData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      const [matchesData, messagesData, milestonesData, featuresData, datesData, eventsData, virtualData] = await Promise.all([
        loadJourneyMatches(),
        loadMessages(),
        loadMilestones(),
        loadUnlockedFeatures(),
        loadScheduledDates(),
        loadUpcomingEvents(),
        loadVirtualDateOptions()
      ]);
      
      setJourneyMatches(matchesData);
      setCurrentMatch(matchesData[0] || null);
      setChatMessages(messagesData);
      setJourneyMilestones(milestonesData);
      setUnlockedFeatures(featuresData);
      setScheduledDates(datesData);
      setUpcomingEvents(eventsData);
      setVirtualDateOptions(virtualData);
    } catch (error) {
      console.error('Error loading journey data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadJourneyMatches = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      {
        id: 1,
        name: "Sarah Chen",
        role: "CTO",
        company: "EcoTech Solutions",
        photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        status: "online",
        isOnline: true,
        lastSeen: "2 minutes ago",
        compatibility: 92,
        sharedInterests: ["Sustainable Tech", "AI/ML", "Clean Energy"],
        interests: ["Sustainable Tech", "AI/ML", "Clean Energy", "Hiking", "Cooking"],
        mutualConnections: 12,
        location: "San Francisco, CA",
        age: 28,
        bio: "Passionate about building sustainable technology solutions that make a real impact. I love hiking, cooking, and deep conversations about the future of our planet.",
        currentMilestone: "Getting to Know Each Other",
        progress: 65
      }
    ];
  };

  const loadMessages = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        sender: "you",
        message: "Hey Sarah! I'm really excited about this connection. Your vision for sustainable tech really resonates with me.",
        timestamp: "2 hours ago",
        type: "text"
      },
      {
        id: 2,
        sender: "sarah",
        message: "Hi! I'm thrilled too! I'd love to learn more about your background and what you're working on.",
        timestamp: "1 hour ago",
        type: "text"
      },
      {
        id: 3,
        sender: "you",
        message: "I'm building a platform that helps small businesses track their carbon footprint. What about you?",
        timestamp: "45 minutes ago",
        type: "text"
      },
      {
        id: 4,
        sender: "sarah",
        message: "That's amazing! We're working on AI-powered solutions for energy optimization. Maybe we could explore some synergies?",
        timestamp: "30 minutes ago",
        type: "text"
      }
    ];
  };

  const loadMilestones = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: 1,
        title: "First Connection",
        description: "You and Sarah connected through mutual pitch acceptance",
        completed: true,
        date: "2024-01-15",
        points: 50
      },
      {
        id: 2,
        title: "Vision Alignment",
        description: "Both shared your startup visions and found common ground",
        completed: true,
        date: "2024-01-16",
        points: 75
      },
      {
        id: 3,
        title: "First Collaboration",
        description: "Discuss potential partnership or collaboration opportunities",
        completed: false,
        date: null,
        points: 100
      },
      {
        id: 4,
        title: "Meet in Person",
        description: "Schedule an in-person meeting or video call",
        completed: false,
        date: null,
        points: 150
      }
    ];
  };

  const loadUnlockedFeatures = async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
      {
        id: 1,
        name: "Shared Playlist",
        description: "Create and share music playlists together",
        icon: Music,
        unlocked: true
      },
      {
        id: 2,
        name: "Bucket List",
        description: "Share and collaborate on personal goals",
        icon: Target,
        unlocked: true
      },
      {
        id: 3,
        name: "Collaborative Notes",
        description: "Share ideas and notes in real-time",
        icon: BookOpen,
        unlocked: false
      },
      {
        id: 4,
        name: "Video Calls",
        description: "Schedule and join video calls together",
        icon: Video,
        unlocked: false
      }
    ];
  };

  const loadScheduledDates = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: 1,
        title: "Coffee & Startup Talk",
        type: "coffee",
        date: "2024-01-20",
        time: "2:00 PM",
        location: "Blue Bottle Coffee, SF",
        status: "confirmed",
        description: "Discuss our startup visions over coffee",
        partner: "Sarah Chen"
      },
      {
        id: 2,
        title: "Virtual Wine Tasting",
        type: "virtual",
        date: "2024-01-22",
        time: "7:00 PM",
        location: "Virtual",
        status: "pending",
        description: "Taste wines together via video call",
        partner: "Sarah Chen"
      },
      {
        id: 3,
        title: "Hiking Adventure",
        type: "outdoor",
        date: "2024-01-25",
        time: "9:00 AM",
        location: "Muir Woods",
        status: "tentative",
        description: "Explore nature and get to know each other",
        partner: "Sarah Chen"
      }
    ];
  };

  const loadUpcomingEvents = async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [
      {
        id: 1,
        title: "Startup Mixer: AI & Sustainability",
        date: "2024-01-18",
        time: "6:00 PM",
        location: "WeWork SF",
        type: "networking",
        attendees: 45,
        description: "Connect with like-minded entrepreneurs",
        price: "$25"
      },
      {
        id: 2,
        title: "Cooking Class: Sustainable Cuisine",
        date: "2024-01-21",
        time: "4:00 PM",
        location: "Cooking School SF",
        type: "activity",
        attendees: 12,
        description: "Learn to cook with local, sustainable ingredients",
        price: "$80"
      },
      {
        id: 3,
        title: "Tech Talk: Future of Clean Energy",
        date: "2024-01-24",
        time: "7:30 PM",
        location: "SF Public Library",
        type: "education",
        attendees: 120,
        description: "Expert panel on clean energy innovations",
        price: "Free"
      }
    ];
  };

  const loadVirtualDateOptions = async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
      {
        id: 1,
        title: "Virtual Wine Tasting",
        description: "Taste wines together via video call",
        duration: "90 minutes",
        icon: Wine,
        price: "$45",
        includes: ["Wine samples", "Expert sommelier", "Tasting guide"]
      },
      {
        id: 2,
        title: "Online Cooking Class",
        description: "Cook the same meal together virtually",
        duration: "2 hours",
        icon: ChefHat,
        price: "$60",
        includes: ["Recipe", "Ingredients list", "Live instruction"]
      },
      {
        id: 3,
        title: "Virtual Museum Tour",
        description: "Explore world-class museums together",
        duration: "60 minutes",
        icon: Building,
        price: "$25",
        includes: ["Live guide", "Interactive exhibits", "Q&A session"]
      },
      {
        id: 4,
        title: "Online Game Night",
        description: "Play games together virtually",
        duration: "2 hours",
        icon: Gamepad2,
        price: "$20",
        includes: ["Multiple games", "Leaderboard", "Prizes"]
      }
    ];
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isSendingMessage) return;
    
    setIsSendingMessage(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMessage = {
        id: Date.now(),
        sender: "you",
        message: message.trim(),
        timestamp: "Just now",
        type: "text"
      };
      
      setChatMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Simulate response after a delay
      setTimeout(() => {
        const responseMessage = {
          id: Date.now() + 1,
          sender: "sarah",
          message: "That's a great point! I'd love to discuss this further.",
          timestamp: "Just now",
          type: "text"
        };
        setChatMessages(prev => [...prev, responseMessage]);
      }, 2000);
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendPitch = async () => {
    if (!pitchMessage.trim() || isSendingPitch) return;
    
    setIsSendingPitch(true);
    try {
      // Simulate sending pitch
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPitchMessage('');
      setShowPitchModal(false);
      
      // Show success message
      alert('Pitch sent successfully! 🚀');
    } catch (error) {
      console.error('Error sending pitch:', error);
      alert('Failed to send pitch. Please try again.');
    } finally {
      setIsSendingPitch(false);
    }
  };


  // Guided prompts for chat
  const guidedPrompts = [
    {
      id: 1,
      title: "Pitch your perfect weekend",
      description: "Describe your ideal weekend in detail",
      category: "Lifestyle",
      icon: Coffee
    },
    {
      id: 2,
      title: "MVP Date idea",
      description: "What would be your minimum viable product for a first date?",
      category: "Dating",
      icon: Heart
    },
    {
      id: 3,
      title: "Startup philosophy",
      description: "What's your core philosophy when building products?",
      category: "Business",
      icon: Target
    },
    {
      id: 4,
      title: "Future vision",
      description: "Where do you see yourself in 5 years?",
      category: "Career",
      icon: TrendingUp
    }
  ];


  const milestones = [
    {
      id: 1,
      title: "First Connection",
      description: "You both accepted each other's pitches",
      completed: true,
      date: "2 days ago",
      icon: CheckCircle
    },
    {
      id: 2,
      title: "Vision Revealed",
      description: "You both shared your vision cards",
      completed: true,
      date: "1 day ago",
      icon: Eye
    },
    {
      id: 3,
      title: "Getting to Know Each Other",
      description: "Share 5 personal stories",
      completed: false,
      progress: 65,
      icon: Users
    },
    {
      id: 4,
      title: "First Collaboration",
      description: "Work on a project together",
      completed: false,
      icon: Briefcase
    },
    {
      id: 5,
      title: "Meet in Person",
      description: "Plan your first IRL meeting",
      completed: false,
      icon: MapPin
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "other",
      message: "Hey! I'm so excited we made it to Journey Mode! 🚀",
      timestamp: "2 hours ago",
      type: "text"
    },
    {
      id: 2,
      sender: "me",
      message: "Me too! Your vision for sustainable tech really resonated with me. I'd love to learn more about your journey.",
      timestamp: "2 hours ago",
      type: "text"
    },
    {
      id: 3,
      sender: "other",
      message: "That's amazing! I'd love to hear about your experience with AI/ML. What's the most interesting project you've worked on?",
      timestamp: "1 hour ago",
      type: "text"
    },
    {
      id: 4,
      sender: "other",
      message: "Also, I saw you're into hiking! I just got back from a trip to Yosemite. Here's a photo from the top of Half Dome!",
      timestamp: "1 hour ago",
      type: "image",
      content: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      sender: "me",
      message: "Wow, that's incredible! I've been wanting to do Half Dome for years. Maybe we could plan a hiking trip together?",
      timestamp: "30 minutes ago",
      type: "text"
    }
  ];

  const sharedFeatures = [
    {
      id: 1,
      title: "Collaborative Playlist",
      description: "Build a playlist together",
      icon: Music,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 2,
      title: "Shared Bucket List",
      description: "Create and track goals together",
      icon: Target,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      title: "Project Notes",
      description: "Collaborate on ideas and projects",
      icon: BookOpen,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 4,
      title: "Meeting Scheduler",
      description: "Plan your next meeting",
      icon: Calendar,
      color: "from-orange-500 to-red-500"
    }
  ];


  const handleGuidedPrompt = (prompt) => {
    setMessage(prompt.title + ": ");
    setShowGuidedPrompts(false);
  };

  const renderDatesTab = () => (
    <div className="space-y-6">
      {/* Scheduled Dates */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Scheduled Dates</h3>
          <button
            onClick={() => setShowDateScheduler(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-xs"
          >
            + Schedule Date
          </button>
        </div>
        <div className="space-y-4">
          {scheduledDates.map((date) => (
            <div key={date.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    date.status === 'confirmed' ? 'bg-green-500' : 
                    date.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}></div>
                  <h4 className="font-medium text-gray-900 text-sm">{date.title}</h4>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  date.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                  date.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {date.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{date.date} at {date.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{date.location}</span>
                </div>
              </div>
              <p className="text-xs text-gray-700 mt-2">{date.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Virtual Date Options */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Virtual Date Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {virtualDateOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.id} className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{option.title}</h4>
                    <p className="text-xs text-gray-600">{option.duration}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-700 mb-3">{option.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-purple-600 text-sm">{option.price}</span>
                  <button className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-xs">
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Events</h3>
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {event.type}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date} at {event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              </div>
              <p className="text-xs text-gray-700 mb-3">{event.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>{event.attendees} attendees</span>
                  <span className="font-medium text-gray-900 text-sm">{event.price}</span>
                </div>
                <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 text-xs">
                  Join Event
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChatTab = () => (
    <div className="flex flex-col h-[600px] bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
                src={currentMatch?.photo || currentMatch?.avatar || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"}
                alt={currentMatch?.name || "Match"}
              className="w-12 h-12 rounded-2xl object-cover"
            />
              {currentMatch?.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
              <h3 className="text-lg font-semibold text-gray-900">{currentMatch?.name || "Match"}</h3>
              <p className="text-sm text-gray-600">{currentMatch?.role || "Role"} • {currentMatch?.company || "Company"}</p>
              <p className="text-xs text-gray-500">{currentMatch?.location || "Location"}</p>
          </div>
          </div>
          <button
            onClick={() => setShowPitchModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-sm font-medium"
          >
            <Target className="w-4 h-4" />
            Pitch {currentMatch?.name?.split(' ')[0] || 'them'}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-xl ${
              msg.sender === 'me' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              {msg.type === 'image' ? (
                <div>
                  <img src={msg.content} alt="Shared image" className="w-full rounded-xl mb-2" />
                  <p className="text-xs">{msg.message}</p>
                </div>
              ) : (
                <p>{msg.message}</p>
              )}
              <p className={`text-xs mt-1 ${
                msg.sender === 'me' ? 'text-purple-100' : 'text-gray-500'
              }`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
            <Image className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
            <Mic className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              disabled={isSendingMessage}
            />
            <button
              onClick={() => setShowGuidedPrompts(!showGuidedPrompts)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-purple-600 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={isSendingMessage || !message.trim()}
            className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSendingMessage ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Guided Prompts */}
        {showGuidedPrompts && (
          <div className="mt-4 p-4 bg-white rounded-2xl border border-gray-200 shadow-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Guided Conversation Starters</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {guidedPrompts.map((prompt) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={prompt.id}
                    onClick={() => handleGuidedPrompt(prompt)}
                    className="flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{prompt.title}</div>
                      <div className="text-xs text-gray-500">{prompt.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderMilestonesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Journey Milestones</h3>
        <div className="space-y-4">
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon;
            return (
              <div key={milestone.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  milestone.completed 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : milestone.progress 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                    : 'bg-gray-200'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    milestone.completed || milestone.progress ? 'text-white' : 'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{milestone.title}</h4>
                  <p className="text-xs text-gray-600">{milestone.description}</p>
                  {milestone.completed && (
                    <p className="text-xs text-green-600">Completed {milestone.date}</p>
                  )}
                  {milestone.progress && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{milestone.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${milestone.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderFeaturesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Collaborative Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sharedFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                </div>
                <button className="w-full px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-xs">
                  Open Feature
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Combined Profile Header */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face"
                alt="You"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-200"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              <span className="text-xl font-semibold text-gray-900">We Are One</span>
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
            <div className="relative">
              <img
                src={currentMatch?.photo || currentMatch?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"}
                alt={currentMatch?.name || "Match"}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-200"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Our Journey Together</h3>
          <p className="text-lg text-gray-600">Building something beautiful, one day at a time</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-500">Both online</span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500">Connected 3 days ago</span>
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowPitchModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-sm font-medium shadow-lg"
            >
              <Target className="w-4 h-4" />
              Pitch {currentMatch?.name?.split(' ')[0] || 'them'}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Our Story */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-3">Our Story</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              We connected through our shared passion for sustainable technology and building meaningful impact. 
              What started as a professional conversation about AI and clean energy has evolved into something much deeper. 
              We're both entrepreneurs who believe in using technology to solve real-world problems, and we're excited 
              to explore what we can build together - both in our careers and in our relationship.
            </p>
          </div>

          {/* Shared Values */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-3">Our Shared Values</h4>
            <div className="flex flex-wrap gap-2">
              {["Innovation", "Sustainability", "Impact", "Growth", "Authenticity", "Adventure"].map((value, index) => (
                <span key={index} className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs rounded-full font-medium">
                  {value}
                </span>
              ))}
            </div>
          </div>

          {/* Combined Interests */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-3">What We Love Together</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <h5 className="font-medium text-gray-900 mb-1 text-sm">Adventure & Travel</h5>
                <p className="text-xs text-gray-600">Hiking, exploring new cities, discovering hidden gems</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <h5 className="font-medium text-gray-900 mb-1 text-sm">Food & Cooking</h5>
                <p className="text-xs text-gray-600">Sustainable cuisine, wine tasting, cooking together</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <h5 className="font-medium text-gray-900 mb-1 text-sm">Technology & Innovation</h5>
                <p className="text-xs text-gray-600">AI/ML, clean energy, building the future</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                <h5 className="font-medium text-gray-900 mb-1 text-sm">Learning & Growth</h5>
                <p className="text-xs text-gray-600">Deep conversations, continuous learning, mentoring</p>
              </div>
            </div>
          </div>

          {/* Our Goals */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-3">Our Goals Together</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Build a meaningful relationship based on shared values</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700">Explore potential business collaborations</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                <Globe className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-700">Travel and experience new cultures together</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                <Heart className="w-4 h-4 text-pink-500" />
                <span className="text-sm text-gray-700">Support each other's personal and professional growth</span>
              </div>
            </div>
          </div>

          {/* Journey Progress */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-3">Our Journey Progress</h4>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-gray-900 text-sm">Getting to Know Each Other</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <span>Relationship Progress</span>
                <span>65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: "65%" }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">3</div>
                  <div className="text-gray-600">Days Connected</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-pink-600">12</div>
                  <div className="text-gray-600">Messages Exchanged</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dates':
        return renderDatesTab();
      case 'chat':
        return renderChatTab();
      case 'milestones':
        return renderMilestonesTab();
      case 'features':
        return renderFeaturesTab();
      case 'profile':
        return renderProfileTab();
      default:
        return renderDatesTab();
    }
  };


  // Show no matches state
  if (!currentMatch && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Journey</h2>
          <p className="text-gray-600 mb-6">You don't have any active journeys right now.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading || !currentMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Journey Mode</h1>
            <p className="text-sm text-gray-600">Level 3 - Unicorn Stage</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-2xl">
              <Crown className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-700 text-sm">1 Active Journey</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
            <div className="flex space-x-2">
              {[
                { id: 'dates', label: 'Dates', icon: Calendar, color: 'from-purple-500 to-pink-500' },
                { id: 'chat', label: 'Chat', icon: MessageCircle, color: 'from-blue-500 to-cyan-500' },
                { id: 'milestones', label: 'Milestones', icon: Target, color: 'from-green-500 to-emerald-500' },
                { id: 'features', label: 'Features', icon: Sparkles, color: 'from-orange-500 to-red-500' },
                { id: 'profile', label: 'Profile', icon: Users, color: 'from-indigo-500 to-purple-500' }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                      isActive
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {renderTabContent()}
        </div>
      </div>

      {/* Pitch Modal */}
      {showPitchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Pitch {currentMatch?.name?.split(' ')[0] || 'them'}
              </h2>
              <button
                onClick={() => setShowPitchModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Pitch
              </label>
              <textarea
                value={pitchMessage}
                onChange={(e) => setPitchMessage(e.target.value)}
                placeholder="Share your vision, ideas, or what you'd like to collaborate on..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                rows={4}
                disabled={isSendingPitch}
              />
              <p className="text-xs text-gray-500 mt-1">
                Be specific about what you're looking for and what you can offer.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowPitchModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                disabled={isSendingPitch}
              >
                Cancel
              </button>
              <button
                onClick={handleSendPitch}
                disabled={isSendingPitch || !pitchMessage.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isSendingPitch ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Pitch'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyMode;
