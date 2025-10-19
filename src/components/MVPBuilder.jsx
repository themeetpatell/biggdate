import React, { useState, useEffect } from 'react';
import { 
  Code, Palette, BarChart3, Globe, Users, Shield, 
  Play, Pause, Square, RotateCcw, Save, Download,
  Upload, Eye, EyeOff, Settings, Zap, Target, CheckCircle,
  Clock, AlertCircle, Info, HelpCircle, ChevronRight,
  ChevronDown, ChevronUp, ArrowRight, ArrowLeft,
  ArrowUp, ArrowDown, Maximize2, Minimize2, RotateCw,
  ZoomIn, ZoomOut, Move, Copy, Scissors, Trash2,
  Link, Link2, Unlink, Key, KeyRound, ShieldCheck,
  ShieldAlert, AlertTriangle, AlertOctagon, CheckCircle2,
  XCircle, PlusCircle, MinusCircle, Building2, DollarSign,
  Instagram, Twitter, Linkedin, Github, ExternalLink,
  Coffee, Plane, Gamepad2, BookOpen, Activity, Compass,
  Badge, Gift, Bell, BellOff, Search, SortAsc, SortDesc,
  RefreshCw, Heart, Bookmark, Flag, MoreHorizontal,
  MessageCircle, Send, Phone, Video, Mic, MicOff,
  Camera, Volume2, VolumeX, ThumbsUp, ThumbsDown,
  Star, Crown, Diamond, Flame, Rocket, Sparkles,
  TrendingUp, Award, Globe as GlobeIcon, Moon, Sun
} from 'lucide-react';

const MVPBuilder = () => {
  const [activeTab, setActiveTab] = useState('code');
  const [code, setCode] = useState(`// Welcome to your MVP Builder!
// Start building your startup here

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>My Startup MVP</h1>
        <button onClick={fetchUsers} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Users'}
        </button>
      </header>
      <main>
        {users.map(user => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;`);

  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState([]);

  const tabs = [
    { id: 'code', label: 'Code Editor', icon: Code },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'deploy', label: 'Deploy', icon: Globe },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'testing', label: 'Testing', icon: Shield }
  ];

  const features = [
    {
      title: 'Real-time Code Editor',
      description: 'Write and edit code with syntax highlighting',
      icon: Code,
      status: 'active'
    },
    {
      title: 'Live Preview',
      description: 'See your changes instantly',
      icon: Eye,
      status: 'active'
    },
    {
      title: 'Version Control',
      description: 'Track changes and collaborate',
      icon: GitBranch,
      status: 'pending'
    },
    {
      title: 'Database Integration',
      description: 'Connect to your database',
      icon: Database,
      status: 'pending'
    },
    {
      title: 'API Testing',
      description: 'Test your APIs in real-time',
      icon: Zap,
      status: 'pending'
    },
    {
      title: 'Performance Monitoring',
      description: 'Monitor app performance',
      icon: Activity,
      status: 'pending'
    }
  ];

  const handleRun = () => {
    setIsRunning(true);
    setOutput('Starting development server...\n');
    
    // Simulate running the code
    setTimeout(() => {
      setOutput(prev => prev + '✓ Server started on http://localhost:3000\n');
      setOutput(prev => prev + '✓ Hot reload enabled\n');
      setOutput(prev => prev + '✓ Ready for development\n');
      setIsRunning(false);
    }, 2000);
  };

  const handleStop = () => {
    setIsRunning(false);
    setOutput(prev => prev + '\n✓ Server stopped\n');
  };

  const renderCodeEditor = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-gray-900">Code Editor</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Connected</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Running' : 'Run'}
          </button>
          <button
            onClick={handleStop}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Stop
          </button>
          <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex">
        <div className="flex-1">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm border-0 resize-none focus:outline-none"
            placeholder="Start coding your MVP..."
            style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
          />
        </div>
        
        <div className="w-1/3 border-l border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-semibold text-gray-900">Output</h4>
          </div>
          <div className="p-4 h-full">
            <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono">
              {output || 'No output yet. Click Run to start your development server.'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDesign = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Design Tools</h3>
      </div>
      
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">UI Components</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer">
                <div className="w-full h-16 bg-gray-100 rounded mb-2"></div>
                <p className="text-sm font-medium">Button</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer">
                <div className="w-full h-16 bg-gray-100 rounded mb-2"></div>
                <p className="text-sm font-medium">Input</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer">
                <div className="w-full h-16 bg-gray-100 rounded mb-2"></div>
                <p className="text-sm font-medium">Card</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer">
                <div className="w-full h-16 bg-gray-100 rounded mb-2"></div>
                <p className="text-sm font-medium">Modal</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Color Palette</h4>
            <div className="grid grid-cols-4 gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-lg cursor-pointer"></div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg cursor-pointer"></div>
              <div className="w-12 h-12 bg-green-500 rounded-lg cursor-pointer"></div>
              <div className="w-12 h-12 bg-red-500 rounded-lg cursor-pointer"></div>
              <div className="w-12 h-12 bg-yellow-500 rounded-lg cursor-pointer"></div>
              <div className="w-12 h-12 bg-pink-500 rounded-lg cursor-pointer"></div>
              <div className="w-12 h-12 bg-indigo-500 rounded-lg cursor-pointer"></div>
              <div className="w-12 h-12 bg-gray-500 rounded-lg cursor-pointer"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Live Preview</h3>
      </div>
      
      <div className="flex-1 p-6">
        <div className="bg-white border border-gray-200 rounded-lg h-full">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="ml-4 text-sm text-gray-600">http://localhost:3000</span>
            </div>
          </div>
          <div className="p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">My Startup MVP</h1>
              <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Fetch Users
              </button>
              <div className="mt-6 text-gray-500">
                <p>Your MVP preview will appear here</p>
                <p className="text-sm">Start coding to see live changes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeploy = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Deployment</h3>
      </div>
      
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Deployment Options</h4>
            <div className="space-y-3">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="font-medium">Vercel</p>
                    <p className="text-sm text-gray-600">Instant deployment</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="font-medium">Netlify</p>
                    <p className="text-sm text-gray-600">Static site hosting</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-purple-500" />
                  <div>
                    <p className="font-medium">AWS</p>
                    <p className="text-sm text-gray-600">Full cloud platform</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Deployment Status</h4>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium">Not Deployed</span>
              </div>
              <p className="text-sm text-gray-600">Ready to deploy your MVP</p>
              <button className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                Deploy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Analytics</h3>
      </div>
      
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Users</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Page Views</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Sessions</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Performance Metrics</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Load Time</span>
              <span className="text-sm font-medium">--</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="text-sm font-medium">--</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Error Rate</span>
              <span className="text-sm font-medium">--</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTesting = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Testing Suite</h3>
      </div>
      
      <div className="flex-1 p-6">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Unit Tests</h4>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Run Tests
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">App component renders</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Button click handler works</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">API integration test</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Security Tests</h4>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                Scan
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm">No vulnerabilities found</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm">HTTPS enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">MVP Builder</h2>
            <p className="text-sm text-gray-600">Build, test, and deploy your startup MVP</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Online</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'code' && renderCodeEditor()}
        {activeTab === 'design' && renderDesign()}
        {activeTab === 'preview' && renderPreview()}
        {activeTab === 'deploy' && renderDeploy()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'testing' && renderTesting()}
      </div>
    </div>
  );
};

export default MVPBuilder;
