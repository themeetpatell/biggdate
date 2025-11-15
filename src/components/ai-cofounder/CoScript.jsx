import React, { useState } from 'react';
import { Presentation, Send, Sparkles, Mic, FileText, Video } from 'lucide-react';

const CoScript = ({ onBack }) => {
  const [investorContext, setInvestorContext] = useState('');
  const [narrativeType, setNarrativeType] = useState('');
  const [script, setScript] = useState(null);
  const [isScripting, setIsScripting] = useState(false);

  const narrativeTypes = [
    { id: 'pitch', name: 'Pitch Deck Script', description: 'Full presentation script' },
    { id: 'meeting', name: 'Investor Meeting', description: 'One-on-one conversation' },
    { id: 'demo', name: 'Product Demo', description: 'Live demo narrative' },
    { id: 'followup', name: 'Follow-up Email', description: 'Post-meeting follow-up' }
  ];

  const handleScript = async (e) => {
    e.preventDefault();
    if (!investorContext.trim() || !narrativeType) return;

    setIsScripting(true);
    setTimeout(() => {
      const scripts = {
        pitch: `**Investor Pitch Script (10-15 minutes)**

**Opening (30 seconds):**
"Thanks for your time. I'm [Name], founder of [Startup]. We're solving [problem] for [target market], and we're raising [amount] to [goal]."

**Problem (1 minute):**
"[Target market] faces [specific problem]. This costs them [quantified pain]. Current solutions [why they fail]. We've validated this with [evidence]."

**Solution (2 minutes):**
"[Startup Name] solves this by [unique approach]. Here's how it works: [demo/key features]. Our differentiator is [competitive advantage]."

**Market (1 minute):**
"TAM is [size], SAM is [size], and we're targeting [SOM] in [timeframe]. Market is growing at [rate]."

**Traction (2 minutes):**
"We've achieved [key metrics]:
- [Metric 1]: [Number]
- [Metric 2]: [Number]
- [Metric 3]: [Number]

Our growth rate is [X]% MoM."

**Business Model (1 minute):**
"We make money through [revenue model]. Unit economics: CAC is [amount], LTV is [amount], payback period is [time]."

**Team (1 minute):**
"[Team member 1] brings [expertise]. [Team member 2] brings [expertise]. Together, we have [combined strength]."

**Ask (30 seconds):**
"We're raising [amount] at [valuation]. This will fund [use of funds]. We're looking for [type of investor] who can help with [value-add]."

**Closing:**
"Questions? I'd love to discuss how [Startup Name] can [vision]."`,
        meeting: `**Investor Meeting Script (30-45 minutes)**

**Pre-Meeting Prep:**
- Research the investor's portfolio
- Prepare 3-5 key talking points
- Have answers ready for common objections

**Opening (5 minutes):**
"Thanks for meeting. I know you've invested in [similar company/industry]. [Startup Name] is [one-sentence description]. I'd love to get your thoughts."

**Story (10 minutes):**
"Here's how we got here: [founder story]. We saw [problem] firsthand. We built [solution] and validated it with [early customers]. Now we're at [stage]."

**Deep Dive (15 minutes):**
- Product: "Let me show you how it works..."
- Market: "The opportunity is [size] because [reason]"
- Traction: "We're seeing [metrics] which indicates [insight]"
- Competition: "Unlike [competitor], we [differentiator]"

**Ask & Discussion (10 minutes):**
"We're raising [amount] to [goal]. I'd love your perspective on [specific question]. What do you think about [challenge]?"

**Next Steps (5 minutes):**
"If this aligns, I'd love to [next step]. Can I send you [materials]?"`,
        demo: `**Product Demo Script (5-7 minutes)**

**Hook (10 seconds):**
"Let me show you how [Startup Name] solves [problem] in real-time."

**Setup (30 seconds):**
"Here's the scenario: [User persona] needs to [use case]. Watch how we make this [10x better]."

**Demo Flow (4-5 minutes):**
1. **Login/Onboarding** (30s): "First, [user] signs up. Notice how [feature] makes this instant."

2. **Core Feature 1** (1.5 min): "Now, [user] wants to [action]. Watch: [demo steps]. See how [benefit]?"

3. **Core Feature 2** (1.5 min): "But what if [scenario]? [Demo]. This is where [differentiator] shines."

4. **Results** (1 min): "After using [Startup Name], [user] achieved [outcome]. This is why [customers] love us."

**Close (30 seconds):**
"This is just the beginning. With [funding], we'll add [future features]. Want to try it yourself?"`,
        followup: `**Follow-up Email Template**

Subject: Following up on [Startup Name] - [Specific Hook]

Hi [Investor Name],

Thanks for taking the time to [meeting/call] yesterday. I really appreciated your insights on [specific topic they mentioned].

As discussed, I'm following up with:
- [Attachment 1]: [Description]
- [Attachment 2]: [Description]

**Key Takeaways from Our Conversation:**
- [Point 1 they made]
- [Point 2 they made]
- [Action item you committed to]

**Quick Update:**
Since we spoke, we've [achievement/metric]. This validates [point you discussed].

**Next Steps:**
[If they showed interest]: I'd love to [next step]. Are you available [timeframe]?

[If they passed]: I understand this might not be the right fit. I'd still value your feedback on [specific question]. Would you be open to [alternative ask]?

Thanks again for your time and insights.

Best,
[Your Name]
[Startup Name]
[Contact Info]`
      };

      setScript(scripts[narrativeType] || 'Script will appear here...');
      setIsScripting(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-rose-600 rounded-xl flex items-center justify-center">
            <Presentation className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Co-Script Investor Narrative</h2>
            <p className="text-gray-600">Create investor narratives that resonate</p>
          </div>
        </div>

        <form onSubmit={handleScript}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What type of narrative?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {narrativeTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setNarrativeType(type.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    narrativeType === type.id
                      ? 'border-pink-600 bg-pink-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{type.name}</div>
                  <div className="text-sm text-gray-600">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tell me about your startup and the investor context
            </label>
            <textarea
              value={investorContext}
              onChange={(e) => setInvestorContext(e.target.value)}
              placeholder="What's your startup? What stage? Who's the investor? What's the meeting format? Any specific points to emphasize?"
              className="w-full h-40 p-4 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!narrativeType || !investorContext.trim() || isScripting}
            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isScripting ? (
              <>
                <Sparkles className="w-5 h-5 animate-pulse" />
                Co-Scripting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Generate Script
              </>
            )}
          </button>
        </form>
      </div>

      {script && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Your Investor Script
            </h3>
          </div>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-gray-800 bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
              {script}
            </pre>
          </div>
          <button
            onClick={() => {
              setInvestorContext('');
              setScript(null);
              setNarrativeType('');
            }}
            className="mt-4 text-pink-600 hover:text-pink-700 font-medium"
          >
            Generate another script
          </button>
        </div>
      )}
    </div>
  );
};

export default CoScript;

