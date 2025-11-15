import React, { useState } from 'react';
import { Handshake, Send, Sparkles, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const CoSolve = ({ onBack }) => {
  const [conflictDescription, setConflictDescription] = useState('');
  const [parties, setParties] = useState('');
  const [resolution, setResolution] = useState(null);
  const [isResolving, setIsResolving] = useState(false);

  const handleResolve = async (e) => {
    e.preventDefault();
    if (!conflictDescription.trim()) return;

    setIsResolving(true);
    setTimeout(() => {
      setResolution({
        understanding: {
          title: 'Understanding the Conflict',
          content: `**Root Cause Analysis:**

Based on your description, this conflict appears to stem from:
- [Identified root cause 1]
- [Identified root cause 2]
- [Underlying issue]

**Perspectives:**
- **Party 1's View:** [Their likely perspective]
- **Party 2's View:** [Their likely perspective]

**Common Ground:**
Both parties likely want: [shared goal/interest]

**Key Insight:** Most cofounder conflicts aren't about the issue itself, but about:
- Unclear expectations
- Misaligned values
- Communication breakdown
- Role ambiguity`
        },
        approach: {
          title: 'Recommended Resolution Approach',
          content: `**Step 1: Create Safe Space (30 min)**
- Schedule a dedicated meeting (not during work)
- Set ground rules: listen first, no interruptions
- Use "I feel" statements, not "You always" statements

**Step 2: Identify Core Issue (45 min)**
- What's the real problem? (Not the symptom)
- What does each party need?
- What are non-negotiables vs. negotiables?

**Step 3: Find Common Ground (30 min)**
- What do you both agree on?
- What's the shared goal?
- What's the vision you're both working toward?

**Step 4: Propose Solutions (45 min)**
- Brainstorm 3-5 options together
- Evaluate: Does this solve the root cause?
- Choose solution that addresses both parties' needs

**Step 5: Document & Commit (15 min)**
- Write down the agreement
- Set check-in date (1 week, 1 month)
- Define success metrics`
        },
        solutions: {
          title: 'Potential Solutions',
          content: `**Option 1: [Solution Name]**
- How it works: [Description]
- Pros: [Benefits]
- Cons: [Drawbacks]
- Best if: [When this works]

**Option 2: [Solution Name]**
- How it works: [Description]
- Pros: [Benefits]
- Cons: [Drawbacks]
- Best if: [When this works]

**Option 3: Compromise Approach**
- [Hybrid solution]
- [How it balances both needs]

**Recommendation:** [Suggested approach based on conflict type]`
        },
        prevention: {
          title: 'Preventing Future Conflicts',
          content: `**Immediate Actions:**
- Document roles and responsibilities clearly
- Set up weekly 1-on-1s between cofounders
- Create decision-making framework (who decides what)
- Establish communication norms

**Long-term:**
- Regular team retrospectives
- Clear equity/vesting agreements
- Advisory board or mentor for mediation
- Shared values document

**Red Flags to Watch:**
- [Warning sign 1]
- [Warning sign 2]
- [Warning sign 3]

**Remember:** Healthy disagreement is good. Unresolved conflict is toxic. Address issues early.`
        }
      });
      setIsResolving(false);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-xl flex items-center justify-center">
            <Handshake className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Co-Solve Conflicts</h2>
            <p className="text-gray-600">Resolve conflicts between cofounders with AI mediation</p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-gray-900">Confidential & Neutral</h3>
          </div>
          <p className="text-sm text-gray-700">
            This is a safe space. Describe the conflict objectively, and I'll help mediate a resolution.
          </p>
        </div>

        <form onSubmit={handleResolve}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Who are the parties involved?
            </label>
            <input
              type="text"
              value={parties}
              onChange={(e) => setParties(e.target.value)}
              placeholder="e.g., Co-founder A and Co-founder B, or Team Member X and Team Member Y"
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe the conflict (be as objective as possible)
            </label>
            <textarea
              value={conflictDescription}
              onChange={(e) => setConflictDescription(e.target.value)}
              placeholder="What's the issue? When did it start? What are the different perspectives? What's been tried so far? How is it affecting the team/startup?"
              className="w-full h-40 p-4 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!conflictDescription.trim() || isResolving}
            className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isResolving ? (
              <>
                <Sparkles className="w-5 h-5 animate-pulse" />
                Analyzing Conflict...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Get Resolution Plan
              </>
            )}
          </button>
        </form>
      </div>

      {resolution && (
        <div className="space-y-6">
          {Object.entries(resolution).map(([key, section]) => (
            <div key={key} className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h3>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-gray-800 bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                  {section.content}
                </pre>
              </div>
            </div>
          ))}
          <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Next Steps</h3>
            </div>
            <p className="text-gray-700">
              Schedule a meeting with all parties. Use the resolution approach above. Remember: the goal isn't to "win" but to find a solution that works for everyone and the startup.
            </p>
          </div>
          <button
            onClick={() => {
              setConflictDescription('');
              setResolution(null);
              setParties('');
            }}
            className="w-full text-amber-600 hover:text-amber-700 font-medium py-3"
          >
            Resolve another conflict
          </button>
        </div>
      )}

      {!resolution && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <Users className="w-16 h-16 text-amber-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Conflict Resolution</h3>
            <p className="text-gray-600 mb-6">
              Describe the conflict above and I'll help you understand the root cause, propose solutions, and create a resolution plan.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 bg-amber-50 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-amber-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Neutral Mediation</h4>
                <p className="text-sm text-gray-600">Objective analysis without bias</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl">
                <Handshake className="w-6 h-6 text-amber-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Win-Win Solutions</h4>
                <p className="text-sm text-gray-600">Find solutions that work for all</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl">
                <CheckCircle className="w-6 h-6 text-amber-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Prevention</h4>
                <p className="text-sm text-gray-600">Stop conflicts before they start</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoSolve;

