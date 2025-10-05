import React, { useState, useRef } from 'react';
import { 
  Video, Mic, MicOff, Play, Pause, Square, Upload, 
  X, CheckCircle, AlertCircle, Camera, FileText, 
  DollarSign, Target, Users, Calendar, MapPin, 
  Globe, Tag, Plus, Trash2, Edit3, Save, Send,
  Lightbulb, Rocket, TrendingUp, BarChart3, 
  Building2, Zap, Star, Award, Clock, Eye
} from 'lucide-react';

const StartupPitchCreator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [videoRef, setVideoRef] = useState(null);
  const [audioRef, setAudioRef] = useState(null);
  const [pitchData, setPitchData] = useState({
    title: '',
    tagline: '',
    description: '',
    problem: '',
    solution: '',
    marketSize: '',
    businessModel: '',
    targetMarket: '',
    competitiveAdvantage: '',
    fundingNeeds: '',
    timeline: '',
    team: [],
    skillsNeeded: [],
    industries: [],
    stage: 'idea',
    video: null,
    audio: null,
    deck: null
  });

  const videoRefCallback = useRef(null);
  const audioRefCallback = useRef(null);
  const recordingIntervalRef = useRef(null);

  const steps = [
    { id: 1, title: 'Basic Info', icon: FileText },
    { id: 2, title: 'Problem & Solution', icon: Target },
    { id: 3, title: 'Market & Business', icon: BarChart3 },
    { id: 4, title: 'Team & Funding', icon: Users },
    { id: 5, title: 'Media & Pitch', icon: Video },
    { id: 6, title: 'Review & Publish', icon: Send }
  ];

  const industries = [
    'Fintech', 'AI/ML', 'SaaS', 'E-commerce', 'Healthcare', 'EdTech',
    'PropTech', 'CleanTech', 'FoodTech', 'Gaming', 'Social', 'Enterprise'
  ];

  const stages = [
    { value: 'idea', label: 'Idea Stage', description: 'Just an idea, no MVP yet' },
    { value: 'mvp', label: 'MVP Stage', description: 'Have a working prototype' },
    { value: 'early', label: 'Early Stage', description: 'Some traction, looking for seed funding' },
    { value: 'growth', label: 'Growth Stage', description: 'Proven product-market fit, scaling' }
  ];

  const skillsOptions = [
    'Technical Co-founder', 'Business Co-founder', 'Marketing Expert',
    'Product Manager', 'UI/UX Designer', 'Sales Lead', 'Operations Manager',
    'Data Scientist', 'DevOps Engineer', 'Content Creator', 'Legal Advisor'
  ];

  const handleInputChange = (field, value) => {
    setPitchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value, action) => {
    setPitchData(prev => ({
      ...prev,
      [field]: action === 'add' 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRefCallback.current) {
        videoRefCallback.current.srcObject = stream;
      }
      
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setPitchData(prev => ({ ...prev, video: blob }));
        setRecordedChunks(chunks);
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting video recording:', error);
    }
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setPitchData(prev => ({ ...prev, audio: blob }));
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting audio recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
    }
  };

  const playRecording = () => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      if (videoRefCallback.current) {
        videoRefCallback.current.src = url;
        videoRefCallback.current.play();
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Startup Title *
              </label>
              <input
                type="text"
                value={pitchData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., EcoTrack AI"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tagline *
              </label>
              <input
                type="text"
                value={pitchData.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                placeholder="e.g., AI-powered carbon footprint tracking for businesses"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={pitchData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of your startup idea..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Industries *
              </label>
              <div className="flex flex-wrap gap-2">
                {industries.map(industry => (
                  <button
                    key={industry}
                    onClick={() => handleArrayChange('industries', industry, 
                      pitchData.industries.includes(industry) ? 'remove' : 'add')}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                      pitchData.industries.includes(industry)
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Stage *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stages.map(stage => (
                  <button
                    key={stage.value}
                    onClick={() => handleInputChange('stage', stage.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      pitchData.stage === stage.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{stage.label}</div>
                    <div className="text-sm text-gray-600">{stage.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Problem Statement *
              </label>
              <textarea
                value={pitchData.problem}
                onChange={(e) => handleInputChange('problem', e.target.value)}
                placeholder="What problem are you solving? Why is it important?"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Solution *
              </label>
              <textarea
                value={pitchData.solution}
                onChange={(e) => handleInputChange('solution', e.target.value)}
                placeholder="How does your product/service solve this problem?"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Target Market *
              </label>
              <textarea
                value={pitchData.targetMarket}
                onChange={(e) => handleInputChange('targetMarket', e.target.value)}
                placeholder="Who are your target customers? Be specific about demographics, size, etc."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Competitive Advantage *
              </label>
              <textarea
                value={pitchData.competitiveAdvantage}
                onChange={(e) => handleInputChange('competitiveAdvantage', e.target.value)}
                placeholder="What makes your solution unique? Why will customers choose you?"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Market Size *
              </label>
              <input
                type="text"
                value={pitchData.marketSize}
                onChange={(e) => handleInputChange('marketSize', e.target.value)}
                placeholder="e.g., $50B TAM, $5B SAM, $500M SOM"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Model *
              </label>
              <textarea
                value={pitchData.businessModel}
                onChange={(e) => handleInputChange('businessModel', e.target.value)}
                placeholder="How will you make money? Revenue streams, pricing strategy, etc."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Funding Needs *
              </label>
              <input
                type="text"
                value={pitchData.fundingNeeds}
                onChange={(e) => handleInputChange('fundingNeeds', e.target.value)}
                placeholder="e.g., $500K seed round, $2M Series A"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Timeline *
              </label>
              <input
                type="text"
                value={pitchData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                placeholder="e.g., MVP in 6 months, launch in 12 months"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Team
              </label>
              <div className="space-y-3">
                {pitchData.team.map((member, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <input
                      type="text"
                      value={member}
                      onChange={(e) => {
                        const newTeam = [...pitchData.team];
                        newTeam[index] = e.target.value;
                        setPitchData(prev => ({ ...prev, team: newTeam }));
                      }}
                      placeholder="Name, Role, Experience"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => {
                        const newTeam = pitchData.team.filter((_, i) => i !== index);
                        setPitchData(prev => ({ ...prev, team: newTeam }));
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setPitchData(prev => ({ ...prev, team: [...prev.team, ''] }))}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-purple-500 hover:text-purple-500 transition-colors"
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  Add Team Member
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Skills Needed *
              </label>
              <div className="flex flex-wrap gap-2">
                {skillsOptions.map(skill => (
                  <button
                    key={skill}
                    onClick={() => handleArrayChange('skillsNeeded', skill, 
                      pitchData.skillsNeeded.includes(skill) ? 'remove' : 'add')}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                      pitchData.skillsNeeded.includes(skill)
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Video Pitch (Optional)
              </label>
              <div className="space-y-4">
                {!pitchData.video ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                    <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Record a 2-minute video pitch</p>
                    <button
                      onClick={() => setShowVideoModal(true)}
                      className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
                    >
                      <Camera className="w-5 h-5 inline mr-2" />
                      Record Video
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Video Pitch</span>
                      <div className="flex gap-2">
                        <button
                          onClick={playRecording}
                          className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setPitchData(prev => ({ ...prev, video: null }))}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <video
                      ref={videoRefCallback}
                      className="w-full h-48 bg-black rounded-lg"
                      controls
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Audio Pitch (Optional)
              </label>
              <div className="space-y-4">
                {!pitchData.audio ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                    <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Record an audio pitch</p>
                    <button
                      onClick={() => setShowAudioModal(true)}
                      className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      <Mic className="w-5 h-5 inline mr-2" />
                      Record Audio
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Audio Pitch</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPitchData(prev => ({ ...prev, audio: null }))}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <audio
                      ref={audioRefCallback}
                      className="w-full"
                      controls
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pitch Deck (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Upload your pitch deck (PDF, PPT, etc.)</p>
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setPitchData(prev => ({ ...prev, deck: file }));
                    }
                  }}
                  className="hidden"
                  id="deck-upload"
                />
                <label
                  htmlFor="deck-upload"
                  className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors cursor-pointer inline-block"
                >
                  <Upload className="w-5 h-5 inline mr-2" />
                  Upload Deck
                </label>
              </div>
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Review Your Pitch</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Title</h4>
                  <p className="text-gray-600">{pitchData.title || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Tagline</h4>
                  <p className="text-gray-600">{pitchData.tagline || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Description</h4>
                  <p className="text-gray-600">{pitchData.description || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Problem</h4>
                  <p className="text-gray-600">{pitchData.problem || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Solution</h4>
                  <p className="text-gray-600">{pitchData.solution || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Skills Needed</h4>
                  <div className="flex flex-wrap gap-2">
                    {pitchData.skillsNeeded.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Ready to Publish?</h4>
                  <p className="text-yellow-700 text-sm mt-1">
                    Once published, your pitch will be visible to potential cofounders. 
                    You can edit it later if needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const publishPitch = () => {
    console.log('Publishing pitch:', pitchData);
    // Here you would typically save to backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Startup Pitch</h1>
            <p className="text-gray-600">Share your vision and find the perfect cofounder</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                      isActive 
                        ? 'border-purple-500 bg-purple-500 text-white' 
                        : isCompleted
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="ml-3">
                      <div className={`text-sm font-semibold ${
                        isActive ? 'text-purple-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            <div className="flex gap-3">
              {currentStep === steps.length ? (
                <button
                  onClick={publishPitch}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-semibold"
                >
                  <Send className="w-5 h-5 inline mr-2" />
                  Publish Pitch
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-semibold"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Video Recording Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Record Video Pitch</h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <video
                ref={videoRefCallback}
                className="w-full h-64 bg-black rounded-xl"
                autoPlay
                muted
              />
              
              <div className="flex items-center justify-center gap-4">
                {!isRecording ? (
                  <button
                    onClick={startVideoRecording}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                  >
                    <Video className="w-5 h-5" />
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                  >
                    <Square className="w-5 h-5" />
                    Stop Recording ({formatTime(recordingTime)})
                  </button>
                )}
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => {
                    setShowVideoModal(false);
                    setPitchData(prev => ({ ...prev, video: null }));
                  }}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audio Recording Modal */}
      {showAudioModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Record Audio Pitch</h3>
              <button
                onClick={() => setShowAudioModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4 text-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Mic className="w-12 h-12 text-purple-500" />
              </div>
              
              <div className="flex items-center justify-center gap-4">
                {!isRecording ? (
                  <button
                    onClick={startAudioRecording}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
                  >
                    <Mic className="w-5 h-5" />
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                  >
                    <Square className="w-5 h-5" />
                    Stop ({formatTime(recordingTime)})
                  </button>
                )}
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => {
                    setShowAudioModal(false);
                    setPitchData(prev => ({ ...prev, audio: null }));
                  }}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartupPitchCreator;
