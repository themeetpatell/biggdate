import React, { useState, useEffect } from 'react';
import { 
  User, Camera, Edit3, Briefcase, MapPin, Clock, Star, Award, 
  Code, TrendingUp, Target, Users, Calendar, MessageCircle,
  ExternalLink, Plus, CheckCircle, X, Zap, Trophy, Rocket,
  BarChart3, Activity, Compass, Shield, Badge, Gift, Video, 
  FileText, Download, Play, Pause, Volume2, ThumbsUp, MessageSquare, 
  Send, Bookmark, Flag, MoreHorizontal, Search, Filter, SortAsc, 
  SortDesc, RefreshCw, Bell, BellOff, Eye, EyeOff, ChevronUp, 
  ChevronLeft, ChevronRight, ChevronDown, ArrowRight, ArrowLeft, 
  ArrowUp, ArrowDown, Maximize2, Minimize2, RotateCcw, RotateCw, 
  ZoomIn, ZoomOut, Move, Copy, Scissors, Trash2, Save, Upload, 
  Link, Link2, Unlink, Lock, Key, KeyRound, ShieldCheck, ShieldAlert, 
  AlertCircle, Info, HelpCircle, CheckCircle2, XCircle, PlusCircle, 
  MinusCircle, AlertTriangle, AlertOctagon, Building2, DollarSign, 
  Globe, Phone, Mail, Instagram, Twitter, Linkedin, Github, Coffee, 
  Plane, Gamepad2, BookOpen, GraduationCap
} from 'lucide-react';

const EntrepreneurProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [profile, setProfile] = useState({
    basic: {},
    professional: {},
    startup: {},
    personal: {},
    portfolio: {},
    stats: {},
    achievements: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const profileData = {
        basic: {
          name: "Alex Chen",
          role: "Technical Co-founder",
          bio: "Full-stack developer with 8 years experience building scalable web applications. Passionate about AI and fintech. Looking for a business co-founder to build the next unicorn startup.",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
          coverPhoto: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=400&fit=crop",
          location: "San Francisco, CA",
          experience: "8 years",
          isVerified: true,
          isPremium: true,
          joinDate: "2024-01-15",
          lastActive: "2 hours ago"
        },
        professional: {
          skills: {
            technical: [
              { name: "React", level: 95, category: "Frontend" },
              { name: "Node.js", level: 90, category: "Backend" },
              { name: "Python", level: 88, category: "Programming" },
              { name: "AWS", level: 85, category: "Cloud" },
              { name: "Machine Learning", level: 80, category: "AI/ML" },
              { name: "Docker", level: 75, category: "DevOps" }
            ],
            business: [
              { name: "Product Strategy", level: 85 },
              { name: "Team Leadership", level: 90 },
              { name: "Fundraising", level: 70 },
              { name: "Market Analysis", level: 75 },
              { name: "Operations", level: 80 }
            ]
          },
          workExperience: [
            {
              id: 1,
              company: "TechFlow Solutions",
              position: "Founder & CTO",
              duration: "2022 - Present",
              description: "Leading technical development of AI-powered business solutions. Raised $2.5M Series A.",
              achievements: ["Raised $2.5M Series A", "Built team of 15", "1000+ customers"]
            },
            {
              id: 2,
              company: "Google",
              position: "Senior Software Engineer",
              duration: "2019 - 2022",
              description: "Developed scalable backend systems for Google Cloud Platform.",
              achievements: ["Promoted to Senior", "Led team of 5", "2 patents filed"]
            }
          ],
          education: [
            {
              school: "Stanford University",
              degree: "Master of Science in Computer Science",
              year: "2017"
            }
          ]
        },
        startup: {
          currentStage: "Series A",
          lookingFor: ["Business Co-founder", "Marketing Expert", "Designer"],
          industries: ["Fintech", "AI/ML", "SaaS"],
          previousStartups: ["TechCorp (Acquired)", "DataFlow (Series A)"],
          investmentRaised: "$2.5M",
          teamSize: "15",
          revenue: "$50K MRR"
        },
        personal: {
          interests: [
            { name: "Hiking", icon: "🏔️", level: "Expert" },
            { name: "Cooking", icon: "👨‍🍳", level: "Advanced" },
            { name: "Photography", icon: "📸", level: "Intermediate" },
            { name: "Tennis", icon: "🎾", level: "Advanced" }
          ],
          personality: {
            type: "ENTJ",
            traits: ["Analytical", "Ambitious", "Confident", "Strategic"],
            values: ["Innovation", "Excellence", "Growth", "Impact"]
          }
        },
        portfolio: {},
        stats: {
          level: 8,
          xp: 2450,
          nextLevelXp: 3000,
          cofounderMatches: 24,
          pitches: 15,
          events: 8,
          totalConnections: 150,
          profileViews: 1250
        },
        achievements: [
          {
            id: 1,
            title: "Top 1% Cofounder",
            description: "Recognized as one of the top cofounders on the platform",
            date: "2024-01-15",
            type: "platform",
            icon: "🏆"
          },
          {
            id: 2,
            title: "Series A Success",
            description: "Successfully raised $2.5M Series A funding for TechFlow Solutions",
            date: "2023-11-20",
            type: "funding",
            icon: "💰"
          },
          {
            id: 3,
            title: "Product Launch",
            description: "Launched EcoTrack AI with 10K+ active users",
            date: "2023-08-10",
            type: "product",
            icon: "🚀"
          },
          {
            id: 4,
            title: "Team Building",
            description: "Built and led a team of 15+ engineers",
            date: "2023-06-15",
            type: "leadership",
            icon: "👥"
          },
          {
            id: 5,
            title: "Patent Filed",
            description: "Filed 2 patents for innovative AI algorithms",
            date: "2023-03-22",
            type: "innovation",
            icon: "💡"
          }
        ],
        projects: [
          {
            id: 1,
            title: "EcoTrack AI",
            description: "AI-powered carbon footprint tracking platform for businesses. Empowering companies to monitor, analyze, and reduce their environmental impact through intelligent data analytics.",
            image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
            technologies: ["React", "Node.js", "Python", "AWS", "Machine Learning", "PostgreSQL"],
            status: "Live",
            url: "https://ecotrack-ai.com",
            github: "https://github.com/alexchen/ecotrack-ai",
            metrics: { 
              users: "10K+", 
              revenue: "$50K MRR", 
              rating: 4.8,
              downloads: "25K+"
            },
            features: [
              "Real-time carbon footprint tracking",
              "AI-powered sustainability insights",
              "Automated ESG reporting",
              "Team collaboration tools",
              "Custom analytics dashboard"
            ]
          },
          {
            id: 2,
            title: "HealthConnect",
            description: "Telemedicine platform connecting patients with specialists worldwide. Revolutionizing healthcare access through secure video consultations and integrated medical records.",
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
            technologies: ["React Native", "Node.js", "MongoDB", "WebRTC", "Socket.io"],
            status: "Beta",
            url: "https://healthconnect.app",
            github: "https://github.com/alexchen/healthconnect",
            metrics: { 
              users: "5K+", 
              revenue: "$25K MRR", 
              rating: 4.6,
              downloads: "12K+"
            },
            features: [
              "HD video consultations",
              "Smart appointment scheduling",
              "Secure medical records",
              "E-prescription management",
              "Multi-language support"
            ]
          },
          {
            id: 3,
            title: "EduFlow",
            description: "Personalized learning platform for K-12 education. Using adaptive algorithms to create customized learning paths that match each student's pace and style.",
            image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
            technologies: ["Vue.js", "Laravel", "MySQL", "Redis", "TensorFlow"],
            status: "Development",
            url: null,
            github: "https://github.com/alexchen/eduflow",
            metrics: { 
              users: "2K+", 
              revenue: "$10K MRR", 
              rating: 4.4,
              downloads: "8K+"
            },
            features: [
              "Adaptive learning paths",
              "Real-time progress tracking",
              "Parent dashboard & reports",
              "Teacher collaboration tools",
              "Gamification elements"
            ]
          }
        ],
        certifications: [
          {
            name: "AWS Solutions Architect Professional",
            issuer: "Amazon Web Services",
            date: "2023-09-15",
            credentialId: "AWS-SAA-123456"
          },
          {
            name: "Google Cloud Professional Architect",
            issuer: "Google Cloud",
            date: "2023-05-20",
            credentialId: "GCP-PRO-789012"
          },
          {
            name: "Certified Scrum Master (CSM)",
            issuer: "Scrum Alliance",
            date: "2023-02-10",
            credentialId: "CSM-345678"
          }
        ]
      }
      
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'startup', label: 'Startup', icon: Rocket },
    { id: 'portfolio', label: 'Portfolio', icon: Code },
    { id: 'achievements', label: 'Achievements', icon: Trophy }
  ];

  const renderProfileHeader = () => (
    <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-8">
      <div className="relative h-64 bg-gray-900">
        <img
          src={profile.basic?.coverPhoto}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="p-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-2xl hover:bg-opacity-30 transition-all duration-300">
            <Camera className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-2xl hover:bg-opacity-30 transition-all duration-300">
            <Edit3 className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <img
              src={profile.basic?.avatar}
              alt={profile.basic?.name}
              className="w-32 h-32 rounded-3xl border-4 border-white shadow-2xl object-cover"
            />
            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
              <Camera className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 flex gap-3">
          <button className="px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-2xl hover:bg-opacity-30 transition-all duration-300 font-semibold">
            <MessageCircle className="w-5 h-5 inline mr-2" />
            Connect
          </button>
          <button className="px-6 py-3 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all duration-300 font-semibold">
            <Edit3 className="w-5 h-5 inline mr-2" />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="pt-20 px-8 pb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{profile.basic?.name}</h1>
              {profile.basic?.isVerified && (
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
              {profile.basic?.isPremium && (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                <span>{profile.basic?.role}</span>
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

            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{profile.stats?.cofounderMatches}</div>
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
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {renderProfileHeader()}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Find Cofounders</h3>
              <p className="text-gray-600 text-sm">Connect with potential partners</p>
            </div>
          </div>
          <button className="w-full px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold">
            Browse Cofounders
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-600 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Startup Events</h3>
              <p className="text-gray-600 text-sm">3 events this week</p>
            </div>
          </div>
          <button className="w-full px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 font-semibold">
            View Events
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-700 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Create Pitch</h3>
              <p className="text-gray-600 text-sm">Share your startup idea</p>
            </div>
          </div>
          <button className="w-full px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold">
            Create Pitch
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfessionalTab = () => (
    <div className="space-y-8">
      {/* Experience Section */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience</h2>
        <div className="space-y-6">
          {profile.professional?.workExperience?.map((exp, index) => (
            <div key={index} className="border-l-4 border-black pl-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                  <p className="text-gray-600 font-medium">{exp.company}</p>
                </div>
                <span className="text-sm text-gray-500">{exp.duration}</span>
              </div>
              <p className="text-gray-700 mb-3">{exp.description}</p>
              <div className="flex flex-wrap gap-2">
                {exp.achievements?.map((achievement, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {achievement}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
        <div className="space-y-4">
          {profile.professional?.education?.map((edu, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-600 font-medium">{edu.school}</p>
                <p className="text-sm text-gray-500">{edu.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-black h-2 rounded-full transition-all duration-300"
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
            <h3 className="text-lg font-bold text-gray-900 mb-4">Business Skills</h3>
            <div className="space-y-3">
              {profile.professional?.skills?.business?.map((skill, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gray-600 h-2 rounded-full transition-all duration-300"
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
            <h3 className="text-lg font-bold text-gray-900 mb-4">Other Skills</h3>
            <div className="space-y-3">
              {profile.personal?.interests?.map((interest, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{interest.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{interest.name}</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{interest.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStartupTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Startup Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-900 mb-2">Current Stage</h3>
            <p className="text-gray-600">{profile.startup?.currentStage}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-900 mb-2">Investment Raised</h3>
            <p className="text-gray-600">{profile.startup?.investmentRaised}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-900 mb-2">Team Size</h3>
            <p className="text-gray-600">{profile.startup?.teamSize} people</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-900 mb-2">Revenue</h3>
            <p className="text-gray-600">{profile.startup?.revenue}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-900 mb-2">Looking For</h3>
            <div className="flex flex-wrap gap-1">
              {profile.startup?.lookingFor?.map((role, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {role}
                </span>
              ))}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-900 mb-2">Industries</h3>
            <div className="flex flex-wrap gap-1">
              {profile.startup?.industries?.map((industry, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements & Recognition</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.achievements?.map((achievement) => (
            <div key={achievement.id} className="p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{achievement.title}</h3>
                  <p className="text-gray-600 mb-3">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(achievement.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="px-3 py-1 bg-black text-white text-xs font-semibold rounded-full">
                      {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Achievement Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{profile.achievements?.length || 0}</div>
            <div className="text-sm text-gray-600">Total Achievements</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">5</div>
            <div className="text-sm text-gray-600">This Year</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">2</div>
            <div className="text-sm text-gray-600">Funding Rounds</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">3</div>
            <div className="text-sm text-gray-600">Product Launches</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPortfolioTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Portfolio</h2>
          <button className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {profile.projects?.map((project) => (
            <div key={project.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-80 lg:h-full">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <span className={`px-4 py-2 text-sm font-bold rounded-xl backdrop-blur-sm ${
                      project.status === 'Live' ? 'bg-green-500/90 text-white' :
                      project.status === 'Beta' ? 'bg-blue-500/90 text-white' :
                      'bg-gray-500/90 text-white'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-gray-900">{project.metrics.users}</div>
                        <div className="text-xs text-gray-600">Users</div>
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-gray-900">{project.metrics.revenue}</div>
                        <div className="text-xs text-gray-600">Revenue</div>
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-gray-900">{project.metrics.rating}</div>
                        <div className="text-xs text-gray-600">Rating</div>
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-gray-900">{project.metrics.downloads}</div>
                        <div className="text-xs text-gray-600">Downloads</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {project.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-900 text-white text-xs font-semibold rounded-lg">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 text-sm font-bold text-center flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Live
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-all duration-300 text-sm font-bold flex items-center justify-center gap-2"
                      >
                        <Github className="w-4 h-4" />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6" />
            Certifications
          </h2>
          <div className="space-y-4">
            {profile.certifications?.map((cert, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{cert.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{cert.issuer}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                      <span className="font-mono bg-gray-200 px-2 py-1 rounded">ID: {cert.credentialId}</span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Awards & Recognition
          </h2>
          <div className="space-y-4">
            {[
              {
                title: "Startup of the Year 2023",
                organization: "TechCrunch Disrupt",
                date: "2023-11-15",
                description: "Winner of Startup Battlefield"
              },
              {
                title: "Best AI Innovation",
                organization: "AI Summit",
                date: "2023-09-20",
                description: "Recognized for groundbreaking ML algorithms"
              },
              {
                title: "Top 10 Entrepreneurs Under 30",
                organization: "Forbes",
                date: "2023-06-10",
                description: "Featured in Forbes 30 Under 30"
              }
            ].map((award, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🏆</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{award.title}</h3>
                    <p className="text-gray-700 text-sm mb-1">{award.organization}</p>
                    <p className="text-gray-600 text-xs mb-2">{award.description}</p>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(award.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Publications & Articles
          </h2>
          <div className="space-y-4">
            {[
              {
                title: "The Future of AI in Startup Ecosystems",
                publication: "Medium",
                date: "2024-01-15",
                views: "12.5K",
                url: "#"
              },
              {
                title: "Building Scalable SaaS Products",
                publication: "Dev.to",
                date: "2023-12-10",
                views: "8.2K",
                url: "#"
              },
              {
                title: "From Zero to Series A: A Founder's Journey",
                publication: "TechCrunch",
                date: "2023-11-05",
                views: "25K",
                url: "#"
              }
            ].map((article, index) => (
              <a key={index} href={article.url} className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{article.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-semibold">{article.publication}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {article.views} views
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Video className="w-6 h-6" />
            Speaking & Events
          </h2>
          <div className="space-y-4">
            {[
              {
                title: "Keynote: AI-Powered Startups",
                event: "TechCrunch Disrupt 2023",
                date: "2023-11-15",
                attendees: "5K+",
                type: "Keynote"
              },
              {
                title: "Panel: Fundraising Strategies",
                event: "Startup Grind Global",
                date: "2023-09-22",
                attendees: "2K+",
                type: "Panel"
              },
              {
                title: "Workshop: Building MVP in 30 Days",
                event: "Y Combinator Startup School",
                date: "2023-08-10",
                attendees: "500+",
                type: "Workshop"
              }
            ].map((speaking, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{speaking.title}</h3>
                      <span className="px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded-lg">
                        {speaking.type}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-1">{speaking.event}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(speaking.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {speaking.attendees} attendees
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          Testimonials & Reviews
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: "Sarah Johnson",
              role: "CEO, TechVentures",
              avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
              rating: 5,
              text: "Alex is an exceptional technical co-founder. His ability to translate complex technical concepts into actionable business strategies is unmatched.",
              date: "2024-01-20"
            },
            {
              name: "Michael Zhang",
              role: "Investor, Sequoia Capital",
              avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
              rating: 5,
              text: "Working with Alex has been a game-changer. His technical expertise and leadership skills make him a valuable asset to any startup.",
              date: "2023-12-15"
            },
            {
              name: "Emily Rodriguez",
              role: "Product Manager, Google",
              avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
              rating: 5,
              text: "Alex's dedication to quality and innovation is inspiring. He consistently delivers exceptional results and pushes the boundaries of what's possible.",
              date: "2023-11-10"
            },
            {
              name: "David Park",
              role: "CTO, StartupHub",
              avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
              rating: 5,
              text: "One of the best engineers I've worked with. Alex combines technical brilliance with strong business acumen.",
              date: "2023-10-05"
            }
          ].map((testimonial, index) => (
            <div key={index} className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-3">"{testimonial.text}"</p>
              <p className="text-xs text-gray-500">{new Date(testimonial.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-lg text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">3</div>
            <div className="text-gray-300 text-sm">Projects Live</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">17K+</div>
            <div className="text-gray-300 text-sm">Total Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">$85K</div>
            <div className="text-gray-300 text-sm">Monthly Revenue</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">4.7</div>
            <div className="text-gray-300 text-sm">Avg Rating</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (!profile || Object.keys(profile).length === 0) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile data...</p>
        </div>
      );
    }
    
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'professional':
        return renderProfessionalTab();
      case 'startup':
        return renderStartupTab();
      case 'portfolio':
        return renderPortfolioTab();
      case 'achievements':
        return renderAchievementsTab();
      default:
        return renderOverviewTab();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
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
                        ? 'bg-black text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurProfile;
