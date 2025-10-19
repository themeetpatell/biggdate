import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Plus, Trash2, Mail, Phone, Building, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientManagement = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('clientManagement');
    if (saved) setClients(JSON.parse(saved));
  }, []);

  const saveClients = (data) => {
    setClients(data);
    localStorage.setItem('clientManagement', JSON.stringify(data));
  };

  const addClient = () => {
    const newClient = {
      id: Date.now(),
      name: '',
      company: '',
      email: '',
      phone: '',
      industry: '',
      totalProjects: 0,
      totalSpent: '',
      rating: 5,
      notes: ''
    };
    saveClients([...clients, newClient]);
  };

  const updateClient = (id, field, value) => {
    saveClients(clients.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeClient = (id) => {
    saveClients(clients.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Management</h1>
            <p className="text-gray-600">Track your startup clients and relationships</p>
          </div>
          <button onClick={addClient} className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Client
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clients.map(client => (
            <div key={client.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={client.name}
                    onChange={(e) => updateClient(client.id, 'name', e.target.value)}
                    placeholder="Client Name"
                    className="w-full text-xl font-bold mb-2 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400"
                  />
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={client.company}
                      onChange={(e) => updateClient(client.id, 'company', e.target.value)}
                      placeholder="Company"
                      className="flex-1 text-sm text-gray-600 bg-transparent border-none focus:outline-none placeholder-gray-400"
                    />
                  </div>
                </div>
                <button onClick={() => removeClient(client.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={client.email}
                    onChange={(e) => updateClient(client.id, 'email', e.target.value)}
                    placeholder="Email"
                    className="flex-1 text-sm p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={client.phone}
                    onChange={(e) => updateClient(client.id, 'phone', e.target.value)}
                    placeholder="Phone"
                    className="flex-1 text-sm p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Industry</label>
                  <input
                    type="text"
                    value={client.industry}
                    onChange={(e) => updateClient(client.id, 'industry', e.target.value)}
                    placeholder="Fintech"
                    className="w-full text-sm p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Total Spent</label>
                  <input
                    type="text"
                    value={client.totalSpent}
                    onChange={(e) => updateClient(client.id, 'totalSpent', e.target.value)}
                    placeholder="$10,000"
                    className="w-full text-sm p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => updateClient(client.id, 'rating', rating)}
                      className="transition-colors"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          rating <= client.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={client.notes}
                onChange={(e) => updateClient(client.id, 'notes', e.target.value)}
                placeholder="Notes about this client..."
                className="w-full h-20 p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
              />
            </div>
          ))}

          {clients.length === 0 && (
            <div className="col-span-2 text-center py-16">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No clients yet</p>
              <button onClick={addClient} className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors">
                Add Your First Client
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientManagement;

