import React, { useState } from 'react';
import { 
  Brain, 
  Layout, 
  Target, 
  Presentation, 
  MessageCircle, 
  Sparkles,
  PenTool,
  Handshake
} from 'lucide-react';
import CoThink from './CoThink';
import CoWrite from './CoWrite';
import CoDesign from './CoDesign';
import CoPlan from './CoPlan';
import CoScript from './CoScript';
import CoCoach from './CoCoach';
import CoSolve from './CoSolve';

const AICoFounder = () => {
  const [activeView, setActiveView] = useState('cothink');

  const capabilities = [
    {
      id: 'cothink',
      title: 'Co-Think',
      icon: Brain,
      color: 'from-purple-500 to-indigo-600',
      component: CoThink
    },
    {
      id: 'cowrite',
      title: 'Co-Write',
      icon: PenTool,
      color: 'from-blue-500 to-cyan-600',
      component: CoWrite
    },
    {
      id: 'codesign',
      title: 'Co-Design',
      icon: Layout,
      color: 'from-green-500 to-emerald-600',
      component: CoDesign
    },
    {
      id: 'coplan',
      title: 'Co-Plan',
      icon: Target,
      color: 'from-orange-500 to-red-600',
      component: CoPlan
    },
    {
      id: 'coscript',
      title: 'Co-Script',
      icon: Presentation,
      color: 'from-pink-500 to-rose-600',
      component: CoScript
    },
    {
      id: 'cocoach',
      title: 'Co-Coach',
      icon: MessageCircle,
      color: 'from-teal-500 to-blue-600',
      component: CoCoach
    },
    {
      id: 'cosolve',
      title: 'Co-Solve',
      icon: Handshake,
      color: 'from-amber-500 to-yellow-600',
      component: CoSolve
    }
  ];

  const activeCapability = capabilities.find(cap => cap.id === activeView);
  const ActiveComponent = activeCapability?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100 mb-8">
          <div className="flex space-x-2 overflow-x-auto">
            {capabilities.map((capability) => {
              const Icon = capability.icon;
              const isActive = activeView === capability.id;
              
              return (
                <button
                  key={capability.id}
                  onClick={() => setActiveView(capability.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? `bg-gradient-to-r ${capability.color} text-white shadow-lg`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {capability.title}
                </button>
              );
            })}
          </div>
        </div>

        {ActiveComponent && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <ActiveComponent onBack={() => {}} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AICoFounder;

