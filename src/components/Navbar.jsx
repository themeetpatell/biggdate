import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Home, 
  Sparkles, 
  Send, 
  Calendar, 
  User, 
  Bell, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronDown, 
  Menu, 
  X,
  Plus,
  Heart,
  MessageCircle,
  Zap,
  Crown,
  Star,
  TrendingUp,
  Globe,
  Moon,
  Sun,
  Info,
  Clock,
  CheckCircle,
  Crown as CrownIcon,
  Rocket,
  Target
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { persistor } from '../store';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userIntent, setUserIntent] = useState(null);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Check user intent from localStorage
  useEffect(() => {
    const intent = localStorage.getItem('selectedIntent');
    setUserIntent(intent);
  }, []);

  // Sprint user navigation
  const sprintNavItems = [
    { 
      path: '/home', 
      label: 'Sprint Dashboard', 
      icon: Zap, 
      description: 'Track Your Idea Sprint Progress',
      isHighlighted: true
    },
    { 
      path: '/startup-workspace', 
      label: 'Build MVP', 
      icon: Rocket, 
      description: 'Build Your Product'
    },
    { 
      path: '/cofounders', 
      label: 'Find Sprint Partner', 
      icon: Sparkles, 
      description: 'Find Cofounders for Your Sprint'
    },
    { 
      path: '/my-pitches', 
      label: 'My Idea', 
      icon: Target, 
      description: 'Manage Your Startup Idea'
    },
    { 
      path: '/launch', 
      label: 'Launch', 
      icon: CheckCircle, 
      description: 'Launch Your MVP'
    }
  ];

  // Default navigation
  const defaultNavItems = [
    { 
      path: '/home', 
      label: 'Home', 
      icon: Home, 
      description: 'Discover Pitches & Find Cofounders',
      isHighlighted: true
    },
    { 
      path: '/my-pitches', 
      label: 'My Pitches', 
      icon: MessageCircle, 
      description: 'Manage Your Pitches'
    },
    { 
      path: '/cofounders', 
      label: 'Cofounders', 
      icon: Sparkles, 
      description: 'Find Your Perfect Cofounder'
    },
    { 
      path: '/startup-workspace', 
      label: 'Startup Workspace', 
      icon: Rocket, 
      description: 'Build Your Startup'
    },
    { 
      path: '/launch', 
      label: 'Launch', 
      icon: Target, 
      description: 'Prepare for Launch'
    }
  ];

  // Select nav items based on user type
  const navItems = userIntent === 'idea-sprint' ? sprintNavItems : defaultNavItems;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'New Cofounder Match! 🎉',
      message: 'You matched with Alex Chen - Technical Co-founder with AI expertise',
      time: '2 minutes ago',
      type: 'match',
      isRead: false
    },
    {
      id: 2,
      title: 'Pitch-Back Received',
      message: 'Sarah Johnson sent you a pitch-back for your fintech startup',
      time: '1 hour ago',
      type: 'message',
      isRead: false
    },
    {
      id: 3,
      title: 'Pitch Response',
      message: 'Your startup pitch got 5 positive responses!',
      time: '3 hours ago',
      type: 'pitch',
      isRead: true
    },
    {
      id: 4,
      title: 'Project Update',
      message: 'MVP development milestone completed - 75% done',
      time: '4 hours ago',
      type: 'event',
      isRead: true
    },
    {
      id: 5,
      title: 'Profile View',
      message: '3 entrepreneurs viewed your profile today',
      time: '6 hours ago',
      type: 'profile',
      isRead: true
    }
  ];

  const handleLogout = async () => {
    try {
      console.log('Navbar - starting logout');
      await dispatch(logoutUser()).unwrap();
      console.log('Navbar - logout successful, purging persisted state');
      await persistor.purge();
      console.log('Navbar - persisted state purged, redirecting to /');
      navigate('/');
    } catch (error) {
      console.error('Navbar - logout failed:', error);
      // Even if logout fails, purge and redirect to home
      await persistor.purge();
      navigate('/');
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
          : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
            <Link to="/home" className="flex items-center gap-3 flex-shrink-0 group">
              <div className="relative">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-black flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-l sm:text-xl text-gray-900">
                  Co-Builders
                </span>
                <span className="text-xs text-gray-500 -mt-1 hidden sm:block">Building Startups</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                    className={`group relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    isActive 
                        ? 'bg-black text-white shadow-lg' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-2xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-white/20' 
                          : 'bg-gray-200 group-hover:bg-gray-300 group-hover:scale-110'
                      }`}>
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-700'}`} />
                      </div>
                      <span className="font-semibold">{item.label}</span>
                    {item.isHighlighted && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
                    )}
                  </div>
                    
                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      {item.description}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-300 hover:scale-105 relative group"
              >
                  <Bell className="w-4 h-4 group-hover:animate-bounce" />
                {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center animate-pulse shadow-lg">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                            {notifications.filter(n => !n.isRead).length} new
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                  </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification, index) => {
                        const getNotificationIcon = (type) => {
                          switch (type) {
                            case 'match': return <Heart className="w-4 h-4 text-white" />;
                            case 'message': return <MessageCircle className="w-4 h-4 text-white" />;
                            case 'pitch': return <Send className="w-4 h-4 text-white" />;
                            case 'event': return <Calendar className="w-4 h-4 text-white" />;
                            case 'profile': return <User className="w-4 h-4 text-white" />;
                            default: return <Bell className="w-4 h-4 text-white" />;
                          }
                        };

                        const getNotificationColor = (type) => {
                          switch (type) {
                            case 'match': return 'bg-black';
                            case 'message': return 'bg-gray-600';
                            case 'pitch': return 'bg-gray-700';
                            case 'event': return 'bg-gray-800';
                            case 'profile': return 'bg-gray-900';
                            default: return 'bg-gray-500';
                          }
                        };

                        return (
                          <div key={notification.id} className={`p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-200 group ${!notification.isRead ? 'bg-gray-50/50' : ''}`}>
                            <div className="flex items-start gap-4">
                              <div className={`w-10 h-10 ${getNotificationColor(notification.type)} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                                    {notification.title}
                                  </p>
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 bg-black rounded-full flex-shrink-0 mt-1"></div>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                      <button className="w-full text-center text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors">
                        View All Notifications
                      </button>
                  </div>
                </div>
              )}
            </div>


            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 p-2.5 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300 hover:scale-105 group"
              >
                <div className="relative">
                  <img
                    src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=000000&color=fff&size=40&rounded=true`}
                    alt={`${user?.firstName} ${user?.lastName}`}
                    className="w-10 h-10 rounded-2xl object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center border-2 border-white">
                    <CheckCircle className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900 truncate max-w-32 group-hover:text-gray-600 transition-colors">
                    {user?.firstName || 'John'} {user?.lastName || 'Doe'}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-32">
                    @{user?.username || 'johndoe123'}
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                  {/* User Info Header */}
                  <div className="p-6 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=000000&color=fff&size=48&rounded=true`}
                          alt={`${user?.firstName} ${user?.lastName}`}
                          className="w-12 h-12 rounded-2xl object-cover shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center border-2 border-white">
                          <CheckCircle className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-lg truncate">
                            {user?.firstName || 'John'} {user?.lastName || 'Doe'}
                          </h3>
                          <div className="flex items-center gap-1">
                            <CrownIcon className="w-4 h-4 text-black" />
                            <CheckCircle className="w-4 h-4 text-black" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate">@{user?.username || 'johndoe123'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="p-2">
                    <Link to="/profile" className="flex items-center gap-4 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 group">
                      <div className="w-8 h-8 bg-gray-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="font-medium">Profile</span>
                        <p className="text-xs text-gray-500">Manage your profile</p>
                      </div>
                    </Link>
                    
                    <Link to="/settings" className="flex items-center gap-4 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 group">
                      <div className="w-8 h-8 bg-gray-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Settings className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="font-medium">Settings</span>
                        <p className="text-xs text-gray-500">Account preferences</p>
                      </div>
                    </Link>
                    
                    
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-4 p-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200 w-full text-left group"
                    >
                      <div className="w-8 h-8 bg-gray-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <LogOut className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="font-medium">Logout</span>
                        <p className="text-xs text-gray-500">Sign out of your account</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-300 hover:scale-105"
          >
              <div className="relative">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                {notifications.filter(n => !n.isRead).length > 0 && !isMenuOpen && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full"></div>
                )}
              </div>
          </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-lg">
            <div className="px-4 py-6 space-y-2">
              {/* Mobile Navigation */}
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-black text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${
                      isActive 
                        ? 'bg-white/20' 
                        : 'bg-gray-200'
                    }`}>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-700'}`} />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold">{item.label}</span>
                      <p className="text-xs opacity-75">{item.description}</p>
                    </div>
                    {item.isHighlighted && (
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
              
              
              {/* Mobile User Section */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 p-4 mb-4 bg-gray-50 rounded-2xl">
                  <div className="relative">
                    <img
                      src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=000000&color=fff&size=48&rounded=true`}
                      alt={`${user?.firstName} ${user?.lastName}`}
                      className="w-12 h-12 rounded-2xl object-cover shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center border-2 border-white">
                      <CheckCircle className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold text-gray-900 truncate">
                        {user?.firstName || 'John'} {user?.lastName || 'Doe'}
                      </div>
                      <div className="flex items-center gap-1">
                        <CrownIcon className="w-3 h-3 text-black" />
                        <CheckCircle className="w-3 h-3 text-black" />
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      @{user?.username || 'johndoe123'}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    to="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Profile</span>
                  </Link>
                  <Link 
                    to="/settings" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">Settings</span>
                  </Link>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-4 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors mt-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
    </nav>

    </>
  );
};

export default Navbar;