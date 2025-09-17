import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  User, 
  Phone, 
  Briefcase, 
  MapPin, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Crown,
  ArrowRight,
  Globe
} from 'lucide-react';

const WaitlistPopup = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+1',
    phone: '',
    role: '',
    location: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const roles = [
    'Founder',
    'Investor',
    'Builder'
  ];

  const countryCodes = [
    { code: '+1', country: 'US/CA', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+91', country: 'IN', flag: '🇮🇳' },
    { code: '+49', country: 'DE', flag: '🇩🇪' },
    { code: '+33', country: 'FR', flag: '🇫🇷' },
    { code: '+81', country: 'JP', flag: '🇯🇵' },
    { code: '+86', country: 'CN', flag: '🇨🇳' },
    { code: '+61', country: 'AU', flag: '🇦🇺' },
    { code: '+55', country: 'BR', flag: '🇧🇷' },
    { code: '+7', country: 'RU', flag: '🇷🇺' },
    { code: '+82', country: 'KR', flag: '🇰🇷' },
    { code: '+39', country: 'IT', flag: '🇮🇹' },
    { code: '+34', country: 'ES', flag: '🇪🇸' },
    { code: '+31', country: 'NL', flag: '🇳🇱' },
    { code: '+46', country: 'SE', flag: '🇸🇪' },
    { code: '+47', country: 'NO', flag: '🇳🇴' },
    { code: '+45', country: 'DK', flag: '🇩🇰' },
    { code: '+41', country: 'CH', flag: '🇨🇭' },
    { code: '+43', country: 'AT', flag: '🇦🇹' },
    { code: '+32', country: 'BE', flag: '🇧🇪' }
  ];

  const cities = [
    // Dubai
    { name: 'Dubai', country: 'UAE', flag: '🇦🇪' },
    
    // India
    { name: 'Mumbai', country: 'India', flag: '🇮🇳' },
    { name: 'Delhi', country: 'India', flag: '🇮🇳' },
    { name: 'Bangalore', country: 'India', flag: '🇮🇳' },
    { name: 'Hyderabad', country: 'India', flag: '🇮🇳' },
    { name: 'Chennai', country: 'India', flag: '🇮🇳' },
    { name: 'Pune', country: 'India', flag: '🇮🇳' },
    { name: 'Kolkata', country: 'India', flag: '🇮🇳' },
    { name: 'Ahmedabad', country: 'India', flag: '🇮🇳' },
    { name: 'Gurgaon', country: 'India', flag: '🇮🇳' },
    { name: 'Noida', country: 'India', flag: '🇮🇳' },
    
    // Canada
    { name: 'Toronto', country: 'Canada', flag: '🇨🇦' },
    { name: 'Vancouver', country: 'Canada', flag: '🇨🇦' },
    { name: 'Montreal', country: 'Canada', flag: '🇨🇦' },
    { name: 'Calgary', country: 'Canada', flag: '🇨🇦' },
    { name: 'Ottawa', country: 'Canada', flag: '🇨🇦' },
    { name: 'Edmonton', country: 'Canada', flag: '🇨🇦' },
    { name: 'Winnipeg', country: 'Canada', flag: '🇨🇦' },
    { name: 'Quebec City', country: 'Canada', flag: '🇨🇦' },
    { name: 'Hamilton', country: 'Canada', flag: '🇨🇦' },
    { name: 'Kitchener', country: 'Canada', flag: '🇨🇦' },
    
    // Australia
    { name: 'Sydney', country: 'Australia', flag: '🇦🇺' },
    { name: 'Melbourne', country: 'Australia', flag: '🇦🇺' },
    { name: 'Brisbane', country: 'Australia', flag: '🇦🇺' },
    { name: 'Perth', country: 'Australia', flag: '🇦🇺' },
    { name: 'Adelaide', country: 'Australia', flag: '🇦🇺' },
    { name: 'Gold Coast', country: 'Australia', flag: '🇦🇺' },
    { name: 'Newcastle', country: 'Australia', flag: '🇦🇺' },
    { name: 'Canberra', country: 'Australia', flag: '🇦🇺' },
    { name: 'Wollongong', country: 'Australia', flag: '🇦🇺' },
    { name: 'Hobart', country: 'Australia', flag: '🇦🇺' },
    
    // USA
    { name: 'New York', country: 'USA', flag: '🇺🇸' },
    { name: 'Los Angeles', country: 'USA', flag: '🇺🇸' },
    { name: 'Chicago', country: 'USA', flag: '🇺🇸' },
    { name: 'Houston', country: 'USA', flag: '🇺🇸' },
    { name: 'Phoenix', country: 'USA', flag: '🇺🇸' },
    { name: 'Philadelphia', country: 'USA', flag: '🇺🇸' },
    { name: 'San Antonio', country: 'USA', flag: '🇺🇸' },
    { name: 'San Diego', country: 'USA', flag: '🇺🇸' },
    { name: 'Dallas', country: 'USA', flag: '🇺🇸' },
    { name: 'San Jose', country: 'USA', flag: '🇺🇸' },
    { name: 'Austin', country: 'USA', flag: '🇺🇸' },
    { name: 'Jacksonville', country: 'USA', flag: '🇺🇸' },
    { name: 'Fort Worth', country: 'USA', flag: '🇺🇸' },
    { name: 'Columbus', country: 'USA', flag: '🇺🇸' },
    { name: 'Charlotte', country: 'USA', flag: '🇺🇸' },
    { name: 'San Francisco', country: 'USA', flag: '🇺🇸' },
    { name: 'Indianapolis', country: 'USA', flag: '🇺🇸' },
    { name: 'Seattle', country: 'USA', flag: '🇺🇸' },
    { name: 'Denver', country: 'USA', flag: '🇺🇸' },
    { name: 'Washington', country: 'USA', flag: '🇺🇸' },
    { name: 'Boston', country: 'USA', flag: '🇺🇸' },
    { name: 'El Paso', country: 'USA', flag: '🇺🇸' },
    { name: 'Nashville', country: 'USA', flag: '🇺🇸' },
    { name: 'Detroit', country: 'USA', flag: '🇺🇸' },
    { name: 'Oklahoma City', country: 'USA', flag: '🇺🇸' },
    { name: 'Portland', country: 'USA', flag: '🇺🇸' },
    { name: 'Las Vegas', country: 'USA', flag: '🇺🇸' },
    { name: 'Memphis', country: 'USA', flag: '🇺🇸' },
    { name: 'Louisville', country: 'USA', flag: '🇺🇸' },
    { name: 'Baltimore', country: 'USA', flag: '🇺🇸' },
    { name: 'Milwaukee', country: 'USA', flag: '🇺🇸' },
    { name: 'Albuquerque', country: 'USA', flag: '🇺🇸' },
    { name: 'Tucson', country: 'USA', flag: '🇺🇸' },
    { name: 'Fresno', country: 'USA', flag: '🇺🇸' },
    { name: 'Sacramento', country: 'USA', flag: '🇺🇸' },
    { name: 'Mesa', country: 'USA', flag: '🇺🇸' },
    { name: 'Kansas City', country: 'USA', flag: '🇺🇸' },
    { name: 'Atlanta', country: 'USA', flag: '🇺🇸' },
    { name: 'Long Beach', country: 'USA', flag: '🇺🇸' },
    { name: 'Colorado Springs', country: 'USA', flag: '🇺🇸' },
    { name: 'Raleigh', country: 'USA', flag: '🇺🇸' },
    { name: 'Miami', country: 'USA', flag: '🇺🇸' },
    { name: 'Virginia Beach', country: 'USA', flag: '🇺🇸' },
    { name: 'Omaha', country: 'USA', flag: '🇺🇸' },
    { name: 'Oakland', country: 'USA', flag: '🇺🇸' },
    { name: 'Minneapolis', country: 'USA', flag: '🇺🇸' },
    { name: 'Tulsa', country: 'USA', flag: '🇺🇸' },
    { name: 'Arlington', country: 'USA', flag: '🇺🇸' },
    { name: 'Tampa', country: 'USA', flag: '🇺🇸' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9\s\-\(\)]{7,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call the onSubmit prop with form data
      if (onSubmit) {
        onSubmit(formData);
      }
      
      setIsSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          countryCode: '+1',
          phone: '',
          role: '',
          location: ''
        });
        setIsSuccess(false);
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting waitlist:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Join the Waitlist</h2>
              <p className="text-gray-300 text-sm">Launching October 20th, 2025</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Welcome to the Waitlist!</h3>
            <p className="text-gray-300 mb-6">
              You're all set! We'll notify you as soon as BiggDate launches on October 20th, 2025.
            </p>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
              <p className="text-sm text-gray-300">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Early access perks coming your way!
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm ${
                      errors.firstName ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="John"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.firstName}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm ${
                      errors.lastName ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="Doe"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-white font-semibold mb-2 text-sm">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm ${
                    errors.email ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="john@example.com"
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-white font-semibold mb-2 text-sm">Phone Number</label>
              <div className="flex gap-2">
                {/* Country Code Dropdown */}
                <div className="relative w-32">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm appearance-none cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code} className="bg-gray-800">
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Phone Number Input */}
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm ${
                      errors.phone ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="(555) 123-4567"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-white font-semibold mb-2 text-sm">Your Role</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm appearance-none ${
                    errors.role ? 'border-red-500' : 'border-white/20'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="" className="bg-gray-800">Select your role</option>
                  {roles.map((role) => (
                    <option key={role} value={role} className="bg-gray-800">
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              {errors.role && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.role}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-white font-semibold mb-2 text-sm">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm appearance-none ${
                    errors.location ? 'border-red-500' : 'border-white/20'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="" className="bg-gray-800">Select your city</option>
                  {cities.map((city) => (
                    <option key={`${city.name}-${city.country}`} value={`${city.name}, ${city.country}`} className="bg-gray-800">
                      {city.flag} {city.name}, {city.country}
                    </option>
                  ))}
                </select>
              </div>
              {errors.location && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.location}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-purple-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Joining Waitlist...</span>
                </>
              ) : (
                <>
                  <span>Join Waitlist</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Privacy Note */}
            <p className="text-gray-400 text-xs text-center">
              We respect your privacy. No spam, just updates about our launch.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default WaitlistPopup;
