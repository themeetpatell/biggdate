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
        portfolio: {
          projects: [
            {
              id: 1,
              title: "EcoTrack AI",
              description: "AI-powered carbon footprint tracking platform for businesses",
              technologies: ["React", "Node.js", "Python", "AWS"],
              status: "Live",
              metrics: { users: "10K+", revenue: "$50K MRR", rating: 4.8 }
            }
          ]
        },
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
              description: "AI-powered carbon footprint tracking platform for businesses",
              image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
              technologies: ["React", "Node.js", "Python", "AWS", "Machine Learning"],
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
                "Real-time carbon tracking",
                "AI-powered insights",
                "Sustainability reporting",
                "Team collaboration tools"
              ]
            },
            {
              id: 2,
              title: "HealthConnect",
              description: "Telemedicine platform connecting patients with specialists",
              image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
              technologies: ["React Native", "Node.js", "MongoDB", "WebRTC"],
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
                "Video consultations",
                "Appointment scheduling",
                "Medical records",
                "Prescription management"
              ]
            },
            {
              id: 3,
              title: "EduFlow",
              description: "Personalized learning platform for K-12 education",
              image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
              technologies: ["Vue.js", "Laravel", "MySQL", "Redis"],
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
                "Progress tracking",
                "Parent dashboard",
                "Teacher tools"
              ]
            }
          ],
          certifications: [
            {
              name: "AWS Solutions Architect",
              issuer: "Amazon Web Services",
              date: "2023-09-15",
              credentialId: "AWS-SAA-123456"
            },
            {
              name: "Google Cloud Professional",
              issuer: "Google Cloud",
              date: "2023-05-20",
              credentialId: "GCP-PRO-789012"
            },
            {
              name: "Certified Scrum Master",
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
      {/* Projects Section */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects & Work</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {profile.portfolio?.projects?.map((project) => (
            <div key={project.id} className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    project.status === 'Live' ? 'bg-black text-white' :
                    project.status === 'Beta' ? 'bg-gray-600 text-white' :
                    'bg-gray-400 text-white'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{project.metrics.users}</div>
                    <div className="text-xs text-gray-600">Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{project.metrics.revenue}</div>
                    <div className="text-xs text-gray-600">Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{project.metrics.rating}</div>
                    <div className="text-xs text-gray-600">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{project.metrics.downloads}</div>
                    <div className="text-xs text-gray-600">Downloads</div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Features:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-black" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-semibold text-center"
                    >
                      <ExternalLink className="w-4 h-4 inline mr-2" />
                      Live Demo
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-semibold"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.portfolio?.certifications?.map((cert, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{cert.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{cert.issuer}</p>
                  <p className="text-xs text-gray-500 mb-2">Issued: {new Date(cert.date).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-400">ID: {cert.credentialId}</p>
                </div>
              </div>
            </div>
          ))}
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
