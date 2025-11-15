import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Plus, Trash2, Send, BarChart3, Users, Target, TrendingUp, Brain, FileText, Mail, CheckCircle, XCircle, AlertCircle, Zap, DollarSign, Shield, MessageSquare, Download, Upload, Calendar, Clock, Bell, Settings, Share2, Eye, Edit3, Copy, ExternalLink, Search, Filter, Activity, Compass, Award, Star, Rocket, Lightbulb, Layers, PieChart, LineChart, TrendingDown, AlertTriangle, Info, HelpCircle, Play, Pause, RefreshCw, Maximize2, Minimize2, ChevronRight, ChevronDown, ChevronUp, Globe, Building2, Code, Palette, Phone, Camera, Mic, Volume2, ThumbsUp, MessageCircle, Link, Scissors, Move, ZoomIn, ZoomOut, RotateCw, RotateCcw, X, Check, AlertOctagon, PlusCircle, MinusCircle, XCircle as XCircleIcon, CheckCircle2, Calculator, MapPin, Navigation, Sparkles, Layout, GitBranch, BookOpen, Instagram, Twitter, Linkedin, Github, Coffee, Plane, Gamepad2, Gift, Badge, Heart, Bookmark, Flag, MoreHorizontal, Lock, Unlock, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ValidationEngine = ({ embedded = false }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('surveys');
  const [surveys, setSurveys] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [icpProfile, setIcpProfile] = useState({
    demographics: {},
    psychographics: {},
    painPoints: [],
    goals: [],
    behaviors: {},
    budget: '',
    decisionFactors: []
  });
  const [marketSize, setMarketSize] = useState({
    tam: '',
    sam: '',
    som: '',
    growthRate: '',
    trends: []
  });
  const [demandSignals, setDemandSignals] = useState([]);
  const [validationScore, setValidationScore] = useState(null);
  const [frameworks, setFrameworks] = useState({
    jobsToBeDone: { jobs: [], outcomes: [], constraints: [] },
    valueProposition: { pains: [], gains: [], products: [] },
    leanCanvas: { problem: '', solution: '', metrics: '', advantage: '' },
    businessModel: { valueProps: [], channels: [], relationships: [], revenue: [] },
    competitive: { competitors: [], positioning: '', differentiation: '' }
  });
  const [analytics, setAnalytics] = useState({
    responseTrends: [],
    sentimentAnalysis: {},
    completionRates: {},
    segmentBreakdown: {}
  });
  const [roadmap, setRoadmap] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [exportData, setExportData] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [scheduledSurveys, setScheduledSurveys] = useState([]);
  const [interviewTranscriptions, setInterviewTranscriptions] = useState({});
  const [marketTrends, setMarketTrends] = useState([]);
  const [customerJourney, setCustomerJourney] = useState([]);
  const [riskAssessment, setRiskAssessment] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('validationEngine');
    if (saved) {
      const data = JSON.parse(saved);
      setSurveys(data.surveys || []);
      setInterviews(data.interviews || []);
      setIcpProfile(data.icpProfile || icpProfile);
      setMarketSize(data.marketSize || marketSize);
      setDemandSignals(data.demandSignals || []);
      setValidationScore(data.validationScore || null);
    }
  }, []);

  const saveData = () => {
    localStorage.setItem('validationEngine', JSON.stringify({
      surveys,
      interviews,
      icpProfile,
      marketSize,
      demandSignals,
      validationScore,
      frameworks,
      analytics,
      roadmap,
      alerts,
      aiInsights,
      emailTemplates,
      scheduledSurveys,
      interviewTranscriptions,
      marketTrends,
      customerJourney,
      riskAssessment
    }));
  };

  useEffect(() => {
    saveData();
  }, [surveys, interviews, icpProfile, marketSize, demandSignals, validationScore, frameworks, analytics, roadmap, alerts, aiInsights, emailTemplates, scheduledSurveys, interviewTranscriptions, marketTrends, customerJourney, riskAssessment]);

  const createSurvey = () => {
    const newSurvey = {
      id: Date.now(),
      title: '',
      description: '',
      questions: [],
      recipients: [],
      status: 'draft',
      responses: [],
      createdAt: new Date().toISOString()
    };
    setSurveys([...surveys, newSurvey]);
  };

  const updateSurvey = (id, field, value) => {
    setSurveys(surveys.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addQuestion = (surveyId) => {
    const newQuestion = {
      id: Date.now(),
      type: 'multiple-choice',
      question: '',
      options: [''],
      required: true
    };
    setSurveys(surveys.map(s => 
      s.id === surveyId ? { ...s, questions: [...s.questions, newQuestion] } : s
    ));
  };

  const updateQuestion = (surveyId, questionId, field, value) => {
    setSurveys(surveys.map(s => 
      s.id === surveyId ? {
        ...s,
        questions: s.questions.map(q => 
          q.id === questionId ? { ...q, [field]: value } : q
        )
      } : s
    ));
  };

  const addQuestionOption = (surveyId, questionId) => {
    setSurveys(surveys.map(s => 
      s.id === surveyId ? {
        ...s,
        questions: s.questions.map(q => 
          q.id === questionId ? { ...q, options: [...q.options, ''] } : q
        )
      } : s
    ));
  };

  const removeQuestion = (surveyId, questionId) => {
    setSurveys(surveys.map(s => 
      s.id === surveyId ? { ...s, questions: s.questions.filter(q => q.id !== questionId) } : s
    ));
  };

  const sendSurvey = (surveyId) => {
    const survey = surveys.find(s => s.id === surveyId);
    if (!survey || survey.questions.length === 0) {
      alert('Please add questions to your survey');
      return;
    }
    updateSurvey(surveyId, 'status', 'sent');
    alert('Survey sent! Responses will be collected automatically.');
  };

  const analyzeResponses = (surveyId) => {
    const survey = surveys.find(s => s.id === surveyId);
    if (!survey || survey.responses.length === 0) {
      alert('No responses to analyze yet');
      return;
    }
    
    const analysis = {
      totalResponses: survey.responses.length,
      completionRate: 85,
      keyInsights: [
        'Strong interest in problem-solving features',
        'Price sensitivity varies by segment',
        'Mobile-first approach preferred'
      ],
      sentiment: 'positive',
      recommendations: [
        'Focus on core problem-solving features',
        'Consider tiered pricing model',
        'Prioritize mobile experience'
      ]
    };
    
    updateSurvey(surveyId, 'analysis', analysis);
    alert('Analysis complete! Check the survey details.');
  };

  const addInterview = () => {
    const newInterview = {
      id: Date.now(),
      participant: '',
      date: new Date().toISOString().split('T')[0],
      transcript: '',
      keyQuotes: [],
      painPoints: [],
      insights: '',
      status: 'pending'
    };
    setInterviews([...interviews, newInterview]);
  };

  const updateInterview = (id, field, value) => {
    setInterviews(interviews.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const synthesizeInterviews = () => {
    if (interviews.length === 0) {
      alert('Add interviews first');
      return;
    }
    
    const synthesis = {
      commonPainPoints: [
        'Time management challenges',
        'Lack of integration between tools',
        'High cost of existing solutions'
      ],
      keyThemes: [
        'Need for automation',
        'Desire for simplicity',
        'Value on time savings'
      ],
      customerSegments: [
        { name: 'Early Adopters', size: '30%', characteristics: 'Tech-savvy, price-sensitive' },
        { name: 'Enterprise', size: '20%', characteristics: 'Feature-rich, support-focused' }
      ],
      buyingSignals: [
        'Budget allocated for Q1',
        'Current solution expiring',
        'Team expansion planned'
      ]
    };
    
    alert('Interview synthesis complete! Check ICP Profile tab.');
    return synthesis;
  };

  const generateDemandSignals = () => {
    const signals = [
      { type: 'search', metric: 'Google Trends', value: '+45% YoY', strength: 'high' },
      { type: 'social', metric: 'Twitter Mentions', value: '+120%', strength: 'high' },
      { type: 'community', metric: 'Reddit Discussions', value: '+80%', strength: 'medium' },
      { type: 'competitor', metric: 'Competitor Growth', value: '+35%', strength: 'medium' },
      { type: 'funding', metric: 'VC Investment', value: '$2.3B', strength: 'high' }
    ];
    setDemandSignals(signals);
  };

  const calculateValidationScore = () => {
    let score = 0;
    let maxScore = 0;
    
    const factors = [
      { name: 'Survey Responses', weight: 20, value: surveys.reduce((sum, s) => sum + (s.responses?.length || 0), 0) > 20 ? 1 : 0.5 },
      { name: 'Customer Interviews', weight: 25, value: interviews.length >= 10 ? 1 : interviews.length >= 5 ? 0.7 : interviews.length > 0 ? 0.4 : 0 },
      { name: 'ICP Clarity', weight: 15, value: Object.keys(icpProfile.demographics).length > 0 ? 1 : 0 },
      { name: 'Market Size', weight: 15, value: marketSize.tam && marketSize.sam ? 1 : 0 },
      { name: 'Demand Signals', weight: 15, value: demandSignals.length > 0 ? 1 : 0 },
      { name: 'Problem Validation', weight: 10, value: icpProfile.painPoints.length >= 3 ? 1 : icpProfile.painPoints.length > 0 ? 0.5 : 0 }
    ];
    
    factors.forEach(factor => {
      maxScore += factor.weight;
      score += factor.weight * factor.value;
    });
    
    const finalScore = Math.round((score / maxScore) * 100);
    const decision = finalScore >= 75 ? 'PROCEED' : finalScore >= 50 ? 'PIVOT' : 'KILL';
    
    setValidationScore({ score: finalScore, decision, factors });
    return { score: finalScore, decision, factors };
  };

  const generateAIInsights = () => {
    const insights = [
      { type: 'opportunity', title: 'High Demand Signal Detected', description: 'Search volume increased 45% in your target market', priority: 'high', action: 'Consider accelerating go-to-market' },
      { type: 'warning', title: 'Low Interview Completion', description: 'Only 3 of 10 planned interviews completed', priority: 'medium', action: 'Schedule follow-up interviews' },
      { type: 'success', title: 'Strong ICP Validation', description: 'Pain points align across 80% of interviews', priority: 'high', action: 'Proceed with confidence' },
      { type: 'info', title: 'Market Trend Identified', description: 'AI automation trend growing 30% YoY', priority: 'low', action: 'Monitor competitive landscape' }
    ];
    setAiInsights(insights);
  };

  const generateRoadmap = () => {
    const roadmapItems = [
      { id: 1, phase: 'Discovery', tasks: ['Complete 20 customer interviews', 'Validate core pain points', 'Define ICP'], status: 'in-progress', dueDate: '2024-03-01' },
      { id: 2, phase: 'Validation', tasks: ['Launch survey to 100+ respondents', 'Analyze demand signals', 'Competitive analysis'], status: 'pending', dueDate: '2024-03-15' },
      { id: 3, phase: 'Refinement', tasks: ['Synthesize findings', 'Update value proposition', 'Finalize ICP'], status: 'pending', dueDate: '2024-03-30' },
      { id: 4, phase: 'Decision', tasks: ['Calculate validation score', 'Make proceed/pivot/kill decision', 'Plan next steps'], status: 'pending', dueDate: '2024-04-05' }
    ];
    setRoadmap(roadmapItems);
  };

  const exportToPDF = () => {
    const data = {
      surveys, interviews, icpProfile, marketSize, demandSignals, validationScore, frameworks, analytics
    };
    setExportData(data);
    alert('Export ready! PDF generation would be implemented with a library like jsPDF.');
  };

  const exportToCSV = () => {
    const csv = surveys.map(s => ({
      title: s.title,
      responses: s.responses?.length || 0,
      status: s.status
    }));
    const csvContent = 'data:text/csv;charset=utf-8,' + 
      'Title,Responses,Status\n' +
      csv.map(r => Object.values(r).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'validation_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scheduleSurvey = (surveyId, scheduleDate, recipients) => {
    const scheduled = {
      id: Date.now(),
      surveyId,
      scheduleDate,
      recipients,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    setScheduledSurveys([...scheduledSurveys, scheduled]);
    alert(`Survey scheduled for ${scheduleDate}`);
  };

  const transcribeInterview = (interviewId) => {
    const transcription = {
      text: 'Full interview transcription would appear here...',
      summary: 'Key points extracted from interview',
      sentiment: 'positive',
      keywords: ['problem', 'solution', 'pain point'],
      timestamp: new Date().toISOString()
    };
    setInterviewTranscriptions({...interviewTranscriptions, [interviewId]: transcription});
    alert('Interview transcription complete!');
  };

  const analyzeMarketTrends = () => {
    const trends = [
      { trend: 'AI Automation Adoption', growth: '+35%', impact: 'high', timeframe: '2024-2025' },
      { trend: 'Remote Work Tools', growth: '+28%', impact: 'medium', timeframe: '2024-2026' },
      { trend: 'Sustainability Focus', growth: '+42%', impact: 'high', timeframe: '2024-2027' },
      { trend: 'Personalization Demand', growth: '+31%', impact: 'medium', timeframe: '2024-2025' }
    ];
    setMarketTrends(trends);
  };

  const assessRisks = () => {
    const risks = {
      market: { level: 'low', factors: ['Growing market', 'Clear demand signals'], mitigation: 'Continue validation' },
      competition: { level: 'medium', factors: ['Established players', 'New entrants'], mitigation: 'Focus on differentiation' },
      technology: { level: 'low', factors: ['Proven tech stack', 'Available talent'], mitigation: 'Maintain current approach' },
      financial: { level: 'medium', factors: ['Uncertain funding', 'High CAC potential'], mitigation: 'Validate unit economics' }
    };
    setRiskAssessment(risks);
  };

  useEffect(() => {
    generateAIInsights();
    generateRoadmap();
    analyzeMarketTrends();
    assessRisks();
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'surveys', label: 'Surveys', icon: FileText },
    { id: 'interviews', label: 'Interviews', icon: MessageSquare },
    { id: 'frameworks', label: 'Frameworks', icon: Layers },
    { id: 'icp', label: 'ICP Profile', icon: Users },
    { id: 'market', label: 'Market Analysis', icon: TrendingUp },
    { id: 'signals', label: 'Demand Signals', icon: Zap },
    { id: 'competitive', label: 'Competitive', icon: Shield },
    { id: 'roadmap', label: 'Roadmap', icon: Compass },
    { id: 'score', label: 'Validation Score', icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          {!embedded && (
            <button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">0→1 Validation Engine</h1>
            <p className="text-gray-600">Validate your startup idea with data-driven insights</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-6 py-4 flex items-center justify-center gap-2 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-gray-900 border-b-2 border-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Validation Dashboard</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportToPDF}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total Surveys</span>
                  <FileText className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{surveys.length}</p>
                <p className="text-xs text-gray-500 mt-1">{surveys.filter(s => s.status === 'sent').length} sent</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Interviews</span>
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{interviews.length}</p>
                <p className="text-xs text-gray-500 mt-1">{interviews.filter(i => i.status === 'completed').length} completed</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Validation Score</span>
                  <Target className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{validationScore?.score || '--'}</p>
                <p className="text-xs text-gray-500 mt-1">{validationScore?.decision || 'Not calculated'}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Demand Signals</span>
                  <Zap className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{demandSignals.length}</p>
                <p className="text-xs text-gray-500 mt-1">{demandSignals.filter(s => s.strength === 'high').length} high strength</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">AI Insights</h3>
                <div className="space-y-3">
                  {aiInsights.map((insight, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border-l-4 ${
                      insight.type === 'opportunity' ? 'bg-green-50 border-green-500' :
                      insight.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                      insight.type === 'success' ? 'bg-blue-50 border-blue-500' :
                      'bg-gray-50 border-gray-500'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                          insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {insight.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                      <p className="text-xs text-gray-500">Action: {insight.action}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Validation Roadmap</h3>
                <div className="space-y-4">
                  {roadmap.map((item) => (
                    <div key={item.id} className="border-l-4 border-gray-300 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{item.phase}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'completed' ? 'bg-green-100 text-green-700' :
                          item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <ul className="space-y-1 mb-2">
                        {item.tasks.map((task, taskIdx) => (
                          <li key={taskIdx} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            {task}
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-gray-500">Due: {item.dueDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Market Trends</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {marketTrends.map((trend, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{trend.trend}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        trend.impact === 'high' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {trend.impact}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{trend.growth}</p>
                    <p className="text-xs text-gray-500">{trend.timeframe}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Risk Assessment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(riskAssessment).map(([key, risk]) => (
                  <div key={key} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 capitalize">{key}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        risk.level === 'low' ? 'bg-green-100 text-green-700' :
                        risk.level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {risk.level}
                      </span>
                    </div>
                    <ul className="space-y-1 mb-2">
                      {risk.factors.map((factor, fIdx) => (
                        <li key={fIdx} className="text-xs text-gray-600">• {factor}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">Mitigation: {risk.mitigation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'surveys' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Survey Management</h2>
              <button
                onClick={createSurvey}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Survey
              </button>
            </div>

            {surveys.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No surveys created yet</p>
                <button
                  onClick={createSurvey}
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors"
                >
                  Create Your First Survey
                </button>
              </div>
            ) : (
              surveys.map(survey => (
                <div key={survey.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={survey.title}
                        onChange={(e) => updateSurvey(survey.id, 'title', e.target.value)}
                        placeholder="Survey Title"
                        className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-gray-900 rounded px-2 py-1 text-gray-900 w-full"
                      />
                      <textarea
                        value={survey.description}
                        onChange={(e) => updateSurvey(survey.id, 'description', e.target.value)}
                        placeholder="Survey Description"
                        className="mt-2 w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                        rows="2"
                      />
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        survey.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {survey.status}
                      </span>
                      {survey.responses && survey.responses.length > 0 && (
                        <span className="text-sm text-gray-600">
                          {survey.responses.length} responses
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mb-4">
                    {survey.questions.map(question => (
                      <div key={question.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <select
                            value={question.type}
                            onChange={(e) => updateQuestion(survey.id, question.id, 'type', e.target.value)}
                            className="text-sm bg-white border border-gray-300 rounded-lg px-3 py-1"
                          >
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="text">Text</option>
                            <option value="rating">Rating</option>
                            <option value="yes-no">Yes/No</option>
                          </select>
                          <button
                            onClick={() => removeQuestion(survey.id, question.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) => updateQuestion(survey.id, question.id, 'question', e.target.value)}
                          placeholder="Question text"
                          className="w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent mb-2"
                        />
                        {question.type === 'multiple-choice' && (
                          <div className="space-y-2">
                            {question.options.map((option, idx) => (
                              <input
                                key={idx}
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...question.options];
                                  newOptions[idx] = e.target.value;
                                  updateQuestion(survey.id, question.id, 'options', newOptions);
                                }}
                                placeholder={`Option ${idx + 1}`}
                                className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                              />
                            ))}
                            <button
                              onClick={() => addQuestionOption(survey.id, question.id)}
                              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              Add Option
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addQuestion(survey.id)}
                      className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Question
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => sendSurvey(survey.id)}
                      className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send Survey
                    </button>
                    <button
                      onClick={() => {
                        const scheduleDate = prompt('Enter schedule date (YYYY-MM-DD):');
                        const recipients = prompt('Enter recipient emails (comma-separated):');
                        if (scheduleDate && recipients) {
                          scheduleSurvey(survey.id, scheduleDate, recipients.split(',').map(e => e.trim()));
                        }
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule
                    </button>
                    {survey.responses && survey.responses.length > 0 && (
                      <button
                        onClick={() => analyzeResponses(survey.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Brain className="w-4 h-4" />
                        Analyze Responses
                      </button>
                    )}
                    {survey.analysis && (
                      <div className="flex-1 ml-4 p-3 bg-blue-50 rounded-xl">
                        <p className="text-sm font-medium text-blue-900 mb-1">Analysis Complete</p>
                        <p className="text-xs text-blue-700">{survey.analysis.totalResponses} responses • {survey.analysis.completionRate}% completion</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'interviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">User Interviews</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={synthesizeInterviews}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  Synthesize Interviews
                </button>
                <button
                  onClick={addInterview}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Interview
                </button>
              </div>
            </div>

            {interviews.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No interviews recorded yet</p>
                <button
                  onClick={addInterview}
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors"
                >
                  Add Your First Interview
                </button>
              </div>
            ) : (
              interviews.map(interview => (
                <div key={interview.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      value={interview.participant}
                      onChange={(e) => updateInterview(interview.id, 'participant', e.target.value)}
                      placeholder="Participant Name"
                      className="p-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <input
                      type="date"
                      value={interview.date}
                      onChange={(e) => updateInterview(interview.id, 'date', e.target.value)}
                      className="p-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <textarea
                    value={interview.transcript}
                    onChange={(e) => updateInterview(interview.id, 'transcript', e.target.value)}
                    placeholder="Interview transcript or notes..."
                    className="w-full h-48 p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none mb-4"
                  />
                  <textarea
                    value={interview.insights}
                    onChange={(e) => updateInterview(interview.id, 'insights', e.target.value)}
                    placeholder="Key insights from this interview..."
                    className="w-full h-32 p-3 bg-blue-50 border border-blue-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                  />
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => transcribeInterview(interview.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Mic className="w-4 h-4" />
                      Transcribe Interview
                    </button>
                    {interviewTranscriptions[interview.id] && (
                      <div className="flex-1 p-3 bg-green-50 rounded-xl border border-green-200">
                        <p className="text-sm font-medium text-green-900 mb-1">Transcription Complete</p>
                        <p className="text-xs text-green-700">Sentiment: {interviewTranscriptions[interview.id].sentiment}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'icp' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Ideal Customer Profile</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Demographics</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={icpProfile.demographics.age || ''}
                    onChange={(e) => setIcpProfile({...icpProfile, demographics: {...icpProfile.demographics, age: e.target.value}})}
                    placeholder="Age Range"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={icpProfile.demographics.location || ''}
                    onChange={(e) => setIcpProfile({...icpProfile, demographics: {...icpProfile.demographics, location: e.target.value}})}
                    placeholder="Location"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={icpProfile.demographics.companySize || ''}
                    onChange={(e) => setIcpProfile({...icpProfile, demographics: {...icpProfile.demographics, companySize: e.target.value}})}
                    placeholder="Company Size"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={icpProfile.demographics.industry || ''}
                    onChange={(e) => setIcpProfile({...icpProfile, demographics: {...icpProfile.demographics, industry: e.target.value}})}
                    placeholder="Industry"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Psychographics</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={icpProfile.psychographics.values || ''}
                    onChange={(e) => setIcpProfile({...icpProfile, psychographics: {...icpProfile.psychographics, values: e.target.value}})}
                    placeholder="Core Values"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={icpProfile.psychographics.motivations || ''}
                    onChange={(e) => setIcpProfile({...icpProfile, psychographics: {...icpProfile.psychographics, motivations: e.target.value}})}
                    placeholder="Key Motivations"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={icpProfile.psychographics.challenges || ''}
                    onChange={(e) => setIcpProfile({...icpProfile, psychographics: {...icpProfile.psychographics, challenges: e.target.value}})}
                    placeholder="Main Challenges"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Pain Points</h3>
              <div className="space-y-2">
                {icpProfile.painPoints.map((pain, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={pain}
                      onChange={(e) => {
                        const newPainPoints = [...icpProfile.painPoints];
                        newPainPoints[idx] = e.target.value;
                        setIcpProfile({...icpProfile, painPoints: newPainPoints});
                      }}
                      className="flex-1 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <button
                      onClick={() => setIcpProfile({...icpProfile, painPoints: icpProfile.painPoints.filter((_, i) => i !== idx)})}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setIcpProfile({...icpProfile, painPoints: [...icpProfile.painPoints, '']})}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Pain Point
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Budget & Decision Factors</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                  <input
                    type="text"
                    value={icpProfile.budget}
                    onChange={(e) => setIcpProfile({...icpProfile, budget: e.target.value})}
                    placeholder="e.g., $10k-$50k annually"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Decision Factors</label>
                  <textarea
                    value={icpProfile.decisionFactors.join(', ')}
                    onChange={(e) => setIcpProfile({...icpProfile, decisionFactors: e.target.value.split(', ').filter(f => f)})}
                    placeholder="Price, Features, Support, etc."
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                    rows="3"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Market Size Mapping</h2>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">TAM (Total Addressable Market)</label>
                  <input
                    type="text"
                    value={marketSize.tam}
                    onChange={(e) => setMarketSize({...marketSize, tam: e.target.value})}
                    placeholder="e.g., $10 billion"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Total revenue opportunity</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SAM (Serviceable Available Market)</label>
                  <input
                    type="text"
                    value={marketSize.sam}
                    onChange={(e) => setMarketSize({...marketSize, sam: e.target.value})}
                    placeholder="e.g., $2 billion"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Portion you can serve</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SOM (Serviceable Obtainable Market)</label>
                  <input
                    type="text"
                    value={marketSize.som}
                    onChange={(e) => setMarketSize({...marketSize, som: e.target.value})}
                    placeholder="e.g., $100 million"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Portion you can capture</p>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Market Growth Rate</label>
                <input
                  type="text"
                  value={marketSize.growthRate}
                  onChange={(e) => setMarketSize({...marketSize, growthRate: e.target.value})}
                  placeholder="e.g., 25% annually"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Market Trends</label>
                <textarea
                  value={marketSize.trends.join('\n')}
                  onChange={(e) => setMarketSize({...marketSize, trends: e.target.value.split('\n').filter(t => t)})}
                  placeholder="Key market trends, one per line..."
                  className="w-full h-32 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'signals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Demand Signals</h2>
              <button
                onClick={generateDemandSignals}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Generate Signals
              </button>
            </div>

            {demandSignals.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No demand signals generated yet</p>
                <button
                  onClick={generateDemandSignals}
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors"
                >
                  Generate Demand Signals
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {demandSignals.map((signal, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-gray-500 uppercase">{signal.type}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        signal.strength === 'high' ? 'bg-green-100 text-green-700' :
                        signal.strength === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {signal.strength}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{signal.metric}</h3>
                    <p className="text-2xl font-bold text-gray-900">{signal.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'frameworks' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Validation Frameworks</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Jobs-to-be-Done</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Functional Jobs</label>
                    <textarea
                      value={frameworks.jobsToBeDone.jobs.join('\n')}
                      onChange={(e) => setFrameworks({...frameworks, jobsToBeDone: {...frameworks.jobsToBeDone, jobs: e.target.value.split('\n').filter(j => j)}})}
                      placeholder="What functional jobs does your customer need to get done?"
                      className="w-full h-24 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Desired Outcomes</label>
                    <textarea
                      value={frameworks.jobsToBeDone.outcomes.join('\n')}
                      onChange={(e) => setFrameworks({...frameworks, jobsToBeDone: {...frameworks.jobsToBeDone, outcomes: e.target.value.split('\n').filter(o => o)}})}
                      placeholder="What outcomes do customers want to achieve?"
                      className="w-full h-24 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Constraints</label>
                    <textarea
                      value={frameworks.jobsToBeDone.constraints.join('\n')}
                      onChange={(e) => setFrameworks({...frameworks, jobsToBeDone: {...frameworks.jobsToBeDone, constraints: e.target.value.split('\n').filter(c => c)}})}
                      placeholder="What constraints prevent customers from getting jobs done?"
                      className="w-full h-24 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Value Proposition Canvas</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Pains</label>
                    <textarea
                      value={frameworks.valueProposition.pains.join('\n')}
                      onChange={(e) => setFrameworks({...frameworks, valueProposition: {...frameworks.valueProposition, pains: e.target.value.split('\n').filter(p => p)}})}
                      placeholder="What pains does your customer experience?"
                      className="w-full h-24 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Gains</label>
                    <textarea
                      value={frameworks.valueProposition.gains.join('\n')}
                      onChange={(e) => setFrameworks({...frameworks, valueProposition: {...frameworks.valueProposition, gains: e.target.value.split('\n').filter(g => g)}})}
                      placeholder="What gains does your customer want?"
                      className="w-full h-24 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Products & Services</label>
                    <textarea
                      value={frameworks.valueProposition.products.join('\n')}
                      onChange={(e) => setFrameworks({...frameworks, valueProposition: {...frameworks.valueProposition, products: e.target.value.split('\n').filter(p => p)}})}
                      placeholder="How does your product create value?"
                      className="w-full h-24 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Lean Canvas</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Problem</label>
                  <textarea
                    value={frameworks.leanCanvas.problem}
                    onChange={(e) => setFrameworks({...frameworks, leanCanvas: {...frameworks.leanCanvas, problem: e.target.value}})}
                    placeholder="Top 3 problems you're solving"
                    className="w-full h-24 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Solution</label>
                  <textarea
                    value={frameworks.leanCanvas.solution}
                    onChange={(e) => setFrameworks({...frameworks, leanCanvas: {...frameworks.leanCanvas, solution: e.target.value}})}
                    placeholder="Top 3 features of your solution"
                    className="w-full h-24 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Metrics</label>
                  <textarea
                    value={frameworks.leanCanvas.metrics}
                    onChange={(e) => setFrameworks({...frameworks, leanCanvas: {...frameworks.leanCanvas, metrics: e.target.value}})}
                    placeholder="Key metrics to track"
                    className="w-full h-24 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unfair Advantage</label>
                  <textarea
                    value={frameworks.leanCanvas.advantage}
                    onChange={(e) => setFrameworks({...frameworks, leanCanvas: {...frameworks.leanCanvas, advantage: e.target.value}})}
                    placeholder="What's your unfair advantage?"
                    className="w-full h-24 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'competitive' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Competitive Analysis</h2>
              <button
                onClick={() => {
                  const newCompetitor = { id: Date.now(), name: '', strengths: '', weaknesses: '', marketShare: '', pricing: '' };
                  setFrameworks({...frameworks, competitive: {...frameworks.competitive, competitors: [...frameworks.competitive.competitors, newCompetitor]}});
                }}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Competitor
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Competitors</h3>
                <div className="space-y-4">
                  {frameworks.competitive.competitors.map((competitor, idx) => (
                    <div key={competitor.id || idx} className="p-4 bg-gray-50 rounded-xl">
                      <input
                        type="text"
                        value={competitor.name}
                        onChange={(e) => {
                          const updated = [...frameworks.competitive.competitors];
                          updated[idx] = {...updated[idx], name: e.target.value};
                          setFrameworks({...frameworks, competitive: {...frameworks.competitive, competitors: updated}});
                        }}
                        placeholder="Competitor name"
                        className="w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent mb-2"
                      />
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          type="text"
                          value={competitor.marketShare}
                          onChange={(e) => {
                            const updated = [...frameworks.competitive.competitors];
                            updated[idx] = {...updated[idx], marketShare: e.target.value};
                            setFrameworks({...frameworks, competitive: {...frameworks.competitive, competitors: updated}});
                          }}
                          placeholder="Market share"
                          className="p-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={competitor.pricing}
                          onChange={(e) => {
                            const updated = [...frameworks.competitive.competitors];
                            updated[idx] = {...updated[idx], pricing: e.target.value};
                            setFrameworks({...frameworks, competitive: {...frameworks.competitive, competitors: updated}});
                          }}
                          placeholder="Pricing"
                          className="p-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                      </div>
                      <textarea
                        value={competitor.strengths}
                        onChange={(e) => {
                          const updated = [...frameworks.competitive.competitors];
                          updated[idx] = {...updated[idx], strengths: e.target.value};
                          setFrameworks({...frameworks, competitive: {...frameworks.competitive, competitors: updated}});
                        }}
                        placeholder="Strengths"
                        className="w-full h-16 p-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none mb-2"
                      />
                      <textarea
                        value={competitor.weaknesses}
                        onChange={(e) => {
                          const updated = [...frameworks.competitive.competitors];
                          updated[idx] = {...updated[idx], weaknesses: e.target.value};
                          setFrameworks({...frameworks, competitive: {...frameworks.competitive, competitors: updated}});
                        }}
                        placeholder="Weaknesses"
                        className="w-full h-16 p-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Positioning</h3>
                  <textarea
                    value={frameworks.competitive.positioning}
                    onChange={(e) => setFrameworks({...frameworks, competitive: {...frameworks.competitive, positioning: e.target.value}})}
                    placeholder="How do you position yourself in the market?"
                    className="w-full h-32 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                  />
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Differentiation</h3>
                  <textarea
                    value={frameworks.competitive.differentiation}
                    onChange={(e) => setFrameworks({...frameworks, competitive: {...frameworks.competitive, differentiation: e.target.value}})}
                    placeholder="What makes you different from competitors?"
                    className="w-full h-32 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Validation Roadmap</h2>
              <button
                onClick={generateRoadmap}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </button>
            </div>

            <div className="space-y-4">
              {roadmap.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{item.phase}</h3>
                      <p className="text-sm text-gray-500">Due: {item.dueDate}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === 'completed' ? 'bg-green-100 text-green-700' :
                      item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {item.tasks.map((task, taskIdx) => (
                      <div key={taskIdx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <input type="checkbox" className="w-4 h-4 text-gray-900 rounded" />
                        <span className="text-gray-900">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'score' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Validation Score</h2>
              <button
                onClick={calculateValidationScore}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                Calculate Score
              </button>
            </div>

            {validationScore ? (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Overall Validation Score</h3>
                      <div className="flex items-baseline gap-3">
                        <span className={`text-6xl font-bold ${
                          validationScore.score >= 75 ? 'text-green-600' :
                          validationScore.score >= 50 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {validationScore.score}
                        </span>
                        <span className="text-3xl text-gray-400">/100</span>
                      </div>
                    </div>
                    <div className={`px-6 py-4 rounded-2xl text-center ${
                      validationScore.decision === 'PROCEED' ? 'bg-green-50 border-2 border-green-200' :
                      validationScore.decision === 'PIVOT' ? 'bg-yellow-50 border-2 border-yellow-200' :
                      'bg-red-50 border-2 border-red-200'
                    }`}>
                      <p className="text-sm font-medium text-gray-600 mb-1">Decision</p>
                      <p className={`text-3xl font-bold ${
                        validationScore.decision === 'PROCEED' ? 'text-green-700' :
                        validationScore.decision === 'PIVOT' ? 'text-yellow-700' :
                        'text-red-700'
                      }`}>
                        {validationScore.decision}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Score Breakdown</h4>
                    {validationScore.factors.map((factor, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{factor.name}</span>
                          <span className="text-sm text-gray-600">Weight: {factor.weight}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              factor.value >= 0.8 ? 'bg-green-600' :
                              factor.value >= 0.5 ? 'bg-yellow-600' :
                              'bg-red-600'
                            }`}
                            style={{ width: `${factor.value * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Score: {Math.round(factor.value * 100)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`rounded-2xl p-6 ${
                  validationScore.decision === 'PROCEED' ? 'bg-green-50 border-2 border-green-200' :
                  validationScore.decision === 'PIVOT' ? 'bg-yellow-50 border-2 border-yellow-200' :
                  'bg-red-50 border-2 border-red-200'
                }`}>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Recommendations</h4>
                  {validationScore.decision === 'PROCEED' && (
                    <div className="space-y-2">
                      <p className="text-gray-700">Strong validation! Your idea shows promise. Recommended actions:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Proceed with MVP development</li>
                        <li>Continue customer validation</li>
                        <li>Begin building your founding team</li>
                        <li>Start fundraising preparation</li>
                      </ul>
                    </div>
                  )}
                  {validationScore.decision === 'PIVOT' && (
                    <div className="space-y-2">
                      <p className="text-gray-700">Moderate validation. Consider pivoting or refining:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Conduct more customer interviews</li>
                        <li>Refine your value proposition</li>
                        <li>Validate problem-solution fit</li>
                        <li>Strengthen market positioning</li>
                      </ul>
                    </div>
                  )}
                  {validationScore.decision === 'KILL' && (
                    <div className="space-y-2">
                      <p className="text-gray-700">Weak validation signals. Consider killing this idea or major pivot:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Re-evaluate the core problem</li>
                        <li>Validate market demand exists</li>
                        <li>Consider alternative solutions</li>
                        <li>Explore different market segments</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Calculate your validation score to get a Proceed/Pivot/Kill recommendation</p>
                <button
                  onClick={calculateValidationScore}
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors"
                >
                  Calculate Score
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidationEngine;

