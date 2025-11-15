import React, { useState } from 'react';
import { Layout, Send, Sparkles, Layers, Code, Smartphone, Globe } from 'lucide-react';

const CoDesign = ({ onBack }) => {
  const [productDescription, setProductDescription] = useState('');
  const [designFocus, setDesignFocus] = useState('');
  const [mvpPlan, setMvpPlan] = useState(null);
  const [isDesigning, setIsDesigning] = useState(false);

  const focusAreas = [
    { id: 'architecture', name: 'System Architecture', icon: Layers },
    { id: 'features', name: 'Core Features', icon: Code },
    { id: 'ui', name: 'User Interface', icon: Smartphone },
    { id: 'tech', name: 'Tech Stack', icon: Globe }
  ];

  const handleDesign = async (e) => {
    e.preventDefault();
    if (!productDescription.trim()) return;

    setIsDesigning(true);
    setTimeout(() => {
      setMvpPlan({
        architecture: {
          title: 'System Architecture',
          content: `**Recommended Architecture:**

1. **Frontend**: React/Vue.js for responsive web app
   - Component-based architecture
   - State management (Redux/Zustand)
   - Real-time updates via WebSockets

2. **Backend**: Node.js/Python (FastAPI)
   - RESTful API + GraphQL for flexibility
   - Microservices for scalability
   - Database: PostgreSQL (primary) + Redis (caching)

3. **Infrastructure**: 
   - Cloud: AWS/GCP
   - CDN: Cloudflare
   - CI/CD: GitHub Actions

4. **Third-party Integrations**:
   - Payment: Stripe
   - Auth: Auth0 or Firebase Auth
   - Analytics: Mixpanel/Amplitude`
        },
        features: {
          title: 'MVP Core Features',
          content: `**Must-Have Features (MVP):**

1. **User Authentication & Profiles**
   - Sign up/login
   - Basic profile management
   - Onboarding flow

2. **Core Value Proposition**
   - [Primary feature that solves main problem]
   - [Secondary feature that enhances value]

3. **Basic Dashboard**
   - Overview of key metrics
   - Quick actions

**Nice-to-Have (Post-MVP):**
- Advanced analytics
- Social features
- Integrations
- Mobile apps`
        },
        ui: {
          title: 'UI/UX Recommendations',
          content: `**Design Principles:**

1. **Simplicity First**
   - Clean, minimal interface
   - Focus on core user flow
   - Remove friction points

2. **Key Screens:**
   - Landing page (value prop clear in 5 seconds)
   - Onboarding (3-step max)
   - Main dashboard (80/20 rule)
   - Settings (minimal, essential only)

3. **Design System:**
   - Consistent color palette (2-3 primary colors)
   - Clear typography hierarchy
   - Reusable component library
   - Mobile-first responsive design`
        },
        tech: {
          title: 'Tech Stack Recommendation',
          content: `**Recommended Stack:**

**Frontend:**
- Framework: React.js or Next.js
- Styling: Tailwind CSS
- UI Components: shadcn/ui or Material-UI
- State: Zustand or React Query

**Backend:**
- Runtime: Node.js or Python (FastAPI)
- Database: PostgreSQL
- Caching: Redis
- File Storage: AWS S3 or Cloudinary

**DevOps:**
- Hosting: Vercel (frontend) + Railway/Render (backend)
- Monitoring: Sentry
- Analytics: PostHog or Mixpanel`
        }
      });
      setIsDesigning(false);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
            <Layout className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Co-Design Your MVP</h2>
            <p className="text-gray-600">Design your MVP architecture with AI guidance</p>
          </div>
        </div>

        <form onSubmit={handleDesign}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your product
            </label>
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="What are you building? What problem does it solve? Who is the target user? What are the key features?"
              className="w-full h-40 p-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none resize-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Focus area (optional)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {focusAreas.map((area) => {
                const Icon = area.icon;
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => setDesignFocus(area.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      designFocus === area.id
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${designFocus === area.id ? 'text-green-600' : 'text-gray-600'}`} />
                    <div className="text-sm font-medium text-gray-900">{area.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={!productDescription.trim() || isDesigning}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDesigning ? (
              <>
                <Sparkles className="w-5 h-5 animate-pulse" />
                Co-Designing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Generate MVP Design
              </>
            )}
          </button>
        </form>
      </div>

      {mvpPlan && (
        <div className="space-y-6">
          {Object.entries(mvpPlan).map(([key, section]) => (
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
              setProductDescription('');
              setMvpPlan(null);
              setDesignFocus('');
            }}
            className="w-full text-green-600 hover:text-green-700 font-medium py-3"
          >
            Design another MVP
          </button>
        </div>
      )}
    </div>
  );
};

export default CoDesign;

