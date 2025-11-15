import React, { useState } from 'react';
import {
  Search, Star, Clock, DollarSign, MapPin,
  CheckCircle, Users, Code, Palette, FileText, TrendingUp,
  Building2, Shield, Calculator, MessageCircle, Calendar,
  ArrowRight, X, SlidersHorizontal, Sparkles, Award,
  Globe, Briefcase, Heart, Share2, Eye, Target
} from 'lucide-react';

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const categories = [
    { id: 'all', label: 'All Services', icon: Sparkles },
    { id: 'developers', label: 'Developers', icon: Code },
    { id: 'designers', label: 'Designers', icon: Palette },
    { id: 'copywriters', label: 'Copywriters', icon: FileText },
    { id: 'marketers', label: 'Growth Marketers', icon: TrendingUp },
    { id: 'branding', label: 'Branding Studios', icon: Building2 },
    { id: 'legal', label: 'Legal', icon: Shield },
    { id: 'accounting', label: 'Accounting', icon: Calculator },
    { id: 'gtm', label: 'GTM Consultants', icon: Target }
  ];

  const serviceProviders = [
    {
      id: 1,
      name: 'Alex Chen',
      title: 'Full-Stack Developer',
      category: 'developers',
      rating: 4.9,
      reviews: 127,
      completedProjects: 45,
      hourlyRate: '$75',
      fixedPrice: '$2,500',
      location: 'San Francisco, CA',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      skills: ['React', 'Node.js', 'Python', 'AWS', 'PostgreSQL'],
      bio: 'Full-stack developer with 8+ years building scalable web applications. Specialized in MVP development for startups.',
      responseTime: 'Within 2 hours',
      verified: true,
      featured: true,
      portfolio: [
        { title: 'SaaS MVP', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800' },
        { title: 'E-commerce Platform', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800' }
      ],
      packages: [
        { name: 'MVP Development', price: '$5,000', duration: '4-6 weeks', features: ['Full-stack development', 'Database setup', 'Deployment'] },
        { name: 'Feature Development', price: '$1,500', duration: '1-2 weeks', features: ['Single feature', 'Code review', 'Testing'] }
      ]
    },
    {
      id: 2,
      name: 'Sarah Martinez',
      title: 'UI/UX Designer',
      category: 'designers',
      rating: 4.8,
      reviews: 89,
      completedProjects: 32,
      hourlyRate: '$65',
      fixedPrice: '$2,000',
      location: 'New York, NY',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      skills: ['Figma', 'UI/UX Design', 'Prototyping', 'Design Systems', 'User Research'],
      bio: 'Award-winning designer with expertise in creating beautiful, user-centered designs for startups and tech companies.',
      responseTime: 'Within 1 hour',
      verified: true,
      featured: true,
      portfolio: [
        { title: 'Mobile App Design', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800' },
        { title: 'SaaS Dashboard', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800' }
      ],
      packages: [
        { name: 'Complete UI/UX', price: '$3,500', duration: '3-4 weeks', features: ['Wireframes', 'High-fidelity designs', 'Prototype'] },
        { name: 'Design System', price: '$1,800', duration: '2 weeks', features: ['Component library', 'Style guide', 'Documentation'] }
      ]
    },
    {
      id: 3,
      name: 'David Kim',
      title: 'Copywriter & Content Strategist',
      category: 'copywriters',
      rating: 4.9,
      reviews: 156,
      completedProjects: 67,
      hourlyRate: '$50',
      fixedPrice: '$1,200',
      location: 'Austin, TX',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      skills: ['Copywriting', 'Content Strategy', 'SEO', 'Landing Pages', 'Email Marketing'],
      bio: 'Conversion-focused copywriter helping startups craft compelling messaging that drives growth.',
      responseTime: 'Within 3 hours',
      verified: true,
      featured: false,
      portfolio: [
        { title: 'Landing Page Copy', image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800' },
        { title: 'Email Campaign', image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800' }
      ],
      packages: [
        { name: 'Complete Copy Package', price: '$2,000', duration: '2 weeks', features: ['Landing page', 'Email sequences', 'Social media'] },
        { name: 'Landing Page Copy', price: '$800', duration: '3-5 days', features: ['Hero section', 'Features', 'CTA optimization'] }
      ]
    },
    {
      id: 4,
      name: 'TechGrowth Agency',
      title: 'Growth Marketing Agency',
      category: 'marketers',
      rating: 4.7,
      reviews: 203,
      completedProjects: 89,
      hourlyRate: '$100',
      fixedPrice: '$4,000',
      location: 'Los Angeles, CA',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop',
      skills: ['Growth Hacking', 'Paid Ads', 'SEO', 'Content Marketing', 'Analytics'],
      bio: 'Full-service growth marketing agency specializing in scaling early-stage startups from 0 to 10K users.',
      responseTime: 'Within 4 hours',
      verified: true,
      featured: true,
      portfolio: [
        { title: 'SaaS Growth Campaign', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800' },
        { title: 'E-commerce Launch', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800' }
      ],
      packages: [
        { name: 'Growth Sprint', price: '$5,000', duration: '1 month', features: ['Strategy', 'Campaign setup', 'Optimization'] },
        { name: 'Launch Campaign', price: '$3,000', duration: '2 weeks', features: ['Pre-launch', 'Launch day', 'Post-launch'] }
      ]
    },
    {
      id: 5,
      name: 'BrandCraft Studio',
      title: 'Branding & Identity Studio',
      category: 'branding',
      rating: 4.8,
      reviews: 94,
      completedProjects: 41,
      hourlyRate: '$85',
      fixedPrice: '$3,500',
      location: 'Chicago, IL',
      avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop',
      skills: ['Brand Identity', 'Logo Design', 'Brand Guidelines', 'Packaging', 'Web Design'],
      bio: 'Creative branding studio helping startups build memorable brands that resonate with their audience.',
      responseTime: 'Within 6 hours',
      verified: true,
      featured: false,
      portfolio: [
        { title: 'Tech Startup Brand', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800' },
        { title: 'Food Brand Identity', image: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=800' }
      ],
      packages: [
        { name: 'Complete Brand Identity', price: '$4,500', duration: '4-6 weeks', features: ['Logo', 'Brand guidelines', 'Business cards'] },
        { name: 'Logo & Basic Identity', price: '$1,500', duration: '2 weeks', features: ['Logo design', 'Color palette', 'Typography'] }
      ]
    },
    {
      id: 6,
      name: 'Startup Legal Partners',
      title: 'Startup Legal Services',
      category: 'legal',
      rating: 4.9,
      reviews: 178,
      completedProjects: 120,
      hourlyRate: '$200',
      fixedPrice: '$1,500',
      location: 'San Francisco, CA',
      avatar: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=400&fit=crop',
      skills: ['Incorporation', 'Founder Agreements', 'IP Protection', 'Terms of Service', 'Privacy Policy'],
      bio: 'Legal experts specializing in startup law, helping founders navigate legal requirements from day one.',
      responseTime: 'Within 24 hours',
      verified: true,
      featured: true,
      portfolio: [
        { title: 'Startup Incorporation', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800' }
      ],
      packages: [
        { name: 'Complete Legal Setup', price: '$2,500', duration: '1-2 weeks', features: ['Incorporation', 'Founder agreements', 'IP assignment'] },
        { name: 'Legal Documents', price: '$800', duration: '3-5 days', features: ['Terms of Service', 'Privacy Policy', 'NDA'] }
      ]
    },
    {
      id: 7,
      name: 'FinanceFlow Accounting',
      title: 'Startup Accounting Services',
      category: 'accounting',
      rating: 4.7,
      reviews: 112,
      completedProjects: 78,
      hourlyRate: '$90',
      fixedPrice: '$1,200',
      location: 'Seattle, WA',
      avatar: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=400&h=400&fit=crop',
      skills: ['Bookkeeping', 'Tax Preparation', 'Financial Modeling', 'Payroll', 'Compliance'],
      bio: 'Accounting firm dedicated to helping startups manage finances, prepare taxes, and maintain compliance.',
      responseTime: 'Within 12 hours',
      verified: true,
      featured: false,
      portfolio: [
        { title: 'Financial Setup', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800' }
      ],
      packages: [
        { name: 'Monthly Accounting', price: '$500/month', duration: 'Ongoing', features: ['Bookkeeping', 'Reports', 'Tax prep'] },
        { name: 'Financial Model', price: '$1,500', duration: '1 week', features: ['3-year projections', 'Scenario analysis', 'Pitch deck ready'] }
      ]
    },
    {
      id: 8,
      name: 'GTM Strategy Co',
      title: 'Go-To-Market Consultant',
      category: 'gtm',
      rating: 4.8,
      reviews: 145,
      completedProjects: 56,
      hourlyRate: '$150',
      fixedPrice: '$3,000',
      location: 'Boston, MA',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      skills: ['GTM Strategy', 'Market Research', 'Pricing Strategy', 'Sales Enablement', 'Channel Strategy'],
      bio: 'GTM consultants with 15+ years helping startups launch successfully and scale their go-to-market operations.',
      responseTime: 'Within 8 hours',
      verified: true,
      featured: true,
      portfolio: [
        { title: 'SaaS GTM Launch', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800' }
      ],
      packages: [
        { name: 'Complete GTM Strategy', price: '$4,000', duration: '4 weeks', features: ['Market analysis', 'Strategy document', 'Implementation plan'] },
        { name: 'GTM Workshop', price: '$1,500', duration: '2 days', features: ['Strategy session', 'Action plan', 'Follow-up call'] }
      ]
    }
  ];

  const filteredProviders = serviceProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || provider.category === selectedCategory;
    const matchesRating = selectedRating === 'all' || provider.rating >= parseFloat(selectedRating);
    
    return matchesSearch && matchesCategory && matchesRating;
  });

  const renderProviderCard = (provider) => {
    const CategoryIcon = categories.find(c => c.id === provider.category)?.icon || Sparkles;
    
    return (
      <div
        key={provider.id}
        className="bg-white rounded-2xl border-2 border-gray-200 hover:border-gray-900 transition-all overflow-hidden cursor-pointer group"
        onClick={() => setSelectedProvider(provider)}
      >
        {provider.featured && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold flex items-center gap-2">
            <Award className="w-4 h-4" />
            Featured Provider
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <img
                src={provider.avatar}
                alt={provider.name}
                className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200"
              />
              {provider.verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900 text-lg">{provider.name}</h3>
                {provider.verified && (
                  <span className="text-xs text-green-600 font-medium">Verified</span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-2">{provider.title}</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-gray-900">{provider.rating}</span>
                  <span className="text-xs text-gray-500">({provider.reviews})</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  {provider.location}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <CategoryIcon className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-600 uppercase">
                {categories.find(c => c.id === provider.category)?.label}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{provider.bio}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {provider.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
            {provider.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                +{provider.skills.length - 3} more
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-200">
            <div>
              <div className="text-xs text-gray-500 mb-1">Starting at</div>
              <div className="font-bold text-gray-900">{provider.fixedPrice}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">Response time</div>
              <div className="text-sm font-medium text-gray-700">{provider.responseTime}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors font-semibold text-sm">
              View Profile
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderProviderDetail = () => {
    if (!selectedProvider) return null;

    const CategoryIcon = categories.find(c => c.id === selectedProvider.category)?.icon || Sparkles;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-4xl w-full my-8 shadow-2xl">
          <div className="relative">
            <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <button
              onClick={() => setSelectedProvider(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            <div className="px-8 pb-8 -mt-16">
              <div className="flex items-start gap-6 mb-6">
                <img
                  src={selectedProvider.avatar}
                  alt={selectedProvider.name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
                <div className="flex-1 pt-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-gray-900">{selectedProvider.name}</h2>
                    {selectedProvider.verified && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xl text-gray-600 mb-3">{selectedProvider.title}</p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-lg font-bold text-gray-900">{selectedProvider.rating}</span>
                      <span className="text-sm text-gray-600">({selectedProvider.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {selectedProvider.location}
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      {selectedProvider.completedProjects} projects
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">
                      {categories.find(c => c.id === selectedProvider.category)?.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">About</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedProvider.bio}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProvider.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-full font-medium border border-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Service Packages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProvider.packages.map((pkg, idx) => (
                    <div key={idx} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-gray-900 transition-colors">
                      <h4 className="font-bold text-gray-900 mb-2">{pkg.name}</h4>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{pkg.price}</div>
                      <div className="text-sm text-gray-600 mb-4">{pkg.duration}</div>
                      <ul className="space-y-2 mb-4">
                        {pkg.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button className="w-full py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors font-semibold">
                        Book This Package
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {selectedProvider.portfolio && selectedProvider.portfolio.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Portfolio</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProvider.portfolio.map((item, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden border border-gray-200">
                        <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
                        <div className="p-3 bg-gray-50">
                          <p className="text-sm font-medium text-gray-900">{item.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors font-semibold flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Contact Provider
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for developers, designers, marketers..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 ${
              showFilters
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="all">All Prices</option>
                  <option value="under-1k">Under $1,000</option>
                  <option value="1k-3k">$1,000 - $3,000</option>
                  <option value="3k-5k">$3,000 - $5,000</option>
                  <option value="over-5k">Over $5,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="all">All Ratings</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-colors ${
                      viewMode === 'list'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            Found <span className="font-semibold text-gray-900">{filteredProviders.length}</span> service providers
          </p>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map(renderProviderCard)}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProviders.map(provider => (
              <div
                key={provider.id}
                className="bg-white rounded-2xl border-2 border-gray-200 hover:border-gray-900 transition-all p-6 cursor-pointer"
                onClick={() => setSelectedProvider(provider)}
              >
                <div className="flex items-center gap-6">
                  <img
                    src={provider.avatar}
                    alt={provider.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900 text-xl">{provider.name}</h3>
                      {provider.verified && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{provider.title}</p>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-gray-900">{provider.rating}</span>
                        <span className="text-sm text-gray-500">({provider.reviews})</span>
                      </div>
                      <span className="text-sm text-gray-600">{provider.location}</span>
                      <span className="text-sm text-gray-600">{provider.completedProjects} projects</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{provider.bio}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{provider.fixedPrice}</div>
                    <div className="text-sm text-gray-600 mb-4">Starting at</div>
                    <button className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors font-semibold">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProviders.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No providers found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {renderProviderDetail()}
    </div>
  );
};

export default Marketplace;

