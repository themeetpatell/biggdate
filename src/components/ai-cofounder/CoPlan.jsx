import React, { useState } from 'react';
import { Target, Send, Sparkles, Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';

const CoPlan = ({ onBack }) => {
  const [startupInfo, setStartupInfo] = useState('');
  const [gtmPlan, setGtmPlan] = useState(null);
  const [isPlanning, setIsPlanning] = useState(false);

  const handlePlan = async (e) => {
    e.preventDefault();
    if (!startupInfo.trim()) return;

    setIsPlanning(true);
    setTimeout(() => {
      setGtmPlan({
        overview: {
          title: 'Go-To-Market Strategy Overview',
          content: `**Phase 1: Pre-Launch (Weeks 1-4)**
- Build waitlist/landing page
- Create content (blog, social media)
- Identify early adopters
- Beta test with 10-20 users

**Phase 2: Launch (Weeks 5-8)**
- Public launch announcement
- Press outreach
- Product Hunt launch
- Influencer partnerships
- Paid ads (small budget test)

**Phase 3: Growth (Weeks 9-16)**
- Double down on what works
- Referral program
- Content marketing
- Community building
- Partnerships`
        },
        channels: {
          title: 'Recommended Channels',
          content: `**Primary Channels:**

1. **Content Marketing**
   - Blog posts targeting your ICP
   - SEO optimization
   - Guest posting on industry sites

2. **Social Media**
   - LinkedIn (B2B focus)
   - Twitter/X (tech community)
   - Reddit (relevant communities)

3. **Community**
   - Discord/Slack communities
   - Industry forums
   - Online events/webinars

4. **Partnerships**
   - Complementary products
   - Industry associations
   - Influencers/thought leaders

5. **Paid Acquisition** (after validation)
   - Google Ads
   - LinkedIn Ads
   - Retargeting campaigns`
        },
        metrics: {
          title: 'Key Metrics to Track',
          content: `**North Star Metric:** [Primary metric that indicates success]

**Leading Indicators:**
- Website traffic
- Sign-up conversion rate
- Activation rate (% who complete onboarding)
- Daily/Weekly Active Users

**Business Metrics:**
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- LTV:CAC ratio (target: 3:1+)
- Monthly Recurring Revenue (MRR)
- Churn rate

**Growth Metrics:**
- Month-over-month growth
- Viral coefficient
- Net Promoter Score (NPS)`
        },
        timeline: {
          title: '90-Day Action Plan',
          content: `**Month 1: Foundation**
- Week 1-2: Set up analytics, landing page, waitlist
- Week 3-4: Content creation, community outreach, beta users

**Month 2: Launch**
- Week 5-6: Public launch, press outreach, Product Hunt
- Week 7-8: Paid ads test, influencer partnerships, iterate

**Month 3: Scale**
- Week 9-10: Double down on winning channels
- Week 11-12: Referral program, partnerships, optimize conversion`
        }
      });
      setIsPlanning(false);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Co-Plan Your GTM</h2>
            <p className="text-gray-600">Build your Go-To-Market strategy together</p>
          </div>
        </div>

        <form onSubmit={handlePlan}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tell me about your startup
            </label>
            <textarea
              value={startupInfo}
              onChange={(e) => setStartupInfo(e.target.value)}
              placeholder="What's your product? Who is your target customer? What stage are you at? What's your budget? Any existing traction?"
              className="w-full h-40 p-4 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!startupInfo.trim() || isPlanning}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPlanning ? (
              <>
                <Sparkles className="w-5 h-5 animate-pulse" />
                Co-Planning...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Generate GTM Plan
              </>
            )}
          </button>
        </form>
      </div>

      {gtmPlan && (
        <div className="space-y-6">
          {Object.entries(gtmPlan).map(([key, section]) => (
            <div key={key} className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h3>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-gray-800 bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                  {section.content}
                </pre>
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              setStartupInfo('');
              setGtmPlan(null);
            }}
            className="w-full text-orange-600 hover:text-orange-700 font-medium py-3"
          >
            Plan another GTM strategy
          </button>
        </div>
      )}
    </div>
  );
};

export default CoPlan;

