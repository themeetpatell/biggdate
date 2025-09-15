import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Home, 
  Sparkles, 
  Send, 
  Calendar, 
  User, 
  Plus, 
  Bell, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronDown, 
  Menu, 
  X 
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/ai-matching', label: 'AI Matches', icon: Sparkles, isHighlighted: true },
    { path: '/pitches', label: 'Pitches', icon: Send },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/profile', label: 'Profile', icon: User },
  ];

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(45deg, var(--primary-blue), var(--primary-purple))' }}>
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-gradient font-bold text-lg sm:text-xl">BiggDate</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  } ${
                    item.isHighlighted ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.isHighlighted && (
                      <span className="ml-1 px-2 py-0.5 text-xs bg-white/20 rounded-full">
                        AI
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="btn btn-primary flex items-center gap-2 px-4 py-2">
              <Plus className="w-4 h-4" />
              <span>Create Post</span>
            </button>
            
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-3 hover:bg-gray-50 border-b last:border-b-0">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bell className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                    {user?.firstName || 'User'}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-32">
                    {user?.email || 'user@example.com'}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-2">
                    <Link to="/profile" className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <Link to="/settings" className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                    <Link to="/help" className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <HelpCircle className="w-4 h-4" />
                      <span>Help & Support</span>
                    </Link>
                    <hr className="my-2" />
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-purple-50 text-purple-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    } ${
                      item.isHighlighted ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.isHighlighted && (
                      <span className="ml-auto px-2 py-0.5 text-xs bg-white/20 rounded-full">
                        AI
                      </span>
                    )}
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t border-gray-200">
                <button className="w-full btn btn-primary flex items-center justify-center gap-2 mb-4">
                  <Plus className="w-4 h-4" />
                  <span>Create Post</span>
                </button>
                
                <div className="flex items-center gap-3 p-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.firstName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {user?.firstName || 'User'}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user?.email || 'user@example.com'}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;