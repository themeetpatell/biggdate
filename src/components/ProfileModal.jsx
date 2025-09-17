import React from 'react';
import { X, Heart, MessageCircle, Star, MapPin, Briefcase, Calendar, Globe, Phone, Video, Mail } from 'lucide-react';

const ProfileModal = ({ 
  profile, 
  isOpen, 
  onClose, 
  onLike, 
  onMessage, 
  onSuperLike 
}) => {
  if (!isOpen || !profile) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <div className="h-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-t-2xl relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          
          {/* Profile Image */}
          <div className="absolute -bottom-16 left-6">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
              <img
                src={profile.photo || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face&auto=format&q=80'}
                alt={profile.name}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-20 px-6 pb-6">
          {/* Basic Info */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h2>
            <p className="text-gray-600 mb-2">{profile.title}</p>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{profile.location}</span>
            </div>
            
            {/* Online Status */}
            {profile.isOnline && (
              <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Online now
              </div>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {profile.company && (
              <div className="flex items-center text-gray-600">
                <Briefcase className="w-4 h-4 mr-2" />
                <span>{profile.company}</span>
              </div>
            )}
            {profile.experience && (
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{profile.experience}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center text-gray-600">
                <Globe className="w-4 h-4 mr-2" />
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600">
                  Website
                </a>
              </div>
            )}
          </div>

          {/* Interests/Tags */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onLike(profile)}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
            >
              <Heart className="w-5 h-5 mr-2" />
              Like
            </button>
            <button
              onClick={() => onMessage(profile)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Message
            </button>
            <button
              onClick={() => onSuperLike(profile)}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
            >
              <Star className="w-5 h-5 mr-2" />
              Super Like
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
