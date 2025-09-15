import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  User, 
  Bell, 
  Shield, 
  Eye, 
  Heart, 
  MapPin, 
  Globe, 
  Moon, 
  Sun, 
  Smartphone, 
  Mail, 
  Lock, 
  Camera, 
  Edit, 
  Save, 
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Settings as SettingsIcon,
  Palette,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Smartphone as PhoneIcon,
  Monitor,
  Tablet
} from 'lucide-react';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john.doe@example.com',
    bio: 'Passionate about meaningful connections and personal growth.',
    location: 'San Francisco, CA',
    age: 28,
    occupation: 'Software Engineer',
    company: 'Tech Corp',
    education: 'Stanford University',
    interests: ['Photography', 'Hiking', 'Cooking', 'Travel', 'Music'],
    relationshipGoals: 'Long-term relationship',
    lookingFor: 'Serious relationship',
    maxDistance: 25,
    ageRange: { min: 25, max: 35 }
  });

  const [preferences, setPreferences] = useState({
    notifications: {
      newMatches: true,
      messages: true,
      likes: true,
      superLikes: true,
      events: false,
      marketing: false
    },
    privacy: {
      showOnlineStatus: true,
      showLastSeen: true,
      showDistance: true,
      showAge: true,
      allowDiscovery: true,
      showInSearch: true
    },
    appearance: {
      theme: 'light',
      language: 'en',
      fontSize: 'medium',
      animations: true,
      soundEffects: true,
      hapticFeedback: true
    },
    safety: {
      blockInappropriate: true,
      reportSuspicious: true,
      shareLocation: false,
      emergencyContacts: true,
      twoFactorAuth: false
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'safety', label: 'Safety', icon: Lock },
    { id: 'account', label: 'Account', icon: SettingsIcon }
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (category, field, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }));
  };

  const handleSave = () => {
    // Save logic would go here
    setIsEditing(false);
    // Show success message
  };

  const handleDeleteAccount = () => {
    // Delete account logic would go here
    setShowDeleteConfirm(false);
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn btn-secondary btn-sm"
          >
            <Edit className="w-4 h-4" />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={!isEditing}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={!isEditing}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                disabled={!isEditing}
                className="input w-full"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                value={profileData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                disabled={!isEditing}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
              <input
                type="text"
                value={profileData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                disabled={!isEditing}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <input
                type="text"
                value={profileData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                disabled={!isEditing}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
              <input
                type="text"
                value={profileData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                disabled={!isEditing}
                className="input w-full"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          <textarea
            value={profileData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            disabled={!isEditing}
            rows={4}
            className="input w-full resize-none"
            placeholder="Tell us about yourself..."
          />
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn btn-primary"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dating Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Relationship Goals</label>
            <select
              value={profileData.relationshipGoals}
              onChange={(e) => handleInputChange('relationshipGoals', e.target.value)}
              className="input w-full"
            >
              <option value="Casual dating">Casual dating</option>
              <option value="Long-term relationship">Long-term relationship</option>
              <option value="Marriage">Marriage</option>
              <option value="Friendship">Friendship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Looking For</label>
            <select
              value={profileData.lookingFor}
              onChange={(e) => handleInputChange('lookingFor', e.target.value)}
              className="input w-full"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Everyone">Everyone</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Distance (miles)</label>
            <input
              type="range"
              min="1"
              max="100"
              value={profileData.maxDistance}
              onChange={(e) => handleInputChange('maxDistance', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-500 mt-1">{profileData.maxDistance} miles</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="18"
                max="100"
                value={profileData.ageRange.min}
                onChange={(e) => handleInputChange('ageRange', { ...profileData.ageRange, min: parseInt(e.target.value) })}
                className="input w-20"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                min="18"
                max="100"
                value={profileData.ageRange.max}
                onChange={(e) => handleInputChange('ageRange', { ...profileData.ageRange, max: parseInt(e.target.value) })}
                className="input w-20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Push Notifications</h3>
        <div className="space-y-4">
          {Object.entries(preferences.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                <p className="text-sm text-gray-500">
                  {key === 'newMatches' && 'Get notified when someone likes you'}
                  {key === 'messages' && 'Get notified when you receive new messages'}
                  {key === 'likes' && 'Get notified when someone likes your profile'}
                  {key === 'superLikes' && 'Get notified when someone super likes you'}
                  {key === 'events' && 'Get notified about upcoming events'}
                  {key === 'marketing' && 'Get notified about promotions and updates'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handlePreferenceChange('notifications', key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Weekly Summary</h4>
              <p className="text-sm text-gray-500">Get a weekly summary of your activity</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Visibility</h3>
        <div className="space-y-4">
          {Object.entries(preferences.privacy).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                <p className="text-sm text-gray-500">
                  {key === 'showOnlineStatus' && 'Show when you are online'}
                  {key === 'showLastSeen' && 'Show when you were last active'}
                  {key === 'showDistance' && 'Show your distance from other users'}
                  {key === 'showAge' && 'Show your age on your profile'}
                  {key === 'allowDiscovery' && 'Allow others to discover your profile'}
                  {key === 'showInSearch' && 'Show your profile in search results'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handlePreferenceChange('privacy', key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data & Privacy</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Download Your Data</h4>
              <p className="text-sm text-gray-500">Get a copy of all your data</p>
            </div>
            <button className="btn btn-secondary btn-sm">Download</button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Delete Your Data</h4>
              <p className="text-sm text-gray-500">Permanently delete all your data</p>
            </div>
            <button className="btn btn-danger btn-sm">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => handlePreferenceChange('appearance', 'theme', 'light')}
            className={`p-4 rounded-lg border-2 transition-all ${
              preferences.appearance.theme === 'light' 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Sun className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm font-medium">Light</div>
          </button>
          <button
            onClick={() => handlePreferenceChange('appearance', 'theme', 'dark')}
            className={`p-4 rounded-lg border-2 transition-all ${
              preferences.appearance.theme === 'dark' 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Moon className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm font-medium">Dark</div>
          </button>
          <button
            onClick={() => handlePreferenceChange('appearance', 'theme', 'auto')}
            className={`p-4 rounded-lg border-2 transition-all ${
              preferences.appearance.theme === 'auto' 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Monitor className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm font-medium">Auto</div>
          </button>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Language</h3>
        <select
          value={preferences.appearance.language}
          onChange={(e) => handlePreferenceChange('appearance', 'language', e.target.value)}
          className="input w-full max-w-xs"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="pt">Portuguese</option>
        </select>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Accessibility</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Animations</h4>
              <p className="text-sm text-gray-500">Enable smooth animations and transitions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.appearance.animations}
                onChange={(e) => handlePreferenceChange('appearance', 'animations', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Sound Effects</h4>
              <p className="text-sm text-gray-500">Play sounds for notifications and interactions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.appearance.soundEffects}
                onChange={(e) => handlePreferenceChange('appearance', 'soundEffects', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Haptic Feedback</h4>
              <p className="text-sm text-gray-500">Vibrate on touch interactions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.appearance.hapticFeedback}
                onChange={(e) => handlePreferenceChange('appearance', 'hapticFeedback', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSafetyTab = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Features</h3>
        <div className="space-y-4">
          {Object.entries(preferences.safety).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                <p className="text-sm text-gray-500">
                  {key === 'blockInappropriate' && 'Automatically block inappropriate content'}
                  {key === 'reportSuspicious' && 'Report suspicious behavior automatically'}
                  {key === 'shareLocation' && 'Share your location with matches'}
                  {key === 'emergencyContacts' && 'Enable emergency contact features'}
                  {key === 'twoFactorAuth' && 'Enable two-factor authentication'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handlePreferenceChange('safety', key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Blocked Users</h3>
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No blocked users</p>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Issues</h3>
        <div className="space-y-4">
          <button className="btn btn-secondary w-full justify-start">
            <AlertCircle className="w-4 h-4" />
            Report a Bug
          </button>
          <button className="btn btn-secondary w-full justify-start">
            <Info className="w-4 h-4" />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );

  const renderAccountTab = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Email Address</h4>
              <p className="text-sm text-gray-500">{profileData.email}</p>
            </div>
            <button className="btn btn-secondary btn-sm">Change</button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Phone Number</h4>
              <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
            </div>
            <button className="btn btn-secondary btn-sm">Add</button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Password</h4>
              <p className="text-sm text-gray-500">Last changed 3 months ago</p>
            </div>
            <button className="btn btn-secondary btn-sm">Change</button>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h3>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Premium Plan</h4>
            <p className="text-sm text-gray-500">Renews on March 15, 2024</p>
          </div>
          <button className="btn btn-primary btn-sm">Manage</button>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Deactivate Account</h4>
              <p className="text-sm text-gray-500">Temporarily disable your account</p>
            </div>
            <button className="btn btn-warning btn-sm">Deactivate</button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Delete Account</h4>
              <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
            </div>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'privacy':
        return renderPrivacyTab();
      case 'appearance':
        return renderAppearanceTab();
      case 'safety':
        return renderSafetyTab();
      case 'account':
        return renderAccountTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="main-content">
      <div className="container">
        <div className="section">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="card p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This will permanently remove all your data, matches, and conversations.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="btn btn-danger flex-1"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
