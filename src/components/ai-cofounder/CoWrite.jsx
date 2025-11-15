import React, { useState } from 'react';
import { PenTool, Send, Sparkles, FileText, Download, Copy, Check } from 'lucide-react';

const CoWrite = ({ onBack }) => {
  const [pitchType, setPitchType] = useState('');
  const [context, setContext] = useState('');
  const [generatedPitch, setGeneratedPitch] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const pitchTypes = [
    { id: 'elevator', name: 'Elevator Pitch', description: '30-second pitch' },
    { id: 'email', name: 'Email Pitch', description: 'Cold outreach email' },
    { id: 'deck', name: 'Pitch Deck Slide', description: 'Individual slide content' },
    { id: 'demo', name: 'Demo Script', description: 'Product demo narrative' },
    { id: 'social', name: 'Social Media', description: 'LinkedIn/Twitter post' }
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!pitchType || !context.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      const templates = {
        elevator: `Here's your 30-second elevator pitch:

"[Your Startup Name] solves [problem] for [target audience] by [unique solution]. Unlike [competitor], we [differentiator]. We're already seeing [traction/metric]. We're raising [amount] to [use of funds]."

Practice this until it flows naturally. The key is confidence and clarity.`,
        email: `Subject: [Compelling Subject Line]

Hi [Name],

I'm reaching out because [personal connection/reason]. 

[Your Startup Name] is [one sentence description]. We're solving [problem] for [target audience] who currently [current pain point].

We've already [traction]. I'd love to [specific ask] - would you be open to a [15-minute call/coffee]?

Best,
[Your Name]`,
        deck: `**Slide Title: [Compelling Headline]**

**Key Points:**
- [Main point 1 with supporting data]
- [Main point 2 with supporting data]
- [Main point 3 with supporting data]

**Visual Recommendation:** [Chart/graph/image suggestion]

**Speaker Notes:** [What to say when presenting this slide]`,
        demo: `**Demo Script:**

1. **Hook (0-10s):** "Let me show you how [Startup Name] solves [problem] in 2 minutes."

2. **Problem (10-30s):** "Right now, [target audience] struggles with [pain point]. This costs them [time/money/frustration]."

3. **Solution (30-90s):** "Watch this: [Step-by-step demo]. See how [key feature] makes this [10x better/faster/easier]?"

4. **Close (90-120s):** "Want to try it? [CTA]"`
      };

      setGeneratedPitch(templates[pitchType] || 'Generated pitch content will appear here...');
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
            <PenTool className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Co-Write Your Pitch</h2>
            <p className="text-gray-600">Craft compelling pitches with AI assistance</p>
          </div>
        </div>

        <form onSubmit={handleGenerate}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">What type of pitch?</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {pitchTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setPitchType(type.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    pitchType === type.id
                      ? 'border-blue-600 bg-blue-50'
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
              Tell me about your startup
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Describe your startup, target market, key features, traction, team, and what makes you unique..."
              className="w-full h-40 p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!pitchType || !context.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 animate-pulse" />
                Co-Writing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Generate Pitch
              </>
            )}
          </button>
        </form>
      </div>

      {generatedPitch && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Your Generated Pitch
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-600" />}
              </button>
              <button
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-gray-800 bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
              {generatedPitch}
            </pre>
          </div>
          <button
            onClick={() => {
              setContext('');
              setGeneratedPitch('');
              setPitchType('');
            }}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Generate another pitch
          </button>
        </div>
      )}
    </div>
  );
};

export default CoWrite;

