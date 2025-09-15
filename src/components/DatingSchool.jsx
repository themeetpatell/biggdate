import React, { useState } from 'react';
import { 
  BookOpen, 
  Play, 
  Star, 
  Users, 
  Heart, 
  MessageCircle, 
  Calendar, 
  Award, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Brain,
  Sparkles,
  Target,
  Zap,
  Crown,
  Trophy,
  TrendingUp
} from 'lucide-react';

const DatingSchool = () => {
  const [activeCategory, setActiveCategory] = useState('basics');
  const [completedLessons, setCompletedLessons] = useState(new Set(['profile-optimization', 'first-message']));

  const categories = [
    { id: 'basics', label: 'Dating Basics', icon: BookOpen },
    { id: 'profile', label: 'Profile Optimization', icon: Target },
    { id: 'conversation', label: 'Conversation Skills', icon: MessageCircle },
    { id: 'meeting', label: 'First Meetings', icon: Calendar },
    { id: 'advanced', label: 'Advanced Tips', icon: Crown }
  ];

  const lessons = {
    basics: [
      {
        id: 'dating-101',
        title: 'Dating 101: The Fundamentals',
        description: 'Learn the essential principles of modern dating',
        duration: '15 min',
        difficulty: 'Beginner',
        rating: 4.8,
        students: 1250,
        completed: false,
        video: true,
        quiz: true
      },
      {
        id: 'red-flags',
        title: 'Recognizing Red Flags',
        description: 'Identify warning signs early in relationships',
        duration: '12 min',
        difficulty: 'Beginner',
        rating: 4.9,
        students: 980,
        completed: false,
        video: true,
        quiz: true
      },
      {
        id: 'green-flags',
        title: 'Spotting Green Flags',
        description: 'Recognize positive traits in potential partners',
        duration: '10 min',
        difficulty: 'Beginner',
        rating: 4.7,
        students: 1100,
        completed: false,
        video: true,
        quiz: false
      }
    ],
    profile: [
      {
        id: 'profile-optimization',
        title: 'Profile Optimization Masterclass',
        description: 'Create a profile that attracts the right matches',
        duration: '20 min',
        difficulty: 'Intermediate',
        rating: 4.9,
        students: 2100,
        completed: true,
        video: true,
        quiz: true
      },
      {
        id: 'photo-selection',
        title: 'Perfect Profile Photos',
        description: 'Choose photos that showcase your best self',
        duration: '18 min',
        difficulty: 'Intermediate',
        rating: 4.8,
        students: 1850,
        completed: false,
        video: true,
        quiz: true
      },
      {
        id: 'bio-writing',
        title: 'Writing a Compelling Bio',
        description: 'Craft a bio that tells your story effectively',
        duration: '14 min',
        difficulty: 'Intermediate',
        rating: 4.6,
        students: 1650,
        completed: false,
        video: true,
        quiz: false
      }
    ],
    conversation: [
      {
        id: 'first-message',
        title: 'First Message Strategies',
        description: 'Start conversations that get responses',
        duration: '16 min',
        difficulty: 'Intermediate',
        rating: 4.8,
        students: 1950,
        completed: true,
        video: true,
        quiz: true
      },
      {
        id: 'conversation-flow',
        title: 'Keeping Conversations Flowing',
        description: 'Maintain engaging conversations naturally',
        duration: '22 min',
        difficulty: 'Intermediate',
        rating: 4.7,
        students: 1750,
        completed: false,
        video: true,
        quiz: true
      },
      {
        id: 'deep-connections',
        title: 'Building Deep Connections',
        description: 'Create meaningful emotional connections',
        duration: '25 min',
        difficulty: 'Advanced',
        rating: 4.9,
        students: 1400,
        completed: false,
        video: true,
        quiz: true
      }
    ],
    meeting: [
      {
        id: 'first-date-planning',
        title: 'Planning the Perfect First Date',
        description: 'Choose activities that create connection',
        duration: '18 min',
        difficulty: 'Intermediate',
        rating: 4.8,
        students: 1800,
        completed: false,
        video: true,
        quiz: true
      },
      {
        id: 'date-etiquette',
        title: 'First Date Etiquette',
        description: 'Navigate first dates with confidence',
        duration: '15 min',
        difficulty: 'Beginner',
        rating: 4.7,
        students: 1600,
        completed: false,
        video: true,
        quiz: false
      },
      {
        id: 'follow-up',
        title: 'Post-Date Follow-up',
        description: 'Handle post-date communication effectively',
        duration: '12 min',
        difficulty: 'Intermediate',
        rating: 4.6,
        students: 1450,
        completed: false,
        video: true,
        quiz: true
      }
    ],
    advanced: [
      {
        id: 'relationship-building',
        title: 'Building Long-term Relationships',
        description: 'Transition from dating to committed relationships',
        duration: '30 min',
        difficulty: 'Advanced',
        rating: 4.9,
        students: 1200,
        completed: false,
        video: true,
        quiz: true
      },
      {
        id: 'conflict-resolution',
        title: 'Conflict Resolution in Relationships',
        description: 'Navigate disagreements constructively',
        duration: '25 min',
        difficulty: 'Advanced',
        rating: 4.8,
        students: 1100,
        completed: false,
        video: true,
        quiz: true
      },
      {
        id: 'intimacy-building',
        title: 'Building Intimacy and Trust',
        description: 'Create deeper emotional and physical connections',
        duration: '28 min',
        difficulty: 'Advanced',
        rating: 4.7,
        students: 950,
        completed: false,
        video: true,
        quiz: true
      }
    ]
  };

  const stats = {
    totalLessons: 15,
    completedLessons: completedLessons.size,
    totalStudents: 25000,
    averageRating: 4.8,
    totalHours: 5.2
  };

  const handleLessonClick = (lessonId) => {
    // Handle lesson navigation
    console.log('Navigate to lesson:', lessonId);
  };

  const handleCompleteLesson = (lessonId) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="main-content">
      <div className="container">
        <div className="section">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dating School</h1>
                <p className="text-gray-600">Master the art of dating with expert guidance</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.completedLessons}/{stats.totalLessons}</div>
                <div className="text-sm text-gray-600">Lessons Completed</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalHours}h</div>
                <div className="text-sm text-gray-600">Total Learning</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.averageRating}</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.totalStudents.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="card p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <nav className="space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const lessonCount = lessons[category.id]?.length || 0;
                    const completedCount = lessons[category.id]?.filter(lesson => completedLessons.has(lesson.id)).length || 0;
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                          activeCategory === category.id
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{category.label}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {completedCount}/{lessonCount}
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {categories.find(c => c.id === activeCategory)?.label}
                </h2>
                <p className="text-gray-600">
                  {activeCategory === 'basics' && 'Learn the fundamentals of modern dating'}
                  {activeCategory === 'profile' && 'Optimize your profile to attract better matches'}
                  {activeCategory === 'conversation' && 'Master the art of conversation'}
                  {activeCategory === 'meeting' && 'Navigate first meetings with confidence'}
                  {activeCategory === 'advanced' && 'Advanced strategies for serious relationships'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lessons[activeCategory]?.map((lesson) => (
                  <div key={lesson.id} className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{lesson.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {lesson.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {lesson.students.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {lesson.rating}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                            {lesson.difficulty}
                          </span>
                          {lesson.video && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              Video
                            </span>
                          )}
                          {lesson.quiz && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Quiz
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {lesson.completed && (
                        <div className="flex-shrink-0 ml-4">
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleLessonClick(lesson.id)}
                        className="btn btn-primary btn-sm"
                      >
                        <Play className="w-4 h-4" />
                        {lesson.completed ? 'Review' : 'Start'}
                      </button>
                      
                      {!lesson.completed && (
                        <button
                          onClick={() => handleCompleteLesson(lesson.id)}
                          className="btn btn-ghost btn-sm"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Featured Course */}
              <div className="mt-8">
                <div className="card-elevated p-8" style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}>
                  <div className="flex items-center mb-6">
                    <div className="p-3 rounded-lg bg-white/20 mr-4">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Premium Dating Mastery</h3>
                      <p className="text-white/90">Complete course with personalized coaching</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-white/20">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">AI-Powered Insights</h4>
                        <p className="text-white/80 text-sm">Get personalized dating advice based on your profile</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-white/20">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">1-on-1 Coaching</h4>
                        <p className="text-white/80 text-sm">Work directly with dating experts</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-white/20">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Guaranteed Results</h4>
                        <p className="text-white/80 text-sm">See improvement in 30 days or get your money back</p>
                      </div>
                    </div>
                  </div>
                  
                  <button className="btn btn-primary btn-lg bg-white text-purple-600 hover:bg-gray-100">
                    <Crown className="w-5 h-5" />
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatingSchool;
