import React, { useState } from 'react';
import { Brain, Send, Sparkles, ArrowLeft, Lightbulb, Target, TrendingUp } from 'lucide-react';

const CoThink = ({ onBack }) => {
  const [idea, setIdea] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idea.trim()) return;

    const userMessage = { role: 'user', content: idea };
    setConversation(prev => [...prev, userMessage]);
    setIdea('');
    setIsThinking(true);

    setTimeout(() => {
      const aiResponse = {
        role: 'ai',
        content: `Great idea! Let me help you think through this. Based on your concept, here are some key considerations:

1. **Market Validation**: Have you identified your target customer? What problem are you solving that they're willing to pay for?

2. **Competitive Landscape**: Who else is solving this problem? What makes your approach unique?

3. **Scalability**: How does this idea scale? What's the path from MVP to $1M ARR?

4. **Team Requirements**: What skills are essential to build this? What's your biggest gap?

5. **Revenue Model**: How will you make money? What's the unit economics?

Let's dive deeper into any of these areas. What aspect would you like to explore first?`
      };
      setConversation(prev => [...prev, aiResponse]);
      setIsThinking(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Co-Think Your Idea</h2>
            <p className="text-gray-600">Let's refine your startup concept together</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your startup idea... What problem are you solving? Who is your target customer? What makes your solution unique?"
            className="w-full h-32 p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
          />
          <button
            type="submit"
            disabled={!idea.trim() || isThinking}
            className="mt-4 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isThinking ? (
              <>
                <Sparkles className="w-5 h-5 animate-pulse" />
                Thinking...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Co-Think This Idea
              </>
            )}
          </button>
        </form>
      </div>

      {conversation.length > 0 && (
        <div className="space-y-4">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-xl ${
                msg.role === 'user'
                  ? 'bg-purple-50 border-2 border-purple-200 ml-8'
                  : 'bg-white border-2 border-gray-200 shadow-md mr-8'
              }`}
            >
              <div className="flex items-start gap-3">
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-gray-800 whitespace-pre-line leading-relaxed">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {conversation.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <Lightbulb className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Co-Think?</h3>
            <p className="text-gray-600 mb-6">
              Share your startup idea above and I'll help you refine it, challenge assumptions, and explore new angles.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 bg-purple-50 rounded-xl">
                <Target className="w-6 h-6 text-purple-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Market Validation</h4>
                <p className="text-sm text-gray-600">Validate your target market and customer needs</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Growth Strategy</h4>
                <p className="text-sm text-gray-600">Explore paths to scale and sustainable growth</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <Brain className="w-6 h-6 text-purple-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Idea Refinement</h4>
                <p className="text-sm text-gray-600">Challenge assumptions and find blind spots</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoThink;

