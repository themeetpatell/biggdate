import React, { useState } from 'react';
import { MessageCircle, Send, Sparkles, Calendar, Target, TrendingUp, AlertCircle } from 'lucide-react';

const CoCoach = ({ onBack }) => {
  const [question, setQuestion] = useState('');
  const [coachingHistory, setCoachingHistory] = useState([]);
  const [isCoaching, setIsCoaching] = useState(false);
  const [dailyCheckIn, setDailyCheckIn] = useState(false);

  const quickQuestions = [
    'How do I prioritize features for MVP?',
    'Should I bootstrap or raise funding?',
    'How do I find my first customers?',
    'What metrics should I track?',
    'How do I handle cofounder conflicts?',
    'When should I hire my first employee?'
  ];

  const handleQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQ = { role: 'user', content: question, timestamp: new Date() };
    setCoachingHistory(prev => [...prev, userQ]);
    setQuestion('');
    setIsCoaching(true);

    setTimeout(() => {
      const responses = {
        'prioritize': `**Prioritizing MVP Features:**

Use the RICE framework:
- **Reach**: How many users affected?
- **Impact**: How much does it move the needle?
- **Confidence**: How sure are you? (0-100%)
- **Effort**: How much time/resources?

Formula: (Reach × Impact × Confidence) / Effort

**Rule of Thumb:** If it doesn't directly solve your core value proposition, it's not MVP. Cut ruthlessly.`,
        'funding': `**Bootstrap vs. Raise:**

**Bootstrap if:**
- You can validate and get to revenue quickly
- You have personal runway (6-12 months)
- You want to maintain control
- Market is small/niche

**Raise if:**
- You need capital to build (hardware, infrastructure)
- Market moves fast (winner-takes-all)
- You need to hire a team immediately
- You want strategic investors' help

**Hybrid:** Bootstrap to traction, then raise on better terms.`,
        'customers': `**Finding First Customers:**

1. **Your Network**: Who do you know who has this problem?
2. **Communities**: Reddit, Discord, LinkedIn groups where your ICP hangs out
3. **Cold Outreach**: Personalized emails to 10-20 potential customers daily
4. **Content**: Write about the problem, attract people searching for solutions
5. **Partnerships**: Complementary products/services

**Pro Tip:** Offer free/discounted access in exchange for feedback and testimonials.`,
        'metrics': `**Key Metrics to Track:**

**North Star:** One metric that best indicates success

**Leading Indicators:**
- Sign-ups, activation rate, DAU/WAU

**Business Health:**
- CAC, LTV, LTV:CAC ratio (target 3:1+)
- MRR, churn rate, gross margin

**Product:**
- Feature usage, time to value, NPS

**Start Simple:** Track 3-5 metrics max. Add more as you scale.`,
        'conflicts': `**Handling Cofounder Conflicts:**

1. **Address Early**: Don't let issues fester
2. **Data-Driven**: Use metrics, not emotions
3. **Clear Roles**: Define responsibilities upfront
4. **Regular Check-ins**: Weekly 1-on-1s to catch issues
5. **Mediation**: Use advisors/mentors if needed
6. **Documentation**: Vesting schedules, equity agreements

**Remember:** Disagreement is healthy. Conflict is not.`,
        'hire': `**When to Hire First Employee:**

**Hire when:**
- You've validated product-market fit
- You have consistent revenue (or funding)
- You're spending 20%+ time on tasks someone else can do
- You can afford 6+ months of salary

**First Hire Priority:**
- Sales (if B2B and you're not good at it)
- Engineering (if you're non-technical)
- Operations (if you're drowning in admin)

**Don't hire:** Just because you can. Hire because you must.`
      };

      const lowerQuestion = question.toLowerCase();
      let response = 'Great question! Here\'s my coaching perspective:\n\n';
      
      if (lowerQuestion.includes('prioritiz') || lowerQuestion.includes('feature') || lowerQuestion.includes('mvp')) {
        response = responses['prioritize'];
      } else if (lowerQuestion.includes('fund') || lowerQuestion.includes('bootstrap') || lowerQuestion.includes('raise')) {
        response = responses['funding'];
      } else if (lowerQuestion.includes('customer') || lowerQuestion.includes('user') || lowerQuestion.includes('find')) {
        response = responses['customers'];
      } else if (lowerQuestion.includes('metric') || lowerQuestion.includes('track') || lowerQuestion.includes('measure')) {
        response = responses['metrics'];
      } else if (lowerQuestion.includes('conflict') || lowerQuestion.includes('cofounder') || lowerQuestion.includes('disagreement')) {
        response = responses['conflicts'];
      } else if (lowerQuestion.includes('hire') || lowerQuestion.includes('employee') || lowerQuestion.includes('team')) {
        response = responses['hire'];
      } else {
        response = `That's a great question! Here's my perspective:

Based on your situation, I'd recommend focusing on [key insight]. The most important thing is to [action]. 

Remember: [principle/reminder].

What specific challenge are you facing right now? Let's dive deeper.`;
      }

      const aiResponse = { role: 'ai', content: response, timestamp: new Date() };
      setCoachingHistory(prev => [...prev, aiResponse]);
      setIsCoaching(false);
    }, 1500);
  };

  const handleQuickQuestion = (q) => {
    setQuestion(q);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Co-Coach Daily</h2>
            <p className="text-gray-600">Get daily coaching and guidance on your journey</p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-teal-50 rounded-xl border-2 border-teal-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-teal-600" />
            <h3 className="font-semibold text-gray-900">Daily Check-In</h3>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            How are you feeling today? What's your biggest challenge right now?
          </p>
          <button
            onClick={() => setDailyCheckIn(true)}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            Start daily check-in →
          </button>
        </div>

        <form onSubmit={handleQuestion}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ask me anything about your startup journey
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What's on your mind? Need advice on fundraising, product, team, growth, or anything else?"
              className="w-full h-32 p-4 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none resize-none"
            />
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickQuestion(q)}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!question.trim() || isCoaching}
            className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isCoaching ? (
              <>
                <Sparkles className="w-5 h-5 animate-pulse" />
                Coaching...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Get Coaching
              </>
            )}
          </button>
        </form>
      </div>

      {coachingHistory.length > 0 && (
        <div className="space-y-4">
          {coachingHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-xl ${
                msg.role === 'user'
                  ? 'bg-teal-50 border-2 border-teal-200 ml-8'
                  : 'bg-white border-2 border-gray-200 shadow-md mr-8'
              }`}
            >
              <div className="flex items-start gap-3">
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-gray-800 whitespace-pre-line leading-relaxed">{msg.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {coachingHistory.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <Target className="w-16 h-16 text-teal-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Daily Coach</h3>
            <p className="text-gray-600 mb-6">
              Ask me anything about your startup journey. I'm here to help you navigate challenges, make decisions, and stay focused.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 bg-teal-50 rounded-xl">
                <TrendingUp className="w-6 h-6 text-teal-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Growth Strategy</h4>
                <p className="text-sm text-gray-600">Get advice on scaling and growth</p>
              </div>
              <div className="p-4 bg-teal-50 rounded-xl">
                <Target className="w-6 h-6 text-teal-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Decision Making</h4>
                <p className="text-sm text-gray-600">Navigate tough choices with clarity</p>
              </div>
              <div className="p-4 bg-teal-50 rounded-xl">
                <AlertCircle className="w-6 h-6 text-teal-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Problem Solving</h4>
                <p className="text-sm text-gray-600">Work through challenges together</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoCoach;

