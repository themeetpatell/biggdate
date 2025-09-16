import React, { useState, useEffect } from 'react';
import { 
  User, Camera, Edit3, Settings, Share2, Heart, MessageCircle, Calendar, MapPin, Briefcase, GraduationCap, Award, Star, Lock, Unlock, Eye, EyeOff, ChevronRight, ChevronDown, Plus, Minus, CheckCircle, X, Zap, Trophy, Target, TrendingUp, Globe, Phone, Mail, Instagram, Twitter, Linkedin, Github, ExternalLink, Crown, Diamond, Flame, Sparkles, Rocket, Brain, Lightbulb, Code, Palette, Music, Coffee, Plane, Gamepad2, BookOpen, Users, Clock, BarChart3, Activity, Compass, Shield, Badge, Gift, Video, Image as ImageIcon, FileText, Download, Play, Pause, Volume2, ThumbsUp, MessageSquare, Send, Bookmark, Flag, MoreHorizontal, Search, Filter, SortAsc, SortDesc, RefreshCw, Bell, BellOff, Eye as EyeIcon, EyeOff as EyeOffIcon, ChevronUp, ChevronLeft, ChevronRight as ChevronRightIcon, ChevronDown as ChevronDownIcon, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Maximize2, Minimize2, RotateCcw, RotateCw, ZoomIn, ZoomOut, Move, Copy, Scissors, Trash2, Save, Upload, Download as DownloadIcon, Link, Link2, Unlink, Lock as LockIcon, Key, KeyRound, Shield as ShieldIcon, ShieldCheck, ShieldAlert, AlertCircle, Info, HelpCircle, CheckCircle2, XCircle, PlusCircle, MinusCircle, X as XIcon, Check as CheckIcon, AlertTriangle, AlertOctagon, AlertCircle as AlertCircleIcon, Info as InfoIcon, HelpCircle as HelpCircleIcon, CheckCircle as CheckCircleIcon, XCircle as XCircleIcon, PlusCircle as PlusCircleIcon, MinusCircle as MinusCircleIcon, X as XIcon2, Check as CheckIcon2
} from 'lucide-react';

const ProfileRedesign = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [showPersonalityTest, setShowPersonalityTest] = useState(false);

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userRole = localStorage.getItem('userRole') || 'founder';
      const whyHere = localStorage.getItem('whyHere') || 'Building the future of technology';
      const selectedValues = JSON.parse(localStorage.getItem('selectedValues') || '[]');
      const tagline = localStorage.getItem('tagline') || 'Passionate about innovation';
      const pitchSlot = localStorage.getItem('pitchSlot') || 'Looking for a co-founder who shares my vision...';
      
      const profileData = {
        // Basic Info
        basic: {
          name: "Alex Chen",
          age: 28,
          location: "San Francisco, CA",
          photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
          coverPhoto: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=400&fit=crop",
          bio: "Passionate entrepreneur building the future of technology. Love hiking, cooking, and connecting with like-minded founders. When I'm not coding, you'll find me exploring the mountains or experimenting with new recipes.",
          role: userRole,
          stage: "Series A",
          company: "TechFlow Solutions",
          industry: "SaaS",
          tagline: tagline,
          pitchSlot: pitchSlot,
          mission: whyHere,
          values: selectedValues,
          isVerified: true,
          isPremium: true,
          joinDate: "2024-01-15",
          lastActive: "2 hours ago"
        },

        // Professional Details
        professional: {
          workExperience: [
            {
              id: 1,
              company: "TechFlow Solutions",
              position: "Founder & CEO",
              duration: "2022 - Present",
              location: "San Francisco, CA",
              description: "Leading a team of 15 engineers building AI-powered solutions for sustainable business operations. Raised $2.5M in Series A funding.",
              achievements: ["Raised $2.5M Series A", "Built team of 15", "1000+ customers"],
              logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop"
            },
            {
              id: 2,
              company: "Google",
              position: "Senior Software Engineer",
              duration: "2019 - 2022",
              location: "Mountain View, CA",
              description: "Developed scalable backend systems for Google Cloud Platform. Led a team of 5 engineers.",
              achievements: ["Promoted to Senior", "Led team of 5", "2 patents filed"],
              logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop"
            },
            {
              id: 3,
              company: "Microsoft",
              position: "Software Engineer",
              duration: "2017 - 2019",
              location: "Seattle, WA",
              description: "Worked on Azure cloud infrastructure and machine learning platforms.",
              achievements: ["Azure certification", "ML platform launch", "Performance optimization"],
              logo: "https://images.unsplash.com/photo-1599305445771-b384be2768f8?w=100&h=100&fit=crop"
            }
          ],
          education: [
            {
              id: 1,
              school: "Stanford University",
              degree: "Master of Science in Computer Science",
              year: "2017",
              gpa: "3.9/4.0",
              activities: ["AI Research Lab", "Startup Incubator", "Tennis Team"],
              logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&h=100&fit=crop"
            },
            {
              id: 2,
              school: "UC Berkeley",
              degree: "Bachelor of Science in Computer Science",
              year: "2015",
              gpa: "3.8/4.0",
              activities: ["Computer Science Society", "Hackathon Winner", "Research Assistant"],
              logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&h=100&fit=crop"
            }
          ],
          skills: {
            technical: [
              { name: "JavaScript", level: 95, category: "Programming" },
              { name: "Python", level: 90, category: "Programming" },
              { name: "React", level: 88, category: "Frontend" },
              { name: "Node.js", level: 85, category: "Backend" },
              { name: "AWS", level: 82, category: "Cloud" },
              { name: "Machine Learning", level: 78, category: "AI/ML" },
              { name: "Docker", level: 75, category: "DevOps" },
              { name: "GraphQL", level: 70, category: "API" }
            ],
            soft: [
              { name: "Leadership", level: 92 },
              { name: "Communication", level: 88 },
              { name: "Problem Solving", level: 95 },
              { name: "Team Management", level: 85 },
              { name: "Public Speaking", level: 80 },
              { name: "Strategic Thinking", level: 90 }
            ]
          },
          certifications: [
            { name: "AWS Solutions Architect", issuer: "Amazon", date: "2023", credential: "AWS-SAA-001" },
            { name: "Google Cloud Professional", issuer: "Google", date: "2022", credential: "GCP-PRO-002" },
            { name: "Certified Scrum Master", issuer: "Scrum Alliance", date: "2021", credential: "CSM-003" }
          ]
        },

        // Personal Details
        personal: {
          interests: [
            { name: "Hiking", icon: "🏔️", level: "Expert" },
            { name: "Cooking", icon: "👨‍🍳", level: "Advanced" },
            { name: "Photography", icon: "📸", level: "Intermediate" },
            { name: "Tennis", icon: "🎾", level: "Advanced" },
            { name: "Travel", icon: "✈️", level: "Expert" },
            { name: "Reading", icon: "📚", level: "Expert" },
            { name: "Gaming", icon: "🎮", level: "Casual" },
            { name: "Music", icon: "🎵", level: "Intermediate" }
          ],
          personality: {
            type: "ENTJ",
            traits: ["Analytical", "Ambitious", "Confident", "Strategic", "Decisive"],
            values: ["Innovation", "Excellence", "Growth", "Impact", "Integrity"],
            communication: "Direct and results-oriented",
            workStyle: "Collaborative with high standards"
          },
          lifestyle: {
            workSchedule: "Flexible",
            travelFrequency: "Monthly",
            socialActivity: "High",
            fitnessLevel: "Active",
            diet: "Flexitarian",
            hobbies: ["Mountain Biking", "Wine Tasting", "Chess", "Podcasting"]
          },
          socialLinks: {
            linkedin: "https://linkedin.com/in/alexchen-tech",
            twitter: "https://twitter.com/alexchen_tech",
            github: "https://github.com/alexchen-dev",
            instagram: "https://instagram.com/alexchen_life",
            website: "https://alexchen.dev"
          }
        },

        // Portfolio & Projects
        portfolio: {
          projects: [
            {
              id: 1,
              title: "EcoTrack AI",
              description: "AI-powered carbon footprint tracking platform for businesses",
              image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
              technologies: ["React", "Node.js", "Python", "AWS", "TensorFlow"],
              status: "Live",
              url: "https://ecotrack.ai",
              github: "https://github.com/alexchen/ecotrack",
              metrics: { users: "10K+", revenue: "$50K MRR", rating: 4.8 }
            },
            {
              id: 2,
              title: "StartupConnect",
              description: "Networking platform for entrepreneurs and investors",
              image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
              technologies: ["Next.js", "GraphQL", "PostgreSQL", "Redis"],
              status: "Beta",
              url: "https://startupconnect.co",
              github: "https://github.com/alexchen/startupconnect",
              metrics: { users: "5K+", matches: "500+", rating: 4.6 }
            },
            {
              id: 3,
              title: "CodeMentor",
              description: "AI-powered coding mentor and learning platform",
              image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
              technologies: ["Vue.js", "Python", "OpenAI API", "MongoDB"],
              status: "Development",
              url: null,
              github: "https://github.com/alexchen/codementor",
              metrics: { students: "2K+", courses: "50+", rating: 4.9 }
            }
          ],
          media: [
            { type: "image", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", caption: "Hiking in Yosemite" },
            { type: "image", url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop", caption: "Cooking class in Italy" },
            { type: "video", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", caption: "Product demo video" },
            { type: "image", url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop", caption: "Speaking at TechCrunch" }
          ]
        },

        // Stats & Achievements
        stats: {
          level: 8,
          xp: 2450,
          nextLevelXp: 3000,
          matches: 24,
          pitches: 15,
          events: 8,
          courses: 12,
          tokens: 150,
          streak: 45,
          totalConnections: 150,
          profileViews: 1250,
          endorsements: 89
        },

        achievements: [
          {
            id: 1,
            title: "Pitch Master",
            description: "Received 10+ positive pitch responses",
            icon: Target,
            color: "from-purple-500 to-pink-500",
            unlocked: true,
            date: "2024-01-20",
            rarity: "Rare"
          },
          {
            id: 2,
            title: "Vision Revealer",
            description: "Unlocked Vision Card layer",
            icon: Eye,
            color: "from-green-500 to-emerald-500",
            unlocked: true,
            date: "2024-01-15",
            rarity: "Common"
          },
          {
            id: 3,
            title: "Journey Walker",
            description: "Reached Journey Mode with 5+ matches",
            icon: Crown,
            color: "from-yellow-500 to-orange-500",
            unlocked: true,
            date: "2024-02-01",
            rarity: "Epic"
          },
          {
            id: 4,
            title: "Event Enthusiast",
            description: "Attended 10+ networking events",
            icon: Calendar,
            color: "from-blue-500 to-cyan-500",
            unlocked: true,
            date: "2024-02-10",
            rarity: "Common"
          },
          {
            id: 5,
            title: "Learning Champion",
            description: "Completed 20+ courses",
            icon: GraduationCap,
            color: "from-indigo-500 to-purple-500",
            unlocked: false,
            requirement: "Complete 20 courses",
            rarity: "Rare"
          },
          {
            id: 6,
            title: "Network Builder",
            description: "Connected with 100+ professionals",
            icon: Users,
            color: "from-pink-500 to-rose-500",
            unlocked: false,
            requirement: "Connect with 100+ people",
            rarity: "Epic"
          }
        ],

        // Settings
        settings: {
          privacy: {
            showProfile: true,
            showActivity: true,
            showLocation: true,
            showConnections: false,
            showStats: true,
            allowMessages: true,
            allowPitches: true
          },
          notifications: {
            matches: true,
            messages: true,
            events: true,
            courses: false,
            achievements: true,
            weekly: true
          },
          preferences: {
            theme: "light",
            language: "en",
            timezone: "PST",
            emailFrequency: "daily",
            pushNotifications: true
          }
        }
      };
      
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (updatedProfile) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfile(prev => ({ ...prev, ...updatedProfile }));
      setSuccessMessage('Profile updated successfully!');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User, count: null },
    { id: 'professional', label: 'Professional', icon: Briefcase, count: profile.professional?.workExperience?.length },
    { id: 'personal', label: 'Personal', icon: Heart, count: profile.personal?.interests?.length },
    { id: 'portfolio', label: 'Portfolio', icon: Code, count: profile.portfolio?.projects?.length },
    { id: 'achievements', label: 'Achievements', icon: Trophy, count: profile.achievements?.filter(a => a.unlocked).length },
    { id: 'settings', label: 'Settings', icon: Settings, count: null }
  ];

  const renderProfileHeader = () => (
    <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-8">
      {/* Cover Photo */}
      <div className="relative h-64 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500">
        <img
          src={profile.basic?.coverPhoto}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Cover Photo Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="p-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-2xl hover:bg-opacity-30 transition-all duration-300">
            <Camera className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-2xl hover:bg-opacity-30 transition-all duration-300">
            <Edit3 className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Photo */}
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <img
              src={profile.basic?.photo}
              alt={profile.basic?.name}
              className="w-32 h-32 rounded-3xl border-4 border-white shadow-2xl object-cover"
            />
            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
              <Camera className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Header Actions */}
        <div className="absolute bottom-4 right-4 flex gap-3">
          <button className="px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-2xl hover:bg-opacity-30 transition-all duration-300 font-semibold">
            <Share2 className="w-5 h-5 inline mr-2" />
            Share
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold">
            <Edit3 className="w-5 h-5 inline mr-2" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 px-8 pb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{profile.basic?.name}</h1>
              {profile.basic?.isVerified && (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
              {profile.basic?.isPremium && (
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                <span>{profile.basic?.position} at {profile.basic?.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{profile.basic?.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{profile.basic?.lastActive}</span>
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-6 max-w-3xl">
              {profile.basic?.bio}
            </p>

            {/* Quick Stats */}
            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{profile.stats?.matches}</div>
                <div className="text-sm text-gray-600">Matches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{profile.stats?.level}</div>
                <div className="text-sm text-gray-600">Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{profile.stats?.totalConnections}</div>
                <div className="text-sm text-gray-600">Connections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{profile.stats?.profileViews}</div>
                <div className="text-sm text-gray-600">Profile Views</div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {profile.basic?.values?.slice(0, 5).map((value, index) => (
                <span key={index} className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm rounded-full font-medium">
                  {value}
                </span>
              ))}
              {profile.basic?.values?.length > 5 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full font-medium">
                  +{profile.basic?.values?.length - 5} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {renderProfileHeader()}
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Start Conversation</h3>
              <p className="text-gray-600 text-sm">Connect with matches</p>
            </div>
          </div>
          <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-semibold">
            View Messages
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Upcoming Events</h3>
              <p className="text-gray-600 text-sm">3 events this week</p>
            </div>
          </div>
          <button className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold">
            View Events
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Send Pitch</h3>
              <p className="text-gray-600 text-sm">Connect with new people</p>
            </div>
          </div>
          <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold">
            Create Pitch
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: "Connected with Sarah Chen", time: "2 hours ago", type: "match" },
            { action: "Attended Pitch Night SF", time: "1 day ago", type: "event" },
            { action: "Completed 'AI for Entrepreneurs' course", time: "3 days ago", type: "course" },
            { action: "Updated portfolio with new project", time: "1 week ago", type: "portfolio" }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                activity.type === 'match' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                activity.type === 'event' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                activity.type === 'course' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                'bg-gradient-to-r from-orange-500 to-red-500'
              }`}>
                {activity.type === 'match' ? <Heart className="w-5 h-5 text-white" /> :
                 activity.type === 'event' ? <Calendar className="w-5 h-5 text-white" /> :
                 activity.type === 'course' ? <GraduationCap className="w-5 h-5 text-white" /> :
                 <Code className="w-5 h-5 text-white" />}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfessionalTab = () => (
    <div className="space-y-8">
      {/* Work Experience */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300">
            <Plus className="w-5 h-5 inline mr-2" />
            Add Experience
          </button>
        </div>
        <div className="space-y-6">
          {profile.professional?.workExperience?.map((job) => (
            <div key={job.id} className="p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
              <div className="flex items-start gap-4">
                <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{job.position}</h3>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-lg font-semibold text-blue-600 mb-1">{job.company}</p>
                  <p className="text-gray-600 mb-2">{job.duration} • {job.location}</p>
                  <p className="text-gray-700 mb-4">{job.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {job.achievements.map((achievement, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Education</h2>
          <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
            <Plus className="w-5 h-5 inline mr-2" />
            Add Education
          </button>
        </div>
        <div className="space-y-6">
          {profile.professional?.education?.map((edu) => (
            <div key={edu.id} className="p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
              <div className="flex items-start gap-4">
                <img src={edu.logo} alt={edu.school} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{edu.degree}</h3>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-lg font-semibold text-green-600 mb-1">{edu.school}</p>
                  <p className="text-gray-600 mb-2">{edu.year} • GPA: {edu.gpa}</p>
                  <div className="flex flex-wrap gap-2">
                    {edu.activities.map((activity, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills & Expertise</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Technical Skills</h3>
            <div className="space-y-3">
              {profile.professional?.skills?.technical?.map((skill, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{skill.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{skill.level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Soft Skills</h3>
            <div className="space-y-3">
              {profile.professional?.skills?.soft?.map((skill, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{skill.level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonalTab = () => (
    <div className="space-y-8">
      {/* Personality & Values */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Personality & Values</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Personality Type</h3>
            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{profile.personal?.personality?.type}</h4>
                  <p className="text-gray-600">The Commander</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{profile.personal?.personality?.communication}</p>
              <div className="flex flex-wrap gap-2">
                {profile.personal?.personality?.traits?.map((trait, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Core Values</h3>
            <div className="space-y-3">
              {profile.personal?.personality?.values?.map((value, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-900">{value}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full"
                      style={{ width: `${85 + (index * 3)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interests & Hobbies */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Interests & Hobbies</h2>
          <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
            <Plus className="w-5 h-5 inline mr-2" />
            Add Interest
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.personal?.interests?.map((interest, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{interest.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{interest.name}</h3>
                  <p className="text-sm text-gray-600">{interest.level}</p>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lifestyle */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Lifestyle</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-900 mb-2">Work Schedule</h3>
            <p className="text-gray-600">{profile.personal?.lifestyle?.workSchedule}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-900 mb-2">Travel Frequency</h3>
            <p className="text-gray-600">{profile.personal?.lifestyle?.travelFrequency}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-900 mb-2">Social Activity</h3>
            <p className="text-gray-600">{profile.personal?.lifestyle?.socialActivity}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-900 mb-2">Fitness Level</h3>
            <p className="text-gray-600">{profile.personal?.lifestyle?.fitnessLevel}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-900 mb-2">Diet</h3>
            <p className="text-gray-600">{profile.personal?.lifestyle?.diet}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-900 mb-2">Hobbies</h3>
            <div className="flex flex-wrap gap-1">
              {profile.personal?.lifestyle?.hobbies?.map((hobby, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Social Links</h2>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300">
            <Plus className="w-5 h-5 inline mr-2" />
            Add Link
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(profile.personal?.socialLinks || {}).map(([platform, url]) => {
            const icons = {
              linkedin: Linkedin,
              twitter: Twitter,
              github: Github,
              instagram: Instagram,
              website: Globe
            };
            const Icon = icons[platform];
            const colors = {
              linkedin: "from-blue-600 to-blue-700",
              twitter: "from-blue-400 to-blue-500",
              github: "from-gray-600 to-gray-700",
              instagram: "from-pink-500 to-purple-500",
              website: "from-green-500 to-emerald-500"
            };
            
            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-4 p-4 bg-gradient-to-r ${colors[platform]} text-white rounded-2xl hover:shadow-lg transition-all duration-300`}
              >
                <Icon className="w-6 h-6" />
                <div className="flex-1">
                  <h3 className="font-semibold capitalize">{platform}</h3>
                  <p className="text-sm opacity-90">{url}</p>
                </div>
                <ExternalLink className="w-5 h-5" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderPortfolioTab = () => (
    <div className="space-y-8">
      {/* Projects */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Projects & Portfolio</h2>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
            <Plus className="w-5 h-5 inline mr-2" />
            Add Project
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {profile.portfolio?.projects?.map((project) => (
            <div key={project.id} className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    project.status === 'Live' ? 'bg-green-100 text-green-700' :
                    project.status === 'Beta' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{project.metrics.users}</div>
                    <div className="text-sm text-gray-600">Users</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{project.metrics.revenue}</div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{project.metrics.rating}</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 text-center font-semibold"
                    >
                      <ExternalLink className="w-4 h-4 inline mr-2" />
                      View Live
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Media Gallery */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Media Gallery</h2>
          <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
            <Plus className="w-5 h-5 inline mr-2" />
            Add Media
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.portfolio?.media?.map((item, index) => (
            <div key={index} className="relative group cursor-pointer" onClick={() => setSelectedMedia(item)}>
              <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <Play className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-2xl flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.type === 'image' ? (
                    <ImageIcon className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600 truncate">{item.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{profile.stats?.level}</div>
            <div className="text-gray-600">Level</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{profile.stats?.xp}</div>
            <div className="text-gray-600">XP</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{profile.stats?.matches}</div>
            <div className="text-gray-600">Matches</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{profile.stats?.pitches}</div>
            <div className="text-gray-600">Pitches</div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Next Level Progress</h3>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Level {profile.stats?.level}</span>
            <span>{profile.stats?.xp}/{profile.stats?.nextLevelXp} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(profile.stats?.xp / profile.stats?.nextLevelXp) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.achievements?.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div key={achievement.id} className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                achievement.unlocked 
                  ? `bg-gradient-to-r ${achievement.color} bg-opacity-10 border-current` 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                  achievement.unlocked 
                    ? `bg-gradient-to-r ${achievement.color}` 
                    : 'bg-gray-200'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    achievement.unlocked ? 'text-white' : 'text-gray-400'
                  }`} />
                </div>
                <h3 className={`font-bold mb-2 ${
                  achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </h3>
                <p className={`text-sm mb-3 ${
                  achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {achievement.description}
                </p>
                {achievement.unlocked ? (
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-green-600 font-medium">
                      Unlocked {achievement.date}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      achievement.rarity === 'Epic' ? 'bg-purple-100 text-purple-700' :
                      achievement.rarity === 'Rare' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {achievement.rarity}
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">
                    {achievement.requirement}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-8">
      {/* Privacy Settings */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div>
              <h3 className="font-semibold text-gray-900">Show Profile to Others</h3>
              <p className="text-sm text-gray-600">Allow other users to see your profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div>
              <h3 className="font-semibold text-gray-900">Show Activity Status</h3>
              <p className="text-sm text-gray-600">Display when you were last active</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div>
              <h3 className="font-semibold text-gray-900">Show Location</h3>
              <p className="text-sm text-gray-600">Display your city and country</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div>
              <h3 className="font-semibold text-gray-900">Allow Messages</h3>
              <p className="text-sm text-gray-600">Let others send you direct messages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">New Matches</h3>
                <p className="text-sm text-gray-600">Get notified when someone matches with you</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Messages</h3>
                <p className="text-sm text-gray-600">Get notified about new messages</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Events</h3>
                <p className="text-sm text-gray-600">Get notified about upcoming events</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Achievements</h3>
                <p className="text-sm text-gray-600">Get notified when you unlock achievements</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-900 mb-2">Email Address</h3>
            <p className="text-gray-600 mb-3">alex.chen@techflow.com</p>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300">
              Change Email
            </button>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-900 mb-2">Password</h3>
            <p className="text-gray-600 mb-3">Last changed 3 months ago</p>
            <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
              Change Password
            </button>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-900 mb-2">Two-Factor Authentication</h3>
            <p className="text-gray-600 mb-3">Add an extra layer of security to your account</p>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-red-200">
        <h2 className="text-2xl font-bold text-red-600 mb-6">Danger Zone</h2>
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-2xl">
            <h3 className="font-semibold text-red-900 mb-2">Delete Account</h3>
            <p className="text-red-700 mb-3">Permanently delete your account and all data. This action cannot be undone.</p>
            <button className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'professional':
        return renderProfessionalTab();
      case 'personal':
        return renderPersonalTab();
      case 'portfolio':
        return renderPortfolioTab();
      case 'achievements':
        return renderAchievementsTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return renderOverviewTab();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-slide-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
            <div className="flex space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                    {tab.count && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isActive ? 'bg-white bg-opacity-20' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
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
    </div>
  );
};

export default ProfileRedesign;