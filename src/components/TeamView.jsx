import React, { useState, useEffect } from 'react';
import { 
  Users, User, Plus, Edit3, Trash2, Save, 
  Download, Share2, Eye, CheckCircle, Clock, 
  AlertCircle, Target, BarChart3, TrendingUp, 
  Award, Star, Zap, ChevronRight, ChevronDown, 
  ChevronUp, ArrowRight, ArrowLeft, ArrowUp, 
  ArrowDown, X, Info, HelpCircle, RefreshCw,
  Mail, Phone, MessageSquare, Video, Calendar,
  MapPin, Briefcase, GraduationCap, Globe
} from 'lucide-react';

const TeamView = () => {
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'Alex Chen',
      role: 'Technical Co-founder',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      status: 'active',
      skills: ['React', 'Node.js', 'AI/ML', 'AWS'],
      experience: '5+ years in full-stack development',
      education: 'MS Computer Science, Stanford',
      location: 'San Francisco, CA',
      email: 'alex@techflow.ai',
      phone: '+1 (555) 123-4567',
      linkedin: 'linkedin.com/in/alexchen',
      github: 'github.com/alexchen',
      bio: 'Passionate about building scalable AI solutions and leading technical teams. Previously worked at Google and founded two successful startups.',
      previousStartups: ['DataFlow Inc.', 'CloudTech Solutions'],
      achievements: ['Led 3 successful product launches', 'Raised $2M+ in funding', 'Published 5 research papers'],
      workStyle: 'Data-driven, collaborative, remote-first',
      availability: 'Full-time, flexible hours',
      timezone: 'PST',
      joinedDate: '2024-01-01',
      equity: '40%',
      responsibilities: ['Technical Architecture', 'Product Development', 'Team Leadership']
    },
    {
      id: 2,
      name: 'Sarah Martinez',
      role: 'Business Co-founder',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      status: 'active',
      skills: ['Business Strategy', 'Sales', 'Marketing', 'Operations'],
      experience: '7+ years in business development and strategy',
      education: 'MBA, Harvard Business School',
      location: 'New York, NY',
      email: 'sarah@techflow.ai',
      phone: '+1 (555) 987-6543',
      linkedin: 'linkedin.com/in/sarahmartinez',
      github: 'github.com/sarahmartinez',
      bio: 'Strategic business leader with expertise in scaling startups from idea to market. Focused on customer acquisition and revenue growth.',
      previousStartups: ['GrowthCo', 'MarketPlace Pro'],
      achievements: ['Grew 2 startups to $10M+ ARR', 'Led 50+ enterprise deals', 'Built teams of 20+ people'],
      workStyle: 'Strategic, customer-focused, results-oriented',
      availability: 'Full-time, flexible hours',
      timezone: 'EST',
      joinedDate: '2024-01-01',
      equity: '40%',
      responsibilities: ['Business Strategy', 'Sales & Marketing', 'Operations', 'Fundraising']
    }
  ]);

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    skills: [],
    experience: '',
    education: '',
    location: '',
    bio: '',
    workStyle: '',
    availability: 'full-time',
    equity: '0%'
  });

  const [editingMember, setEditingMember] = useState(null);

  const addMember = () => {
    if (newMember.name.trim() && newMember.role.trim()) {
      const member = {
        ...newMember,
        id: Date.now(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newMember.name)}&background=000000&color=ffffff`,
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0],
        previousStartups: [],
        achievements: [],
        responsibilities: []
      };
      
      setTeamMembers(prev => [...prev, member]);
      setNewMember({
        name: '',
        role: '',
        email: '',
        phone: '',
        skills: [],
        experience: '',
        education: '',
        location: '',
        bio: '',
        workStyle: '',
        availability: 'full-time',
        equity: '0%'
      });
      setShowAddMemberModal(false);
    }
  };

  const updateMember = () => {
    if (editingMember) {
      setTeamMembers(prev => prev.map(member => 
        member.id === editingMember.id ? { ...member, ...editingMember } : member
      ));
      setEditingMember(null);
      setShowEditMemberModal(false);
    }
  };

  const deleteMember = (memberId) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'away':
        return 'bg-yellow-100 text-yellow-700';
      case 'offline':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'away':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
      case 'offline':
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
    }
  };

  const renderMemberCard = (member) => (
    <div key={member.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <img
            src={member.avatar}
            alt={member.name}
            className="w-16 h-16 rounded-2xl object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
            {getStatusIcon(member.status)}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                {member.status}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditingMember(member);
                    setShowEditMemberModal(true);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => deleteMember(member.id)}
                  className="p-2 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
          <p className="text-gray-600 font-medium mb-1">{member.role}</p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {member.location}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
        <div className="flex flex-wrap gap-2">
          {member.skills.map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
        <p className="text-sm text-gray-600">{member.experience}</p>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
        <p className="text-sm text-gray-600">{member.education}</p>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">Work Style</h4>
        <p className="text-sm text-gray-600">{member.workStyle}</p>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">Availability</h4>
        <p className="text-sm text-gray-600">{member.availability}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex gap-2">
          <button className="p-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
            <Mail className="w-4 h-4" />
          </button>
          <button className="p-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
            <MessageSquare className="w-4 h-4" />
          </button>
          <button className="p-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
            <Video className="w-4 h-4" />
          </button>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Equity</p>
          <p className="font-semibold text-gray-900">{member.equity}</p>
        </div>
      </div>
    </div>
  );

  const renderAddMemberModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Add Team Member</h3>
            <button
              onClick={() => setShowAddMemberModal(false)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <input
                  type="text"
                  value={newMember.role}
                  onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g., Technical Co-founder"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={newMember.phone}
                  onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              <input
                type="text"
                value={newMember.skills.join(', ')}
                onChange={(e) => setNewMember(prev => ({ 
                  ...prev, 
                  skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                }))}
                placeholder="Enter skills separated by commas"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
              <textarea
                value={newMember.experience}
                onChange={(e) => setNewMember(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="Describe their experience"
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                <input
                  type="text"
                  value={newMember.education}
                  onChange={(e) => setNewMember(prev => ({ ...prev, education: e.target.value }))}
                  placeholder="e.g., MS Computer Science, Stanford"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={newMember.location}
                  onChange={(e) => setNewMember(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., San Francisco, CA"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={newMember.bio}
                onChange={(e) => setNewMember(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Brief bio about the team member"
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Style</label>
                <input
                  type="text"
                  value={newMember.workStyle}
                  onChange={(e) => setNewMember(prev => ({ ...prev, workStyle: e.target.value }))}
                  placeholder="e.g., Data-driven, collaborative"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select
                  value={newMember.availability}
                  onChange={(e) => setNewMember(prev => ({ ...prev, availability: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="advisor">Advisor</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Equity</label>
              <input
                type="text"
                value={newMember.equity}
                onChange={(e) => setNewMember(prev => ({ ...prev, equity: e.target.value }))}
                placeholder="e.g., 20%"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={addMember}
                className="flex-1 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Team View</h1>
                <p className="text-gray-600">Active members, roles, skills, status</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Member
            </button>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teamMembers.map(renderMemberCard)}
        </div>

        {/* Add Member Modal */}
        {showAddMemberModal && renderAddMemberModal()}
      </div>
    </div>
  );
};

export default TeamView;
