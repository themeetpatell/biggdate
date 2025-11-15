import React, { useState, useEffect } from 'react';
import {
  Zap, Target, CheckCircle, Clock, FileText, Code,
  Palette, Layout, GitBranch, Calendar, Download,
  Eye, Play, Sparkles, ArrowRight, ArrowLeft,
  RefreshCw, Save, Share2, Settings, X, Plus,
  Image, Layers, Users, BarChart3, Rocket
} from 'lucide-react';

const ZeroToMVPBuilder = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedItems, setGeneratedItems] = useState({
    wireframes: [],
    userFlows: [],
    landingPage: null,
    prototype: null,
    uiKit: null,
    technicalArchitecture: null,
    featurePRDs: [],
    sprintSchedule: null
  });

  const [startupData, setStartupData] = useState({
    name: '',
    description: '',
    vision: '',
    targetUsers: '',
    coreFeatures: []
  });

  useEffect(() => {
    const savedData = localStorage.getItem('ideaSprintDetails');
    const vision = localStorage.getItem('whyHere');
    const values = JSON.parse(localStorage.getItem('selectedValues') || '[]');
    
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setStartupData(prev => ({
        ...prev,
        name: parsed.ideaName || '',
        description: parsed.ideaDescription || '',
        vision: vision || '',
        targetUsers: parsed.targetUsers || '',
        coreFeatures: parsed.coreFeatures || []
      }));
    } else if (vision) {
      setStartupData(prev => ({
        ...prev,
        vision: vision
      }));
    }
  }, []);

  const generateAll = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    const steps = [
      { name: 'Wireframes', key: 'wireframes', duration: 2000 },
      { name: 'User Flows', key: 'userFlows', duration: 1500 },
      { name: 'Landing Page', key: 'landingPage', duration: 2500 },
      { name: 'Prototype', key: 'prototype', duration: 2000 },
      { name: 'UI Kit', key: 'uiKit', duration: 1800 },
      { name: 'Technical Architecture', key: 'technicalArchitecture', duration: 2200 },
      { name: 'Feature PRDs', key: 'featurePRDs', duration: 2000 },
      { name: 'Sprint Schedule', key: 'sprintSchedule', duration: 1500 }
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      await new Promise(resolve => setTimeout(resolve, step.duration));
      setGenerationProgress(((i + 1) / steps.length) * 100);
      
      if (step.key === 'wireframes') {
        setGeneratedItems(prev => ({
          ...prev,
          wireframes: generateWireframes()
        }));
      } else if (step.key === 'userFlows') {
        setGeneratedItems(prev => ({
          ...prev,
          userFlows: generateUserFlows()
        }));
      } else if (step.key === 'landingPage') {
        setGeneratedItems(prev => ({
          ...prev,
          landingPage: generateLandingPage()
        }));
      } else if (step.key === 'prototype') {
        setGeneratedItems(prev => ({
          ...prev,
          prototype: generatePrototype()
        }));
      } else if (step.key === 'uiKit') {
        setGeneratedItems(prev => ({
          ...prev,
          uiKit: generateUIKit()
        }));
      } else if (step.key === 'technicalArchitecture') {
        setGeneratedItems(prev => ({
          ...prev,
          technicalArchitecture: generateTechnicalArchitecture()
        }));
      } else if (step.key === 'featurePRDs') {
        setGeneratedItems(prev => ({
          ...prev,
          featurePRDs: generateFeaturePRDs()
        }));
      } else if (step.key === 'sprintSchedule') {
        setGeneratedItems(prev => ({
          ...prev,
          sprintSchedule: generateSprintSchedule()
        }));
      }
    }

    setIsGenerating(false);
    setActiveTab('results');
  };

  const generateWireframes = () => {
    return [
      {
        id: 1,
        name: 'Home Dashboard',
        description: 'Main user interface showing key metrics and navigation',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        pages: ['Dashboard', 'Analytics', 'Settings'],
        status: 'generated'
      },
      {
        id: 2,
        name: 'User Onboarding Flow',
        description: 'Step-by-step user registration and setup process',
        image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
        pages: ['Welcome', 'Sign Up', 'Profile Setup', 'Preferences'],
        status: 'generated'
      },
      {
        id: 3,
        name: 'Core Feature Screens',
        description: 'Primary functionality screens based on your vision',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        pages: ['Feature 1', 'Feature 2', 'Feature 3'],
        status: 'generated'
      }
    ];
  };

  const generateUserFlows = () => {
    return [
      {
        id: 1,
        name: 'New User Journey',
        description: 'Complete flow from signup to first value',
        steps: ['Landing Page', 'Sign Up', 'Onboarding', 'First Action', 'Value Realization'],
        diagram: 'flow-diagram-1',
        status: 'generated'
      },
      {
        id: 2,
        name: 'Core Feature Flow',
        description: 'Primary user interaction flow',
        steps: ['Entry Point', 'Feature Access', 'Interaction', 'Completion', 'Feedback'],
        diagram: 'flow-diagram-2',
        status: 'generated'
      },
      {
        id: 3,
        name: 'Conversion Flow',
        description: 'User conversion and retention flow',
        steps: ['Discovery', 'Interest', 'Trial', 'Conversion', 'Retention'],
        diagram: 'flow-diagram-3',
        status: 'generated'
      }
    ];
  };

  const generateLandingPage = () => {
    return {
      id: 1,
      title: startupData.name || 'Your Startup',
      headline: startupData.description || 'Transform your idea into reality',
      sections: [
        { type: 'hero', content: 'Hero section with value proposition' },
        { type: 'features', content: 'Core features showcase' },
        { type: 'benefits', content: 'Key benefits and outcomes' },
        { type: 'testimonials', content: 'Social proof section' },
        { type: 'cta', content: 'Call-to-action section' }
      ],
      design: {
        colorScheme: 'Modern Dark',
        typography: 'Inter',
        layout: 'Centered',
        style: 'Minimalist'
      },
      status: 'generated',
      preview: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200'
    };
  };

  const generatePrototype = () => {
    return {
      id: 1,
      name: 'Interactive MVP Prototype',
      description: 'Clickable prototype with core user flows',
      screens: 12,
      interactions: 45,
      status: 'generated',
      preview: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200',
      tools: ['Figma', 'Prototype Export']
    };
  };

  const generateUIKit = () => {
    return {
      id: 1,
      name: 'Design System',
      description: 'Complete UI component library',
      components: [
        'Buttons', 'Forms', 'Cards', 'Navigation', 'Modals',
        'Typography', 'Colors', 'Icons', 'Spacing', 'Layouts'
      ],
      status: 'generated',
      preview: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200'
    };
  };

  const generateTechnicalArchitecture = () => {
    return {
      id: 1,
      name: 'System Architecture',
      description: 'Technical stack and infrastructure design',
      frontend: {
        framework: 'React',
        stateManagement: 'Redux',
        styling: 'Tailwind CSS',
        buildTool: 'Vite'
      },
      backend: {
        language: 'Node.js',
        framework: 'Express',
        database: 'PostgreSQL',
        cache: 'Redis'
      },
      infrastructure: {
        hosting: 'AWS/Vercel',
        cdn: 'CloudFront',
        monitoring: 'Sentry',
        analytics: 'Mixpanel'
      },
      diagram: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200',
      status: 'generated'
    };
  };

  const generateFeaturePRDs = () => {
    const features = startupData.coreFeatures.length > 0 
      ? startupData.coreFeatures 
      : ['User Authentication', 'Core Feature 1', 'Core Feature 2', 'Dashboard', 'Analytics'];
    
    return features.map((feature, index) => ({
      id: index + 1,
      name: feature,
      description: `Product Requirements Document for ${feature}`,
      sections: {
        overview: `Comprehensive overview of ${feature}`,
        userStories: [`As a user, I want to...`, `As a user, I need to...`],
        requirements: ['Functional requirements', 'Non-functional requirements'],
        acceptanceCriteria: ['Criteria 1', 'Criteria 2', 'Criteria 3'],
        technicalSpecs: 'Technical implementation details',
        timeline: '4-6 weeks'
      },
      priority: index === 0 ? 'high' : 'medium',
      status: 'generated'
    }));
  };

  const generateSprintSchedule = () => {
    return {
      id: 1,
      name: 'MVP Development Sprint Plan',
      duration: '12 weeks',
      sprints: [
        {
          id: 1,
          name: 'Sprint 1: Foundation',
          duration: '2 weeks',
          goals: ['Setup development environment', 'Design system implementation', 'Core architecture'],
          tasks: 15,
          status: 'planned'
        },
        {
          id: 2,
          name: 'Sprint 2: Core Features',
          duration: '2 weeks',
          goals: ['User authentication', 'Primary feature development', 'Database setup'],
          tasks: 18,
          status: 'planned'
        },
        {
          id: 3,
          name: 'Sprint 3: Integration',
          duration: '2 weeks',
          goals: ['API development', 'Third-party integrations', 'Testing framework'],
          tasks: 20,
          status: 'planned'
        },
        {
          id: 4,
          name: 'Sprint 4: Polish',
          duration: '2 weeks',
          goals: ['UI/UX refinement', 'Performance optimization', 'Bug fixes'],
          tasks: 12,
          status: 'planned'
        },
        {
          id: 5,
          name: 'Sprint 5: Testing',
          duration: '2 weeks',
          goals: ['Beta testing', 'User feedback collection', 'Iterations'],
          tasks: 10,
          status: 'planned'
        },
        {
          id: 6,
          name: 'Sprint 6: Launch',
          duration: '2 weeks',
          goals: ['Production deployment', 'Marketing materials', 'Launch preparation'],
          tasks: 8,
          status: 'planned'
        }
      ],
      status: 'generated'
    };
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">ZERO TO MVP Builder</h2>
            <p className="text-gray-300">Automated generation of all MVP deliverables</p>
          </div>
        </div>
        <p className="text-gray-200 text-lg mb-6">
          Transform your vision into a complete MVP package. Generate wireframes, user flows, 
          landing pages, prototypes, UI kits, technical architecture, feature PRDs, and sprint schedules 
          with one click.
        </p>
        <button
          onClick={generateAll}
          disabled={isGenerating}
          className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all flex items-center gap-3 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate All MVP Assets
            </>
          )}
        </button>
      </div>

      {isGenerating && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Generation Progress</h3>
            <span className="text-sm font-medium text-gray-600">{Math.round(generationProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gray-900 h-3 rounded-full transition-all duration-300"
              style={{ width: `${generationProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Layout, label: 'Wireframes', count: generatedItems.wireframes.length, color: 'bg-blue-500' },
          { icon: GitBranch, label: 'User Flows', count: generatedItems.userFlows.length, color: 'bg-purple-500' },
          { icon: FileText, label: 'Landing Page', count: generatedItems.landingPage ? 1 : 0, color: 'bg-green-500' },
          { icon: Play, label: 'Prototype', count: generatedItems.prototype ? 1 : 0, color: 'bg-orange-500' },
          { icon: Palette, label: 'UI Kit', count: generatedItems.uiKit ? 1 : 0, color: 'bg-pink-500' },
          { icon: Code, label: 'Architecture', count: generatedItems.technicalArchitecture ? 1 : 0, color: 'bg-indigo-500' },
          { icon: FileText, label: 'PRDs', count: generatedItems.featurePRDs.length, color: 'bg-red-500' },
          { icon: Calendar, label: 'Sprint Schedule', count: generatedItems.sprintSchedule ? 1 : 0, color: 'bg-yellow-500' }
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.label}</h3>
                  <p className="text-sm text-gray-600">{item.count} generated</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Get</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Wireframes for all key screens',
            'Complete user flow diagrams',
            'Ready-to-deploy landing page',
            'Interactive clickable prototype',
            'Full UI component library',
            'Technical architecture documentation',
            'Detailed feature PRDs',
            '12-week sprint schedule'
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWireframes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Wireframes</h2>
          <p className="text-gray-600">Visual layouts for all key screens</p>
        </div>
        <button className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export All
        </button>
      </div>

      {generatedItems.wireframes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <Layout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No wireframes generated yet. Click "Generate All MVP Assets" to start.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generatedItems.wireframes.map((wireframe) => (
            <div key={wireframe.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-100 relative">
                <img src={wireframe.image} alt={wireframe.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                    Generated
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{wireframe.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{wireframe.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {wireframe.pages.map((page, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {page}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors text-sm font-medium">
                    View Details
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderUserFlows = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Flows</h2>
          <p className="text-gray-600">Complete user journey diagrams</p>
        </div>
        <button className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export All
        </button>
      </div>

      {generatedItems.userFlows.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <GitBranch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No user flows generated yet. Click "Generate All MVP Assets" to start.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {generatedItems.userFlows.map((flow) => (
            <div key={flow.id} className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{flow.name}</h3>
                  <p className="text-sm text-gray-600">{flow.description}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Generated
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-4">
                {flow.steps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">
                      {step}
                    </div>
                    {idx < flow.steps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors text-sm font-medium">
                  View Diagram
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderLandingPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Landing Page</h2>
          <p className="text-gray-600">Ready-to-deploy marketing page</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Code
          </button>
        </div>
      </div>

      {!generatedItems.landingPage ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No landing page generated yet. Click "Generate All MVP Assets" to start.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              <img src={generatedItems.landingPage.preview} alt="Landing Page" className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{generatedItems.landingPage.title}</h3>
                  <p className="text-gray-600">{generatedItems.landingPage.headline}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Generated
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                {generatedItems.landingPage.sections.map((section, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900 capitalize mb-1">{section.type}</div>
                    <div className="text-xs text-gray-600">{section.content}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Design: </span>
                  <span className="font-medium text-gray-900">{generatedItems.landingPage.design.colorScheme}</span>
                </div>
                <div>
                  <span className="text-gray-600">Font: </span>
                  <span className="font-medium text-gray-900">{generatedItems.landingPage.design.typography}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPrototype = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Interactive Prototype</h2>
          <p className="text-gray-600">Clickable prototype with user interactions</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Play className="w-4 h-4" />
            Launch Prototype
          </button>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {!generatedItems.prototype ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No prototype generated yet. Click "Generate All MVP Assets" to start.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="aspect-video bg-gray-100 relative">
            <img src={generatedItems.prototype.preview} alt="Prototype" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <button className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center gap-3">
                <Play className="w-5 h-5" />
                Launch Interactive Prototype
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{generatedItems.prototype.name}</h3>
                <p className="text-gray-600">{generatedItems.prototype.description}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Generated
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">{generatedItems.prototype.screens}</div>
                <div className="text-sm text-gray-600">Screens</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">{generatedItems.prototype.interactions}</div>
                <div className="text-sm text-gray-600">Interactions</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Tools</div>
                <div className="text-sm font-medium text-gray-900">{generatedItems.prototype.tools.join(', ')}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderUIKit = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">UI Kit</h2>
          <p className="text-gray-600">Complete design system and component library</p>
        </div>
        <button className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download Kit
        </button>
      </div>

      {!generatedItems.uiKit ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No UI kit generated yet. Click "Generate All MVP Assets" to start.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="aspect-video bg-gray-100">
              <img src={generatedItems.uiKit.preview} alt="UI Kit" className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{generatedItems.uiKit.name}</h3>
                  <p className="text-gray-600">{generatedItems.uiKit.description}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Generated
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {generatedItems.uiKit.components.map((component, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-sm font-medium text-gray-900">{component}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTechnicalArchitecture = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Technical Architecture</h2>
          <p className="text-gray-600">System design and technology stack</p>
        </div>
        <button className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Docs
        </button>
      </div>

      {!generatedItems.technicalArchitecture ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No architecture generated yet. Click "Generate All MVP Assets" to start.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="aspect-video bg-gray-100">
              <img src={generatedItems.technicalArchitecture.diagram} alt="Architecture" className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{generatedItems.technicalArchitecture.name}</h3>
                  <p className="text-gray-600">{generatedItems.technicalArchitecture.description}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Generated
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Frontend</h4>
                  <div className="space-y-2">
                    {Object.entries(generatedItems.technicalArchitecture.frontend).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600 capitalize">{key}:</span>
                        <span className="font-medium text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Backend</h4>
                  <div className="space-y-2">
                    {Object.entries(generatedItems.technicalArchitecture.backend).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600 capitalize">{key}:</span>
                        <span className="font-medium text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Infrastructure</h4>
                  <div className="space-y-2">
                    {Object.entries(generatedItems.technicalArchitecture.infrastructure).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600 capitalize">{key}:</span>
                        <span className="font-medium text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderFeaturePRDs = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Feature PRDs</h2>
          <p className="text-gray-600">Product Requirements Documents for each feature</p>
        </div>
        <button className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export All
        </button>
      </div>

      {generatedItems.featurePRDs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No PRDs generated yet. Click "Generate All MVP Assets" to start.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {generatedItems.featurePRDs.map((prd) => (
            <div key={prd.id} className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{prd.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      prd.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {prd.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{prd.description}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Generated
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">User Stories</h4>
                  <ul className="space-y-1">
                    {prd.sections.userStories.map((story, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{story}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Timeline</h4>
                  <p className="text-sm text-gray-600">{prd.sections.timeline}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors text-sm font-medium">
                  View Full PRD
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSprintSchedule = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sprint Schedule</h2>
          <p className="text-gray-600">12-week development roadmap</p>
        </div>
        <button className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Schedule
        </button>
      </div>

      {!generatedItems.sprintSchedule ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No sprint schedule generated yet. Click "Generate All MVP Assets" to start.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{generatedItems.sprintSchedule.name}</h3>
                <p className="text-gray-600">Duration: {generatedItems.sprintSchedule.duration}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Generated
              </span>
            </div>
            <div className="space-y-4">
              {generatedItems.sprintSchedule.sprints.map((sprint) => (
                <div key={sprint.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{sprint.name}</h4>
                      <p className="text-sm text-gray-600">Duration: {sprint.duration}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{sprint.tasks} tasks</div>
                      <div className="text-xs text-gray-600 capitalize">{sprint.status}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-900">Goals:</h5>
                    <ul className="space-y-1">
                      {sprint.goals.map((goal, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderResults = () => {
    const tabs = [
      { id: 'wireframes', label: 'Wireframes', icon: Layout },
      { id: 'userFlows', label: 'User Flows', icon: GitBranch },
      { id: 'landingPage', label: 'Landing Page', icon: FileText },
      { id: 'prototype', label: 'Prototype', icon: Play },
      { id: 'uiKit', label: 'UI Kit', icon: Palette },
      { id: 'technicalArchitecture', label: 'Architecture', icon: Code },
      { id: 'featurePRDs', label: 'PRDs', icon: FileText },
      { id: 'sprintSchedule', label: 'Sprint Schedule', icon: Calendar }
    ];

    return (
      <div>
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const hasContent = 
              (tab.id === 'wireframes' && generatedItems.wireframes.length > 0) ||
              (tab.id === 'userFlows' && generatedItems.userFlows.length > 0) ||
              (tab.id === 'landingPage' && generatedItems.landingPage) ||
              (tab.id === 'prototype' && generatedItems.prototype) ||
              (tab.id === 'uiKit' && generatedItems.uiKit) ||
              (tab.id === 'technicalArchitecture' && generatedItems.technicalArchitecture) ||
              (tab.id === 'featurePRDs' && generatedItems.featurePRDs.length > 0) ||
              (tab.id === 'sprintSchedule' && generatedItems.sprintSchedule);
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white'
                    : hasContent
                    ? 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {hasContent && (
                  <CheckCircle className="w-4 h-4" />
                )}
              </button>
            );
          })}
        </div>

        {activeTab === 'wireframes' && renderWireframes()}
        {activeTab === 'userFlows' && renderUserFlows()}
        {activeTab === 'landingPage' && renderLandingPage()}
        {activeTab === 'prototype' && renderPrototype()}
        {activeTab === 'uiKit' && renderUIKit()}
        {activeTab === 'technicalArchitecture' && renderTechnicalArchitecture()}
        {activeTab === 'featurePRDs' && renderFeaturePRDs()}
        {activeTab === 'sprintSchedule' && renderSprintSchedule()}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ZERO TO MVP Builder</h1>
        <p className="text-gray-600">Automated generation of all MVP deliverables</p>
      </div>

      {activeTab === 'overview' ? renderOverview() : renderResults()}
    </div>
  );
};

export default ZeroToMVPBuilder;

