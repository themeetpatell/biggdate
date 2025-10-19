import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Plus, Trash2, DollarSign, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServicePackages = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('servicePackages');
    if (saved) setPackages(JSON.parse(saved));
  }, []);

  const savePackages = (data) => {
    setPackages(data);
    localStorage.setItem('servicePackages', JSON.stringify(data));
  };

  const addPackage = () => {
    const newPkg = {
      id: Date.now(),
      name: '',
      description: '',
      price: '',
      deliveryTime: '',
      deliverables: [],
      revisions: '2'
    };
    savePackages([...packages, newPkg]);
  };

  const updatePackage = (id, field, value) => {
    savePackages(packages.map(pkg => pkg.id === id ? { ...pkg, [field]: value } : pkg));
  };

  const removePackage = (id) => {
    savePackages(packages.filter(pkg => pkg.id !== id));
  };

  const addDeliverable = (pkgId) => {
    savePackages(packages.map(pkg =>
      pkg.id === pkgId ? { ...pkg, deliverables: [...pkg.deliverables, ''] } : pkg
    ));
  };

  const updateDeliverable = (pkgId, index, value) => {
    savePackages(packages.map(pkg =>
      pkg.id === pkgId
        ? { ...pkg, deliverables: pkg.deliverables.map((d, i) => i === index ? value : d) }
        : pkg
    ));
  };

  const removeDeliverable = (pkgId, index) => {
    savePackages(packages.map(pkg =>
      pkg.id === pkgId
        ? { ...pkg, deliverables: pkg.deliverables.filter((_, i) => i !== index) }
        : pkg
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Packages</h1>
            <p className="text-gray-600">Define your service offerings for startups</p>
          </div>
          <button onClick={addPackage} className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Package
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map(pkg => (
            <div key={pkg.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Package className="w-6 h-6 text-gray-900" />
                <button onClick={() => removePackage(pkg.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <input
                type="text"
                value={pkg.name}
                onChange={(e) => updatePackage(pkg.id, 'name', e.target.value)}
                placeholder="Package Name (e.g., MVP Development)"
                className="w-full text-xl font-bold mb-3 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400"
              />

              <textarea
                value={pkg.description}
                onChange={(e) => updatePackage(pkg.id, 'description', e.target.value)}
                placeholder="Package description..."
                className="w-full h-24 p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none mb-4"
              />

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                  <DollarSign className="w-4 h-4 text-gray-600" />
                  <input
                    type="text"
                    value={pkg.price}
                    onChange={(e) => updatePackage(pkg.id, 'price', e.target.value)}
                    placeholder="Price"
                    className="flex-1 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <input
                    type="text"
                    value={pkg.deliveryTime}
                    onChange={(e) => updatePackage(pkg.id, 'deliveryTime', e.target.value)}
                    placeholder="Delivery"
                    className="flex-1 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Deliverables</span>
                  <button onClick={() => addDeliverable(pkg.id)} className="text-xs text-gray-600 hover:text-gray-900">
                    + Add
                  </button>
                </div>
                <div className="space-y-2">
                  {pkg.deliverables?.map((del, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={del}
                        onChange={(e) => updateDeliverable(pkg.id, index, e.target.value)}
                        placeholder="Deliverable..."
                        className="flex-1 text-sm p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                      <button onClick={() => removeDeliverable(pkg.id, index)} className="text-gray-400 hover:text-red-600">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <input
                  type="text"
                  value={pkg.revisions}
                  onChange={(e) => updatePackage(pkg.id, 'revisions', e.target.value)}
                  placeholder="Revisions"
                  className="w-full text-sm p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>
          ))}

          {packages.length === 0 && (
            <div className="col-span-2 text-center py-16">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No service packages yet</p>
              <button onClick={addPackage} className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors">
                Create Your First Package
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicePackages;

