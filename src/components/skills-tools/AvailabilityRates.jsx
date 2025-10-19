import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, DollarSign, Clock, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AvailabilityRates = () => {
  const navigate = useNavigate();
  const [availability, setAvailability] = useState({
    hoursPerWeek: '40',
    preferredDays: [],
    timezone: '',
    startTime: '09:00',
    endTime: '17:00',
    hourlyRate: '',
    projectMinimum: '',
    retainerRate: '',
    rushFee: '50%',
    paymentTerms: 'Net 30',
    availableFrom: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('availabilityRates');
    if (saved) setAvailability(JSON.parse(saved));
  }, []);

  const saveAvailability = (data) => {
    setAvailability(data);
    localStorage.setItem('availabilityRates', JSON.stringify(data));
  };

  const toggleDay = (day) => {
    const days = availability.preferredDays.includes(day)
      ? availability.preferredDays.filter(d => d !== day)
      : [...availability.preferredDays, day];
    saveAvailability({ ...availability, preferredDays: days });
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Availability & Rates</h1>
          <p className="text-gray-600">Set your schedule and pricing for potential clients</p>
        </div>

        <div className="space-y-6">
          {/* Availability */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Availability</h2>
                <p className="text-sm text-gray-600">When can you work?</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Hours Per Week</label>
                <input
                  type="number"
                  value={availability.hoursPerWeek}
                  onChange={(e) => saveAvailability({ ...availability, hoursPerWeek: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Work Days</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {days.map(day => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`p-3 rounded-xl font-medium transition-all ${
                        availability.preferredDays.includes(day)
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={availability.startTime}
                    onChange={(e) => saveAvailability({ ...availability, startTime: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={availability.endTime}
                    onChange={(e) => saveAvailability({ ...availability, endTime: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <input
                    type="text"
                    value={availability.timezone}
                    onChange={(e) => saveAvailability({ ...availability, timezone: e.target.value })}
                    placeholder="PST"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available From</label>
                <input
                  type="date"
                  value={availability.availableFrom}
                  onChange={(e) => saveAvailability({ ...availability, availableFrom: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Rates */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Pricing</h2>
                <p className="text-sm text-gray-600">Your rates and terms</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={availability.hourlyRate}
                    onChange={(e) => saveAvailability({ ...availability, hourlyRate: e.target.value })}
                    placeholder="150"
                    className="flex-1 p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <span className="text-gray-600">/hr</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Minimum</label>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={availability.projectMinimum}
                    onChange={(e) => saveAvailability({ ...availability, projectMinimum: e.target.value })}
                    placeholder="5,000"
                    className="flex-1 p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Retainer</label>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={availability.retainerRate}
                    onChange={(e) => saveAvailability({ ...availability, retainerRate: e.target.value })}
                    placeholder="10,000"
                    className="flex-1 p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <span className="text-gray-600">/mo</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rush Fee</label>
                <input
                  type="text"
                  value={availability.rushFee}
                  onChange={(e) => saveAvailability({ ...availability, rushFee: e.target.value })}
                  placeholder="50%"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                <select
                  value={availability.paymentTerms}
                  onChange={(e) => saveAvailability({ ...availability, paymentTerms: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                  <option value="50% upfront">50% upfront, 50% on completion</option>
                  <option value="Milestone-based">Milestone-based</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/home')}
            className="w-full py-4 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityRates;

