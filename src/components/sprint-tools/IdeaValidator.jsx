import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Target, Users, DollarSign, TrendingUp, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IdeaValidator = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('ideaValidator');
    if (saved) {
      setResponses(JSON.parse(saved));
    }
  }, []);

  const validationFrameworks = [
    {
      id: 'problem',
      title: 'Problem Validation',
      icon: Target,
      questions: [
        { id: 'p1', question: 'Is this a real problem people actively face?', weight: 10 },
        { id: 'p2', question: 'Are people currently spending money to solve this problem?', weight: 10 },
        { id: 'p3', question: 'Is the problem urgent and important?', weight: 8 },
        { id: 'p4', question: 'Can you clearly articulate the problem in one sentence?', weight: 7 }
      ]
    },
    {
      id: 'solution',
      title: 'Solution Fit',
      icon: Zap,
      questions: [
        { id: 's1', question: 'Does your solution directly solve the core problem?', weight: 10 },
        { id: 's2', question: 'Is your solution 10x better than existing alternatives?', weight: 9 },
        { id: 's3', question: 'Can you build an MVP in less than 3 months?', weight: 7 },
        { id: 's4', question: 'Is your solution technically feasible with current technology?', weight: 8 }
      ]
    },
    {
      id: 'market',
      title: 'Market Opportunity',
      icon: TrendingUp,
      questions: [
        { id: 'm1', question: 'Is the total addressable market (TAM) > $1 billion?', weight: 9 },
        { id: 'm2', question: 'Is the market growing at > 20% annually?', weight: 8 },
        { id: 'm3', question: 'Can you identify and reach early adopters?', weight: 8 },
        { id: 'm4', question: 'Is there a clear path to scale beyond the initial market?', weight: 7 }
      ]
    },
    {
      id: 'customers',
      title: 'Customer Validation',
      icon: Users,
      questions: [
        { id: 'c1', question: 'Have you talked to at least 20 potential customers?', weight: 9 },
        { id: 'c2', question: 'Would customers pay for this today?', weight: 10 },
        { id: 'c3', question: 'Can you clearly define your ideal customer profile?', weight: 8 },
        { id: 'c4', question: 'Do you understand the customer decision-making process?', weight: 7 }
      ]
    },
    {
      id: 'business',
      title: 'Business Model',
      icon: DollarSign,
      questions: [
        { id: 'b1', question: 'Is there a clear path to monetization?', weight: 10 },
        { id: 'b2', question: 'Are your unit economics profitable?', weight: 9 },
        { id: 'b3', question: 'Is customer acquisition cost (CAC) < lifetime value (LTV)?', weight: 9 },
        { id: 'b4', question: 'Can you achieve profitability within 2 years?', weight: 7 }
      ]
    },
    {
      id: 'competitive',
      title: 'Competitive Advantage',
      icon: Shield,
      questions: [
        { id: 'comp1', question: 'Do you have a unique insight or unfair advantage?', weight: 9 },
        { id: 'comp2', question: 'Can you build defensible moats (network effects, patents, etc.)?', weight: 8 },
        { id: 'comp3', question: 'Are barriers to entry high enough to deter competition?', weight: 7 },
        { id: 'comp4', question: 'Is your differentiation difficult to copy?', weight: 8 }
      ]
    }
  ];

  const handleResponse = (questionId, value) => {
    const updated = { ...responses, [questionId]: value };
    setResponses(updated);
    localStorage.setItem('ideaValidator', JSON.stringify(updated));
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    validationFrameworks.forEach(framework => {
      framework.questions.forEach(question => {
        maxScore += question.weight;
        if (responses[question.id] === 'yes') {
          totalScore += question.weight;
        } else if (responses[question.id] === 'maybe') {
          totalScore += question.weight * 0.5;
        }
      });
    });

    return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return { message: 'Strong Validation', color: 'bg-green-50 border-green-200 text-green-700' };
    if (score >= 60) return { message: 'Promising, Needs Work', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' };
    if (score >= 40) return { message: 'Significant Concerns', color: 'bg-orange-50 border-orange-200 text-orange-700' };
    return { message: 'High Risk - Pivot Recommended', color: 'bg-red-50 border-red-200 text-red-700' };
  };

  const score = calculateScore();
  const scoreData = getScoreMessage(score);
  const answeredQuestions = Object.keys(responses).length;
  const totalQuestions = validationFrameworks.reduce((sum, f) => sum + f.questions.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Idea Validator</h1>
              <p className="text-gray-600">Validate your startup idea with proven frameworks</p>
            </div>
          </div>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Validation Score</h2>
              <div className="flex items-baseline gap-3">
                <span className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}</span>
                <span className="text-2xl text-gray-400">/100</span>
              </div>
              <div className={`inline-block px-4 py-2 rounded-xl mt-4 ${scoreData.color} border font-semibold`}>
                {scoreData.message}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Questions Answered</p>
              <p className="text-2xl font-bold text-gray-900">{answeredQuestions}/{totalQuestions}</p>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Validation Frameworks */}
        <div className="space-y-6">
          {validationFrameworks.map(framework => {
            const Icon = framework.icon;
            const frameworkScore = framework.questions.reduce((sum, q) => {
              const maxScore = q.weight;
              const score = responses[q.id] === 'yes' ? q.weight : responses[q.id] === 'maybe' ? q.weight * 0.5 : 0;
              return sum + score;
            }, 0);
            const frameworkMaxScore = framework.questions.reduce((sum, q) => sum + q.weight, 0);
            const frameworkPercent = frameworkMaxScore > 0 ? Math.round((frameworkScore / frameworkMaxScore) * 100) : 0;

            return (
              <div key={framework.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{framework.title}</h3>
                      <p className="text-sm text-gray-600">Score: {frameworkPercent}%</p>
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center">
                    <span className={`text-lg font-bold ${getScoreColor(frameworkPercent)}`}>
                      {frameworkPercent}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {framework.questions.map(question => (
                    <div key={question.id} className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-gray-900 font-medium mb-3">{question.question}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResponse(question.id, 'yes')}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                            responses[question.id] === 'yes'
                              ? 'bg-green-600 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:border-green-600'
                          }`}
                        >
                          <CheckCircle className="w-4 h-4 inline mr-2" />
                          Yes
                        </button>
                        <button
                          onClick={() => handleResponse(question.id, 'maybe')}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                            responses[question.id] === 'maybe'
                              ? 'bg-yellow-500 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:border-yellow-500'
                          }`}
                        >
                          <AlertCircle className="w-4 h-4 inline mr-2" />
                          Maybe
                        </button>
                        <button
                          onClick={() => handleResponse(question.id, 'no')}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                            responses[question.id] === 'no'
                              ? 'bg-red-600 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:border-red-600'
                          }`}
                        >
                          <XCircle className="w-4 h-4 inline mr-2" />
                          No
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        {answeredQuestions === totalQuestions && (
          <div className="mt-8 bg-gray-900 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Next Steps</h3>
            {score >= 80 && (
              <div>
                <p className="mb-4">Excellent! Your idea shows strong validation across all areas. You're ready to move forward:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Start building your MVP
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Find your cofounder
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Begin customer acquisition
                  </li>
                </ul>
              </div>
            )}
            {score >= 60 && score < 80 && (
              <div>
                <p className="mb-4">Good progress! Address these areas before fully committing:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Validate with more customer interviews
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Refine your business model
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Strengthen your competitive advantage
                  </li>
                </ul>
              </div>
            )}
            {score < 60 && (
              <div>
                <p className="mb-4">Consider pivoting or refining your idea. Focus on:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Talk to more potential customers
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Validate the problem exists
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Research the market more thoroughly
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaValidator;

