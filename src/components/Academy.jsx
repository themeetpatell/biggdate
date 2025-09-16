import React, { useState, useEffect } from 'react';
import { 
  GraduationCap,
  Play,
  Pause,
  Clock,
  Star,
  Award,
  Trophy,
  Target,
  BookOpen,
  Video,
  Headphones,
  FileText,
  CheckCircle,
  Lock,
  Unlock,
  Zap,
  TrendingUp,
  Users,
  MessageCircle,
  Heart,
  Share2,
  Download,
  Filter,
  Search,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Brain,
  Lightbulb,
  Rocket,
  Crown,
  Diamond,
  Flame,
  Gem
} from 'lucide-react';

const Academy = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [courses, setCourses] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const categories = ['all', 'Pitching', 'Communication', 'Dating', 'Business', 'Personal Growth', 'Networking'];
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  // Load academy data on component mount
  useEffect(() => {
    loadAcademyData();
  }, []);

  const loadAcademyData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      const [coursesData, statsData, achievementsData] = await Promise.all([
        loadCourses(),
        loadUserStats(),
        loadAchievements()
      ]);
      
      setCourses(coursesData);
      setUserStats(statsData);
      setAchievements(achievementsData);
    } catch (error) {
      console.error('Error loading academy data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCourses = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: 1,
        title: "The Art of Pitching Yourself",
        instructor: "Sarah Chen",
        category: "Pitching",
        level: "Intermediate",
        duration: "2h 30m",
        rating: 4.8,
        students: 1250,
        price: 49,
        isFree: false,
        thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
        description: "Master the art of presenting yourself confidently in any professional setting.",
        lessons: 12,
        completedLessons: 0,
        progress: 0,
        isEnrolled: false,
        tags: ["Pitching", "Confidence", "Presentation"]
      },
      {
        id: 2,
        title: "MVP Date Frameworks",
        instructor: "Alex Rodriguez",
        category: "Dating",
        level: "Beginner",
        duration: "1h 45m",
        rating: 4.9,
        students: 2100,
        price: 0,
        isFree: true,
        thumbnail: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=400&h=300&fit=crop",
        description: "Learn how to create meaningful connections using startup methodologies.",
        lessons: 8,
        completedLessons: 3,
        progress: 37.5,
        isEnrolled: true,
        tags: ["Dating", "Frameworks", "Connections"]
      },
      {
        id: 3,
        title: "Networking Like a Pro",
        instructor: "Maya Patel",
        category: "Networking",
        level: "Advanced",
        duration: "3h 15m",
        rating: 4.7,
        students: 890,
        price: 79,
        isFree: false,
        thumbnail: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop",
        description: "Advanced strategies for building meaningful professional relationships.",
        lessons: 15,
        completedLessons: 0,
        progress: 0,
        isEnrolled: false,
        tags: ["Networking", "Relationships", "Professional"]
      }
    ];
  };

  const loadUserStats = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      level: 5,
      xp: 1250,
      xpToNext: 250,
      nextLevelXp: 1500,
      coursesCompleted: 3,
      completedCourses: 3,
      totalXP: 2500,
      streak: 7,
      currentStreak: 7,
      tokens: 150
    };
  };

  const loadAchievements = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: 1,
        title: "First Course",
        description: "Complete your first course",
        icon: GraduationCap,
        unlocked: true,
        date: "2024-01-15",
        xp: 100
      },
      {
        id: 2,
        title: "Week Warrior",
        description: "Complete 7 courses in a week",
        icon: Trophy,
        unlocked: true,
        date: "2024-01-20",
        xp: 500
      },
      {
        id: 3,
        title: "Pitching Master",
        description: "Complete all pitching courses",
        icon: Target,
        unlocked: false,
        date: null,
        xp: 300
      }
    ];
  };

  const handleEnrollCourse = async (courseId) => {
    setActionLoading(prev => ({ ...prev, [courseId]: true }));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update course enrollment status
      setCourses(prev => 
        prev.map(course => 
          course.id === courseId 
            ? { ...course, isEnrolled: true, progress: 0, completedLessons: 0 }
            : course
        )
      );
      
      setSuccessMessage('Successfully enrolled in course!');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const handleCompleteLesson = async (courseId, lessonId) => {
    setActionLoading(prev => ({ ...prev, [`${courseId}-${lessonId}`]: true }));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Update course progress
      setCourses(prev => 
        prev.map(course => {
          if (course.id === courseId) {
            const newCompletedLessons = course.completedLessons + 1;
            const newProgress = (newCompletedLessons / course.lessons) * 100;
            return { 
              ...course, 
              completedLessons: newCompletedLessons,
              progress: newProgress
            };
          }
          return course;
        })
      );
      
      // Update user stats
      setUserStats(prev => ({
        ...prev,
        xp: prev.xp + 50,
        totalXP: prev.totalXP + 50
      }));
      
      setSuccessMessage('Lesson completed! +50 XP');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
    } catch (error) {
      console.error('Error completing lesson:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [`${courseId}-${lessonId}`]: false }));
    }
  };

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const userStatsOld = {
    level: 5,
    xp: 1250,
    nextLevelXp: 1500,
    totalCourses: 12,
    completedCourses: 8,
    currentStreak: 7,
    longestStreak: 15,
    tokens: 25,
    achievements: 6
  };



  const renderCourseCard = (course) => (
    <div key={course.id} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {course.isCompleted && (
            <div className="px-3 py-1 bg-green-500 text-white text-sm rounded-full font-medium">
              <CheckCircle className="w-4 h-4 inline mr-1" />
              Complete
            </div>
          )}
          {course.price === "Premium" && (
            <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full font-medium">
              Premium
            </div>
          )}
        </div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white bg-opacity-90 text-gray-700 text-sm rounded-full font-medium">
            {course.level}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{course.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">{course.price}</div>
            <div className="text-sm text-gray-500">per course</div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <img
              src={course.instructorImage}
              alt={course.instructor}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm text-gray-600">{course.instructor}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm text-gray-600">{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{course.students}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{course.duration}</span>
          </div>
        </div>

        {course.isEnrolled && course.progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          {course.isEnrolled ? (
            <button
              onClick={() => setSelectedCourse(course)}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold"
            >
              {course.isCompleted ? 'Review Course' : 'Continue Learning'}
            </button>
          ) : (
            <button
              onClick={() => handleEnrollCourse(course.id)}
              disabled={actionLoading[course.id]}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading[course.id] ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enrolling...
                </div>
              ) : (
                'Enroll Now'
              )}
            </button>
          )}
          
          <button className="p-3 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-3 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderCourseDetails = (course) => (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">{course.title}</h2>
        <button
          onClick={() => setSelectedCourse(null)}
          className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-64 object-cover rounded-2xl mb-6"
          />
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Course Description</h3>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Course Modules</h3>
              <div className="space-y-3">
                {course.modules.map((module, index) => {
                  const Icon = module.type === 'video' ? Video : module.type === 'interactive' ? Brain : FileText;
                  return (
                    <div key={module.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        module.completed 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : 'bg-gray-200'
                      }`}>
                        {module.completed ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <Icon className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{module.title}</h4>
                        <p className="text-sm text-gray-600">{module.duration} • {module.type}</p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
                        <Play className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Course Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-semibold">{course.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Level</span>
                <span className="font-semibold">{course.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category</span>
                <span className="font-semibold">{course.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">{course.rating}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Rewards</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">{course.rewards.xp} XP</span>
              </div>
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="text-gray-700">{course.rewards.tokens} Tokens</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">{course.rewards.badge} Badge</span>
              </div>
            </div>
          </div>

          <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold">
            {course.isEnrolled ? 'Continue Learning' : 'Enroll Now'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderStatsTab = () => (
    <div className="space-y-6">
      {/* User Stats */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Learning Stats</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{userStats.level}</div>
            <div className="text-gray-600">Level</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{userStats.xp}</div>
            <div className="text-gray-600">XP</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{userStats.completedCourses}</div>
            <div className="text-gray-600">Courses Complete</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{userStats.currentStreak}</div>
            <div className="text-gray-600">Day Streak</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Next Level Progress</h3>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Level {userStats.level}</span>
            <span>{userStats.xp}/{userStats.nextLevelXp} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(userStats.xp / userStats.nextLevelXp) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => {
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
                  <div className="text-xs text-green-600 font-medium">
                    Unlocked {achievement.date}
                  </div>
                ) : achievement.progress ? (
                  <div className="text-xs text-gray-500">
                    Progress: {achievement.progress}/10
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">
                    Locked
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading academy...</p>
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
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Academy</h1>
            <p className="text-gray-600">Dating School - Learn the art of connection</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 px-4 py-2 rounded-2xl">
              <GraduationCap className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-700">{userStats.coursesCompleted || 0} Complete</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-2xl">
              <Zap className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-700">{userStats.tokens || 0} Tokens</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
            <div className="flex space-x-2">
              {[
                { id: 'courses', label: 'Courses', icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
                { id: 'stats', label: 'My Stats', icon: TrendingUp, color: 'from-purple-500 to-pink-500' }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
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

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {activeTab === 'courses' ? (
            <>
              {/* Filters */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </option>
                      ))}
                    </select>
                    <select
                      value={filterLevel}
                      onChange={(e) => setFilterLevel(e.target.value)}
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {levels.map(level => (
                        <option key={level} value={level}>
                          {level === 'all' ? 'All Levels' : level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Courses Grid */}
              {selectedCourse ? (
                renderCourseDetails(selectedCourse)
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map(renderCourseCard)}
                </div>
              )}
            </>
          ) : (
            renderStatsTab()
          )}
        </div>
      </div>
    </div>
  );
};

export default Academy;
