import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Star,
  Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  Edit,
  Trash2,
  X,
  Check,
  Linkedin,
  Twitter,
  UserPlus,
  TrendingUp,
  Heart,
  Zap,
  Target,
  Crown,
  Sparkles
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const stakeholderTypes = [
  { id: 'advisor', label: 'Advisor', icon: Crown, color: 'bg-purple-100 text-purple-700' },
  { id: 'investor', label: 'Investor', icon: TrendingUp, color: 'bg-green-100 text-green-700' },
  { id: 'mentor', label: 'Mentor', icon: Heart, color: 'bg-pink-100 text-pink-700' },
  { id: 'early-adopter', label: 'Early Adopter', icon: Zap, color: 'bg-yellow-100 text-yellow-700' },
  { id: 'beta-tester', label: 'Beta Tester', icon: Target, color: 'bg-blue-100 text-blue-700' },
  { id: 'supporter', label: 'Supporter', icon: Sparkles, color: 'bg-indigo-100 text-indigo-700' },
  { id: 'team-prospect', label: 'Team Prospect', icon: UserPlus, color: 'bg-orange-100 text-orange-700' }
];

const StakeholderCRM = () => {
  const [stakeholders, setStakeholders] = useState([]);
  const [stats, setStats] = useState({ total: 0, favorites: 0, upcomingFollowups: 0, byType: {} });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterFavorite, setFilterFavorite] = useState(false);

  useEffect(() => {
    fetchStakeholders();
    fetchStats();
  }, [filterType, filterFavorite, searchQuery]);

  const fetchStakeholders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filterType) params.append('type', filterType);
      if (filterFavorite) params.append('favorite', 'true');
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`${API_BASE_URL}/stakeholders?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStakeholders(data.stakeholders || []);
      }
    } catch (error) {
      console.error('Error fetching stakeholders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/stakeholders/stats/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stakeholder?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/stakeholders/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchStakeholders();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting stakeholder:', error);
    }
  };

  const handleToggleFavorite = async (stakeholder) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/stakeholders/${stakeholder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          is_favorite: !stakeholder.is_favorite
        })
      });

      if (response.ok) {
        fetchStakeholders();
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const getTypeInfo = (type) => {
    return stakeholderTypes.find(t => t.id === type) || stakeholderTypes[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-gray-600">Total Stakeholders</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.favorites}</div>
            <div className="text-gray-600">Favorites</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-3xl font-bold text-blue-600 mb-1">{stats.upcomingFollowups}</div>
            <div className="text-gray-600">Upcoming Follow-ups</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <button
              onClick={() => {
                setEditingStakeholder(null);
                setShowForm(true);
              }}
              className="w-full h-full flex items-center justify-center gap-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Stakeholder
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search stakeholders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">All Types</option>
              {stakeholderTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
            <button
              onClick={() => setFilterFavorite(!filterFavorite)}
              className={`px-6 py-3 rounded-xl border transition-colors flex items-center gap-2 ${
                filterFavorite
                  ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Star className={`w-5 h-5 ${filterFavorite ? 'fill-yellow-500' : ''}`} />
              Favorites
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        ) : stakeholders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No stakeholders yet</h3>
            <p className="text-gray-600 mb-6">Start building your network by adding your first stakeholder</p>
            <button
              onClick={() => {
                setEditingStakeholder(null);
                setShowForm(true);
              }}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors font-medium"
            >
              Add Your First Stakeholder
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stakeholders.map((stakeholder) => {
              const typeInfo = getTypeInfo(stakeholder.type);
              const TypeIcon = typeInfo.icon;
              
              return (
                <div
                  key={stakeholder.id}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl ${typeInfo.color} flex items-center justify-center`}>
                        <TypeIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{stakeholder.name}</h3>
                        <p className="text-sm text-gray-500">{typeInfo.label}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleFavorite(stakeholder)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          stakeholder.is_favorite ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    {stakeholder.company && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building className="w-4 h-4" />
                        {stakeholder.company}
                      </div>
                    )}
                    {stakeholder.title && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        {stakeholder.title}
                      </div>
                    )}
                    {stakeholder.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {stakeholder.email}
                      </div>
                    )}
                    {stakeholder.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {stakeholder.phone}
                      </div>
                    )}
                    {stakeholder.next_followup_date && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Calendar className="w-4 h-4" />
                        Follow-up: {new Date(stakeholder.next_followup_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {stakeholder.notes && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{stakeholder.notes}</p>
                  )}

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setEditingStakeholder(stakeholder);
                        setShowForm(true);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(stakeholder.id)}
                      className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showForm && (
          <StakeholderForm
            stakeholder={editingStakeholder}
            onClose={() => {
              setShowForm(false);
              setEditingStakeholder(null);
            }}
            onSave={() => {
              setShowForm(false);
              setEditingStakeholder(null);
              fetchStakeholders();
              fetchStats();
            }}
          />
        )}
      </div>
    </div>
  );
};

const StakeholderForm = ({ stakeholder, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    linkedin_url: '',
    twitter_handle: '',
    type: 'advisor',
    notes: '',
    tags: [],
    last_contact_date: '',
    next_followup_date: '',
    relationship_strength: 5,
    is_favorite: false
  });

  useEffect(() => {
    if (stakeholder) {
      setFormData({
        name: stakeholder.name || '',
        email: stakeholder.email || '',
        phone: stakeholder.phone || '',
        company: stakeholder.company || '',
        title: stakeholder.title || '',
        linkedin_url: stakeholder.linkedin_url || '',
        twitter_handle: stakeholder.twitter_handle || '',
        type: stakeholder.type || 'advisor',
        notes: stakeholder.notes || '',
        tags: Array.isArray(stakeholder.tags) ? stakeholder.tags : [],
        last_contact_date: stakeholder.last_contact_date || '',
        next_followup_date: stakeholder.next_followup_date || '',
        relationship_strength: stakeholder.relationship_strength || 5,
        is_favorite: stakeholder.is_favorite || false
      });
    }
  }, [stakeholder]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = stakeholder
        ? `${API_BASE_URL}/stakeholders/${stakeholder.id}`
        : `${API_BASE_URL}/stakeholders`;
      
      const method = stakeholder ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSave();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save stakeholder');
      }
    } catch (error) {
      console.error('Error saving stakeholder:', error);
      alert('Failed to save stakeholder');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            {stakeholder ? 'Edit Stakeholder' : 'Add New Stakeholder'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                {stakeholderTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship Strength (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.relationship_strength}
                onChange={(e) => setFormData({ ...formData, relationship_strength: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter Handle
              </label>
              <input
                type="text"
                value={formData.twitter_handle}
                onChange={(e) => setFormData({ ...formData, twitter_handle: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Contact Date
              </label>
              <input
                type="date"
                value={formData.last_contact_date}
                onChange={(e) => setFormData({ ...formData, last_contact_date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next Follow-up Date
              </label>
              <input
                type="date"
                value={formData.next_followup_date}
                onChange={(e) => setFormData({ ...formData, next_followup_date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="favorite"
              checked={formData.is_favorite}
              onChange={(e) => setFormData({ ...formData, is_favorite: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300"
            />
            <label htmlFor="favorite" className="text-sm font-medium text-gray-700">
              Mark as favorite
            </label>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors font-medium"
            >
              {stakeholder ? 'Update' : 'Create'} Stakeholder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StakeholderCRM;

