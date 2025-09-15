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
  Search,
  Plus,
  Heart,
  MessageCircle,
  Zap,
  Crown,
  Star,
  TrendingUp,
  Globe,
  Moon,
  Sun
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { 
      path: '/home', 
      label: 'Home', 
      icon: Home, 
      description: 'Dashboard & Overview',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      path: '/matching', 
      label: 'AI Matches', 
      icon: Sparkles, 
      description: 'Find Your Perfect Match',
      color: 'from-purple-500 to-pink-500',
      isHighlighted: true
    },
    { 
      path: '/pitches', 
      label: 'Pitches', 
      icon: Send, 
      description: 'Business Proposals',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      path: '/events', 
      label: 'Events', 
      icon: Calendar, 
      description: 'Networking Events',
      color: 'from-orange-500 to-red-500'
    },
  ];

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
      title: 'New Match!',
      message: 'You have a new potential match',
      time: '2 minutes ago'
    },
    {
      id: 2,
      title: 'Message Received',
      message: 'Sarah sent you a message',
      time: '1 hour ago'
    }
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
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
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-gradient font-bold text-xl sm:text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  BiggDate
                </span>
                <span className="text-xs text-gray-500 -mt-1 hidden sm:block">AI-Powered Dating</span>
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
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-2xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-white/20' 
                          : `bg-gradient-to-r ${item.color} group-hover:scale-110`
                      }`}>
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white'}`} />
                      </div>
                      <span className="font-semibold">{item.label}</span>
                    {item.isHighlighted && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
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
              {/* Search */}
              <div className="relative">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <Search className="w-5 h-5" />
            </button>
                
                {showSearch && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search matches, proposals, events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        autoFocus
                      />
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      Press <kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd> to search
                    </div>
                  </div>
                )}
              </div>
            
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-300 hover:scale-105 relative group"
              >
                  <Bell className="w-5 h-5 group-hover:animate-bounce" />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse shadow-lg">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                            {notifications.length} new
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                  </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification, index) => (
                        <div key={notification.id} className="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-200 group">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                              <Bell className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1 leading-relaxed">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {notification.time}
                              </p>
                            </div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                          </div>
                        </div>
                      ))}
                      </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                      <button className="w-full text-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
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
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-sm font-bold shadow-lg group-hover:shadow-xl transition-all duration-300">
                  {user?.firstName?.charAt(0) || 'U'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900 truncate max-w-32 group-hover:text-purple-600 transition-colors">
                    {user?.firstName || 'User'}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-32">
                    {user?.email || 'user@example.com'}
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                  {/* User Info Header */}
                  <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg">
                        {user?.firstName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{user?.firstName || 'User'}</h3>
                        <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            Premium
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                            Verified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="p-2">
                    <Link to="/profile" className="flex items-center gap-4 p-3 text-gray-700 hover:bg-purple-50 rounded-xl transition-all duration-200 group">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="font-medium">Profile</span>
                        <p className="text-xs text-gray-500">Manage your profile</p>
                      </div>
                    </Link>
                    
                    <Link to="/settings" className="flex items-center gap-4 p-3 text-gray-700 hover:bg-purple-50 rounded-xl transition-all duration-200 group">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Settings className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="font-medium">Settings</span>
                        <p className="text-xs text-gray-500">Account preferences</p>
                      </div>
                    </Link>
                    
                    <Link to="/dating-school" className="flex items-center gap-4 p-3 text-gray-700 hover:bg-purple-50 rounded-xl transition-all duration-200 group">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="font-medium">Dating School</span>
                        <p className="text-xs text-gray-500">Learn dating skills</p>
                      </div>
                    </Link>
                    
                    <div className="border-t border-gray-100 my-2"></div>
                    
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-4 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 w-full text-left group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <LogOut className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="font-medium">Logout</span>
                        <p className="text-xs text-red-500">Sign out of your account</p>
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
                {notifications.length > 0 && !isMenuOpen && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
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
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${
                      isActive 
                        ? 'bg-white/20' 
                        : `bg-gradient-to-r ${item.color}`
                    }`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold">{item.label}</span>
                      <p className="text-xs opacity-75">{item.description}</p>
                    </div>
                    {item.isHighlighted && (
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
              
              {/* Mobile User Section */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 p-4 mb-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg">
                    {user?.firstName?.charAt(0) || 'U'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-900 truncate">
                      {user?.firstName || 'User'}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user?.email || 'user@example.com'}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Premium
                      </span>
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
                  className="w-full flex items-center gap-3 p-4 text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
    </nav>
      
      {/* Search Overlay */}
      {showSearch && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setShowSearch(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;