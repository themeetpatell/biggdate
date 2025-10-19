import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Users, DollarSign, Target, Plus, Trash2, ExternalLink, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MarketResearch = () => {
  const navigate = useNavigate();
  const [research, setResearch] = useState({
    marketSize: {
      tam: '',
      sam: '',
      som: ''
    },
    competitors: [],
    targetSegments: [],
    trends: '',
    insights: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('marketResearch');
    if (saved) {
      setResearch(JSON.parse(saved));
    }
  }, []);

  const saveResearch = (data) => {
    setResearch(data);
    localStorage.setItem('marketResearch', JSON.stringify(data));
  };

  const updateMarketSize = (field, value) => {
    const updated = {
      ...research,
      marketSize: { ...research.marketSize, [field]: value }
    };
    saveResearch(updated);
  };

  const addCompetitor = () => {
    const competitor = {
      id: Date.now(),
      name: '',
      website: '',
      strengths: '',
      weaknesses: '',
      pricing: '',
      marketShare: ''
    };
    saveResearch({
      ...research,
      competitors: [...research.competitors, competitor]
    });
  };

  const updateCompetitor = (id, field, value) => {
    const updated = {
      ...research,
      competitors: research.competitors.map(c => c.id === id ? { ...c, [field]: value } : c)
    };
    saveResearch(updated);
  };

  const removeCompetitor = (id) => {
    saveResearch({
      ...research,
      competitors: research.competitors.filter(c => c.id !== id)
    });
  };

  const addTargetSegment = () => {
    const segment = {
      id: Date.now(),
      name: '',
      size: '',
      characteristics: '',
      needs: ''
    };
    saveResearch({
      ...research,
      targetSegments: [...research.targetSegments, segment]
    });
  };

  const updateTargetSegment = (id, field, value) => {
    const updated = {
      ...research,
      targetSegments: research.targetSegments.map(s => s.id === id ? { ...s, [field]: value } : s)
    };
    saveResearch(updated);
  };

  const removeTargetSegment = (id) => {
    saveResearch({
      ...research,
      targetSegments: research.targetSegments.filter(s => s.id !== id)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Market Research</h1>
            <p className="text-gray-600">Analyze your market, competitors, and opportunities</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Size */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Market Size</h2>
                  <p className="text-sm text-gray-600">Estimate your market opportunity</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TAM (Total Addressable Market)
                  </label>
                  <input
                    type="text"
                    value={research.marketSize.tam}
                    onChange={(e) => updateMarketSize('tam', e.target.value)}
                    placeholder="e.g., $10 billion globally"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Total revenue opportunity available</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SAM (Serviceable Available Market)
                  </label>
                  <input
                    type="text"
                    value={research.marketSize.sam}
                    onChange={(e) => updateMarketSize('sam', e.target.value)}
                    placeholder="e.g., $2 billion in target regions"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Portion of TAM you can realistically serve</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SOM (Serviceable Obtainable Market)
                  </label>
                  <input
                    type="text"
                    value={research.marketSize.som}
                    onChange={(e) => updateMarketSize('som', e.target.value)}
                    placeholder="e.g., $100 million in year 1-3"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Portion you can realistically capture</p>
                </div>
              </div>
            </div>

            {/* Competitors */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Competitor Analysis</h2>
                    <p className="text-sm text-gray-600">Track your competition</p>
                  </div>
                </div>
                <button
                  onClick={addCompetitor}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              <div className="space-y-4">
                {research.competitors.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No competitors added yet</p>
                ) : (
                  research.competitors.map(competitor => (
                    <div key={competitor.id} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <input
                          type="text"
                          value={competitor.name}
                          onChange={(e) => updateCompetitor(competitor.id, 'name', e.target.value)}
                          placeholder="Competitor name"
                          className="text-lg font-semibold bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400 flex-1"
                        />
                        <button
                          onClick={() => removeCompetitor(competitor.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                          <input
                            type="url"
                            value={competitor.website}
                            onChange={(e) => updateCompetitor(competitor.id, 'website', e.target.value)}
                            placeholder="Website URL"
                            className="flex-1 text-sm bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                        <textarea
                          value={competitor.strengths}
                          onChange={(e) => updateCompetitor(competitor.id, 'strengths', e.target.value)}
                          placeholder="Strengths..."
                          className="w-full h-16 p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                        />
                        <textarea
                          value={competitor.weaknesses}
                          onChange={(e) => updateCompetitor(competitor.id, 'weaknesses', e.target.value)}
                          placeholder="Weaknesses..."
                          className="w-full h-16 p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={competitor.pricing}
                            onChange={(e) => updateCompetitor(competitor.id, 'pricing', e.target.value)}
                            placeholder="Pricing"
                            className="text-sm bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                          <input
                            type="text"
                            value={competitor.marketShare}
                            onChange={(e) => updateCompetitor(competitor.id, 'marketShare', e.target.value)}
                            placeholder="Market share"
                            className="text-sm bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Market Trends */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Market Trends</h2>
                  <p className="text-sm text-gray-600">Key trends affecting your market</p>
                </div>
              </div>
              <textarea
                value={research.trends}
                onChange={(e) => saveResearch({ ...research, trends: e.target.value })}
                placeholder="Document market trends, emerging technologies, regulatory changes, consumer behavior shifts, etc."
                className="w-full h-48 p-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Target Segments */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Target Segments</h2>
                    <p className="text-xs text-gray-600">Customer groups</p>
                  </div>
                </div>
                <button
                  onClick={addTargetSegment}
                  className="p-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {research.targetSegments.length === 0 ? (
                  <p className="text-gray-400 text-center py-8 text-sm">No segments</p>
                ) : (
                  research.targetSegments.map(segment => (
                    <div key={segment.id} className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <input
                          type="text"
                          value={segment.name}
                          onChange={(e) => updateTargetSegment(segment.id, 'name', e.target.value)}
                          placeholder="Segment name"
                          className="text-sm font-semibold bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400 flex-1"
                        />
                        <button
                          onClick={() => removeTargetSegment(segment.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={segment.size}
                        onChange={(e) => updateTargetSegment(segment.id, 'size', e.target.value)}
                        placeholder="Size"
                        className="w-full text-xs bg-white border border-gray-300 rounded-lg px-2 py-1.5 mb-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                      <textarea
                        value={segment.characteristics}
                        onChange={(e) => updateTargetSegment(segment.id, 'characteristics', e.target.value)}
                        placeholder="Characteristics..."
                        className="w-full h-16 p-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none mb-2"
                      />
                      <textarea
                        value={segment.needs}
                        onChange={(e) => updateTargetSegment(segment.id, 'needs', e.target.value)}
                        placeholder="Needs & Pain Points..."
                        className="w-full h-16 p-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Key Insights</h2>
                  <p className="text-xs text-gray-600">Important learnings</p>
                </div>
              </div>
              <textarea
                value={research.insights}
                onChange={(e) => saveResearch({ ...research, insights: e.target.value })}
                placeholder="What have you learned from your research? Key insights, opportunities, or concerns..."
                className="w-full h-64 p-4 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketResearch;

