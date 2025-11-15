import React, { useState, useEffect } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, Calculator, Target,
  BarChart3, PieChart, LineChart, Users, Zap, Sparkles,
  ChevronRight, ChevronDown, Save, Download, Upload,
  RefreshCw, Info, AlertCircle, CheckCircle, X,
  Plus, Minus, Edit3, Trash2, Copy, Share2,
  ArrowUp, ArrowDown, Activity, CreditCard, Calendar,
  Building2, ShoppingCart, Package, Layers, FileText
} from 'lucide-react';

const RevenueModelBuilder = () => {
  const [activeTab, setActiveTab] = useState('pricing');
  const [pricingData, setPricingData] = useState({
    basePrice: 29,
    priceRange: { min: 9, max: 199 },
    elasticity: 1.5,
    demandAtPrice: {},
    revenueProjection: {}
  });
  const [unitEconomics, setUnitEconomics] = useState({
    revenuePerUnit: 50,
    costPerUnit: 20,
    grossMargin: 0,
    contributionMargin: 0,
    fixedCosts: 10000,
    variableCosts: 15,
    breakEvenUnits: 0
  });
  const [cacLtv, setCacLtv] = useState({
    cac: 50,
    ltv: 300,
    ltvCacRatio: 0,
    paybackPeriod: 0,
    monthlyChurn: 0.05,
    arpu: 50,
    grossMargin: 0.7
  });
  const [subscriptionModel, setSubscriptionModel] = useState({
    tiers: [
      { id: 1, name: 'Starter', price: 9, features: ['Basic features'], users: 0 },
      { id: 2, name: 'Professional', price: 29, features: ['All features', 'Priority support'], users: 0 },
      { id: 3, name: 'Enterprise', price: 99, features: ['All features', 'Dedicated support', 'Custom integrations'], users: 0 }
    ],
    billingCycle: 'monthly',
    trialDays: 14
  });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [savedModels, setSavedModels] = useState([]);

  useEffect(() => {
    calculatePricingMetrics();
    calculateUnitEconomics();
    calculateCacLtv();
  }, [pricingData, unitEconomics, cacLtv]);

  const calculatePricingMetrics = () => {
    const { basePrice, elasticity, priceRange } = pricingData;
    const demandAtPrice = {};
    const revenueProjection = {};

    for (let price = priceRange.min; price <= priceRange.max; price += 10) {
      const priceChange = (price - basePrice) / basePrice;
      const demandChange = -elasticity * priceChange;
      const demand = Math.max(0, Math.min(1, 1 + demandChange));
      const revenue = price * demand * 1000;
      
      demandAtPrice[price] = demand;
      revenueProjection[price] = revenue;
    }

    setPricingData(prev => ({
      ...prev,
      demandAtPrice,
      revenueProjection
    }));
  };

  const calculateUnitEconomics = () => {
    const { revenuePerUnit, costPerUnit, variableCosts, fixedCosts } = unitEconomics;
    const grossMargin = ((revenuePerUnit - costPerUnit) / revenuePerUnit) * 100;
    const contributionMargin = ((revenuePerUnit - variableCosts) / revenuePerUnit) * 100;
    const breakEvenUnits = fixedCosts / (revenuePerUnit - variableCosts);

    setUnitEconomics(prev => ({
      ...prev,
      grossMargin: isNaN(grossMargin) ? 0 : grossMargin,
      contributionMargin: isNaN(contributionMargin) ? 0 : contributionMargin,
      breakEvenUnits: isNaN(breakEvenUnits) || breakEvenUnits < 0 ? 0 : Math.ceil(breakEvenUnits)
    }));
  };

  const calculateCacLtv = () => {
    const { cac, arpu, monthlyChurn, grossMargin } = cacLtv;
    const ltv = (arpu * grossMargin) / monthlyChurn;
    const ltvCacRatio = ltv / cac;
    const paybackPeriod = cac / (arpu * grossMargin);

    setCacLtv(prev => ({
      ...prev,
      ltv: isNaN(ltv) ? 0 : Math.round(ltv),
      ltvCacRatio: isNaN(ltvCacRatio) ? 0 : Number(ltvCacRatio.toFixed(2)),
      paybackPeriod: isNaN(paybackPeriod) ? 0 : Number(paybackPeriod.toFixed(1))
    }));
  };

  const businessModelTemplates = [
    {
      id: 'saas',
      name: 'SaaS Subscription',
      icon: CreditCard,
      description: 'Recurring monthly/annual subscriptions',
      metrics: {
        revenuePerUnit: 49,
        costPerUnit: 10,
        variableCosts: 5,
        fixedCosts: 50000,
        cac: 100,
        arpu: 49,
        monthlyChurn: 0.05
      }
    },
    {
      id: 'marketplace',
      name: 'Marketplace',
      icon: ShoppingCart,
      description: 'Transaction-based commission model',
      metrics: {
        revenuePerUnit: 15,
        costPerUnit: 2,
        variableCosts: 1,
        fixedCosts: 30000,
        cac: 75,
        arpu: 15,
        monthlyChurn: 0.15
      }
    },
    {
      id: 'freemium',
      name: 'Freemium',
      icon: Layers,
      description: 'Free tier with premium upgrades',
      metrics: {
        revenuePerUnit: 29,
        costPerUnit: 8,
        variableCosts: 3,
        fixedCosts: 40000,
        cac: 50,
        arpu: 29,
        monthlyChurn: 0.08
      }
    },
    {
      id: 'usage',
      name: 'Usage-Based',
      icon: Activity,
      description: 'Pay per use or consumption',
      metrics: {
        revenuePerUnit: 0.10,
        costPerUnit: 0.02,
        variableCosts: 0.01,
        fixedCosts: 25000,
        cac: 60,
        arpu: 35,
        monthlyChurn: 0.10
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise Sales',
      icon: Building2,
      description: 'High-value annual contracts',
      metrics: {
        revenuePerUnit: 50000,
        costPerUnit: 10000,
        variableCosts: 5000,
        fixedCosts: 200000,
        cac: 5000,
        arpu: 4167,
        monthlyChurn: 0.01
      }
    },
    {
      id: 'advertising',
      name: 'Advertising',
      icon: BarChart3,
      description: 'Ad revenue model',
      metrics: {
        revenuePerUnit: 2,
        costPerUnit: 0.5,
        variableCosts: 0.2,
        fixedCosts: 60000,
        cac: 30,
        arpu: 2,
        monthlyChurn: 0.20
      }
    }
  ];

  const applyTemplate = (template) => {
    const { metrics } = template;
    setUnitEconomics(prev => ({
      ...prev,
      revenuePerUnit: metrics.revenuePerUnit,
      costPerUnit: metrics.costPerUnit,
      variableCosts: metrics.variableCosts,
      fixedCosts: metrics.fixedCosts
    }));
    setCacLtv(prev => ({
      ...prev,
      cac: metrics.cac,
      arpu: metrics.arpu,
      monthlyChurn: metrics.monthlyChurn
    }));
    setSelectedTemplate(template.id);
  };

  const addSubscriptionTier = () => {
    const newTier = {
      id: Date.now(),
      name: `Tier ${subscriptionModel.tiers.length + 1}`,
      price: 0,
      features: [],
      users: 0
    };
    setSubscriptionModel(prev => ({
      ...prev,
      tiers: [...prev.tiers, newTier]
    }));
  };

  const removeSubscriptionTier = (id) => {
    if (subscriptionModel.tiers.length <= 1) return;
    setSubscriptionModel(prev => ({
      ...prev,
      tiers: prev.tiers.filter(tier => tier.id !== id)
    }));
  };

  const updateSubscriptionTier = (id, field, value) => {
    setSubscriptionModel(prev => ({
      ...prev,
      tiers: prev.tiers.map(tier =>
        tier.id === id ? { ...tier, [field]: value } : tier
      )
    }));
  };

  const addFeatureToTier = (tierId, feature) => {
    setSubscriptionModel(prev => ({
      ...prev,
      tiers: prev.tiers.map(tier =>
        tier.id === tierId
          ? { ...tier, features: [...tier.features, feature] }
          : tier
      )
    }));
  };

  const removeFeatureFromTier = (tierId, featureIndex) => {
    setSubscriptionModel(prev => ({
      ...prev,
      tiers: prev.tiers.map(tier =>
        tier.id === tierId
          ? { ...tier, features: tier.features.filter((_, i) => i !== featureIndex) }
          : tier
      )
    }));
  };

  const saveModel = () => {
    const model = {
      id: Date.now(),
      name: `Revenue Model ${new Date().toLocaleDateString()}`,
      timestamp: new Date().toISOString(),
      pricingData,
      unitEconomics,
      cacLtv,
      subscriptionModel
    };
    setSavedModels(prev => [...prev, model]);
  };

  const loadModel = (model) => {
    setPricingData(model.pricingData);
    setUnitEconomics(model.unitEconomics);
    setCacLtv(model.cacLtv);
    setSubscriptionModel(model.subscriptionModel);
  };

  const exportData = () => {
    const data = {
      pricingData,
      unitEconomics,
      cacLtv,
      subscriptionModel,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-model-${Date.now()}.json`;
    a.click();
  };

  const tabs = [
    { id: 'pricing', label: 'Pricing Simulator', icon: DollarSign },
    { id: 'unit', label: 'Unit Economics', icon: Calculator },
    { id: 'cacltv', label: 'CAC/LTV', icon: TrendingUp },
    { id: 'subscription', label: 'Subscription Builder', icon: CreditCard },
    { id: 'templates', label: 'Templates', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100 mb-8">
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          <div className="p-4 md:p-6 lg:p-8">
            {activeTab === 'pricing' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Base Price ($)
                      </label>
                      <input
                        type="number"
                        value={pricingData.basePrice}
                        onChange={(e) => setPricingData(prev => ({
                          ...prev,
                          basePrice: Number(e.target.value)
                        }))}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white shadow-sm hover:shadow-md"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Min Price ($)
                        </label>
                        <input
                          type="number"
                          value={pricingData.priceRange.min}
                          onChange={(e) => setPricingData(prev => ({
                            ...prev,
                            priceRange: { ...prev.priceRange, min: Number(e.target.value) }
                          }))}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white shadow-sm hover:shadow-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Max Price ($)
                        </label>
                        <input
                          type="number"
                          value={pricingData.priceRange.max}
                          onChange={(e) => setPricingData(prev => ({
                            ...prev,
                            priceRange: { ...prev.priceRange, max: Number(e.target.value) }
                          }))}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white shadow-sm hover:shadow-md"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Price Elasticity
                        <span className="ml-2 text-xs text-slate-500">(demand sensitivity)</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={pricingData.elasticity}
                        onChange={(e) => setPricingData(prev => ({
                          ...prev,
                          elasticity: Number(e.target.value)
                        }))}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white shadow-sm hover:shadow-md"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Higher = more sensitive to price changes
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-indigo-100/50 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-lg font-bold text-slate-800">Revenue Projection</h3>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {Object.entries(pricingData.revenueProjection).slice(0, 10).map(([price, revenue]) => {
                        const demand = pricingData.demandAtPrice[price] || 0;
                        const isOptimal = revenue === Math.max(...Object.values(pricingData.revenueProjection));
                        return (
                          <div 
                            key={price} 
                            className={`flex items-center justify-between p-4 bg-white rounded-xl transition-all hover:shadow-md ${
                              isOptimal ? 'ring-2 ring-indigo-500 shadow-md' : 'shadow-sm'
                            }`}
                          >
                            <div>
                              <div className="font-bold text-slate-800 flex items-center gap-2">
                                ${price}
                                {isOptimal && (
                                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                                    Optimal
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 mt-1">Demand: {(demand * 100).toFixed(0)}%</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-indigo-600 text-lg">${revenue.toLocaleString()}</div>
                              <div className="text-xs text-slate-500">revenue</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200/50 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-bold text-slate-800">Price vs Revenue Chart</h3>
                  </div>
                  <div className="h-72 flex items-end justify-between gap-1 md:gap-2 bg-gradient-to-t from-slate-50 to-transparent rounded-xl p-4">
                    {Object.entries(pricingData.revenueProjection).map(([price, revenue]) => {
                      const maxRevenue = Math.max(...Object.values(pricingData.revenueProjection));
                      const height = (revenue / maxRevenue) * 100;
                      const isOptimal = revenue === maxRevenue;
                      return (
                        <div key={price} className="flex-1 flex flex-col items-center group cursor-pointer">
                          <div
                            className={`w-full rounded-t-lg transition-all duration-300 hover:opacity-90 ${
                              isOptimal 
                                ? 'bg-gradient-to-t from-indigo-600 via-purple-600 to-pink-500 shadow-lg ring-2 ring-indigo-400' 
                                : 'bg-gradient-to-t from-indigo-400 to-purple-500 shadow-md'
                            }`}
                            style={{ height: `${Math.max(height, 5)}%` }}
                            title={`$${price}: $${revenue.toLocaleString()}`}
                          />
                          <div className="text-xs text-slate-600 mt-2 font-medium">${price}</div>
                          <div className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            ${(revenue/1000).toFixed(0)}k
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'unit' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Calculator className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">Cost Structure</h3>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Revenue per Unit ($)
                      </label>
                      <input
                        type="number"
                        value={unitEconomics.revenuePerUnit}
                        onChange={(e) => setUnitEconomics(prev => ({
                          ...prev,
                          revenuePerUnit: Number(e.target.value)
                        }))}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white shadow-sm hover:shadow-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Cost per Unit ($)
                      </label>
                      <input
                        type="number"
                        value={unitEconomics.costPerUnit}
                        onChange={(e) => setUnitEconomics(prev => ({
                          ...prev,
                          costPerUnit: Number(e.target.value)
                        }))}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white shadow-sm hover:shadow-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Variable Costs per Unit ($)
                      </label>
                      <input
                        type="number"
                        value={unitEconomics.variableCosts}
                        onChange={(e) => setUnitEconomics(prev => ({
                          ...prev,
                          variableCosts: Number(e.target.value)
                        }))}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white shadow-sm hover:shadow-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Fixed Costs ($)
                      </label>
                      <input
                        type="number"
                        value={unitEconomics.fixedCosts}
                        onChange={(e) => setUnitEconomics(prev => ({
                          ...prev,
                          fixedCosts: Number(e.target.value)
                        }))}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white shadow-sm hover:shadow-md"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Target className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">Key Metrics</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 border border-green-100 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="text-sm font-medium text-slate-600 mb-2">Gross Margin</div>
                        <div className="text-4xl font-bold text-green-600 mb-1">
                          {unitEconomics.grossMargin.toFixed(1)}%
                        </div>
                        <div className="text-xs text-slate-500">Revenue - COGS</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 border border-blue-100 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="text-sm font-medium text-slate-600 mb-2">Contribution Margin</div>
                        <div className="text-4xl font-bold text-blue-600 mb-1">
                          {unitEconomics.contributionMargin.toFixed(1)}%
                        </div>
                        <div className="text-xs text-slate-500">Revenue - Variable Costs</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-5 border border-purple-100 shadow-lg hover:shadow-xl transition-shadow col-span-2">
                        <div className="text-sm font-medium text-slate-600 mb-2">Break-Even Units</div>
                        <div className="text-4xl font-bold text-purple-600 mb-1">
                          {unitEconomics.breakEvenUnits.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">
                          Units needed to cover fixed costs
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="font-semibold text-slate-800 mb-3">Profitability Analysis</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Revenue per Unit:</span>
                          <span className="font-medium">${unitEconomics.revenuePerUnit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Total Cost per Unit:</span>
                          <span className="font-medium">
                            ${(unitEconomics.costPerUnit + unitEconomics.variableCosts).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-2">
                          <span className="text-slate-600">Profit per Unit:</span>
                          <span className="font-bold text-green-600">
                            ${(unitEconomics.revenuePerUnit - unitEconomics.costPerUnit - unitEconomics.variableCosts).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cacltv' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Users className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">Customer Metrics</h3>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Customer Acquisition Cost (CAC) ($)
                      </label>
                      <input
                        type="number"
                        value={cacLtv.cac}
                        onChange={(e) => setCacLtv(prev => ({
                          ...prev,
                          cac: Number(e.target.value)
                        }))}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white shadow-sm hover:shadow-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Average Revenue Per User (ARPU) ($)
                      </label>
                      <input
                        type="number"
                        value={cacLtv.arpu}
                        onChange={(e) => setCacLtv(prev => ({
                          ...prev,
                          arpu: Number(e.target.value)
                        }))}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white shadow-sm hover:shadow-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Monthly Churn Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={cacLtv.monthlyChurn * 100}
                        onChange={(e) => setCacLtv(prev => ({
                          ...prev,
                          monthlyChurn: Number(e.target.value) / 100
                        }))}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white shadow-sm hover:shadow-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Gross Margin (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={cacLtv.grossMargin * 100}
                        onChange={(e) => setCacLtv(prev => ({
                          ...prev,
                          grossMargin: Number(e.target.value) / 100
                        }))}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white shadow-sm hover:shadow-md"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">Calculated Metrics</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`rounded-2xl p-5 border shadow-lg hover:shadow-xl transition-all ${
                        cacLtv.ltvCacRatio >= 3
                          ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-200'
                          : cacLtv.ltvCacRatio >= 1
                          ? 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-yellow-200'
                          : 'bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 border-red-200'
                      }`}>
                        <div className="text-sm font-medium text-slate-600 mb-2">LTV</div>
                        <div className="text-4xl font-bold text-slate-800 mb-1">
                          ${cacLtv.ltv.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">Lifetime Value</div>
                      </div>
                      <div className={`rounded-2xl p-5 border shadow-lg hover:shadow-xl transition-all ${
                        cacLtv.ltvCacRatio >= 3
                          ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-200'
                          : cacLtv.ltvCacRatio >= 1
                          ? 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-yellow-200'
                          : 'bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 border-red-200'
                      }`}>
                        <div className="text-sm font-medium text-slate-600 mb-2">LTV:CAC Ratio</div>
                        <div className="text-4xl font-bold text-slate-800 mb-1">
                          {cacLtv.ltvCacRatio.toFixed(1)}x
                        </div>
                        <div className="text-xs text-slate-500">
                          {cacLtv.ltvCacRatio >= 3 ? 'Excellent' : cacLtv.ltvCacRatio >= 1 ? 'Good' : 'Needs Work'}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 border border-blue-200 shadow-lg hover:shadow-xl transition-all col-span-2">
                        <div className="text-sm font-medium text-slate-600 mb-2">Payback Period</div>
                        <div className="text-4xl font-bold text-blue-600 mb-1">
                          {cacLtv.paybackPeriod.toFixed(1)} months
                        </div>
                        <div className="text-xs text-slate-500">
                          Time to recover CAC
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="font-semibold text-slate-800 mb-3">Health Indicators</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {cacLtv.ltvCacRatio >= 3 ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-500" />
                          )}
                          <span className="text-sm text-slate-700">
                            LTV:CAC Ratio: {cacLtv.ltvCacRatio >= 3 ? 'Excellent (≥3:1)' : cacLtv.ltvCacRatio >= 1 ? 'Acceptable (≥1:1)' : 'Poor (<1:1)'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {cacLtv.paybackPeriod <= 12 ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-500" />
                          )}
                          <span className="text-sm text-slate-700">
                            Payback Period: {cacLtv.paybackPeriod <= 12 ? 'Good (≤12 months)' : 'Long (>12 months)'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {cacLtv.monthlyChurn <= 0.05 ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-500" />
                          )}
                          <span className="text-sm text-slate-700">
                            Churn Rate: {(cacLtv.monthlyChurn * 100).toFixed(1)}% {(cacLtv.monthlyChurn <= 0.05 ? '(Good)' : '(High)')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <CreditCard className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Subscription Tiers</h3>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={subscriptionModel.billingCycle}
                      onChange={(e) => setSubscriptionModel(prev => ({
                        ...prev,
                        billingCycle: e.target.value
                      }))}
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="annual">Annual</option>
                    </select>
                    <button
                      onClick={addSubscriptionTier}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Tier
                    </button>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {subscriptionModel.tiers.map((tier, index) => (
                    <div key={tier.id} className="bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 rounded-2xl p-6 border-2 border-slate-200 hover:border-indigo-300 shadow-lg hover:shadow-xl transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <input
                          type="text"
                          value={tier.name}
                          onChange={(e) => updateSubscriptionTier(tier.id, 'name', e.target.value)}
                          className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 -ml-2"
                          placeholder="Tier Name"
                        />
                        {subscriptionModel.tiers.length > 1 && (
                          <button
                            onClick={() => removeSubscriptionTier(tier.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Price ($)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                          <input
                            type="number"
                            value={tier.price}
                            onChange={(e) => updateSubscriptionTier(tier.id, 'price', Number(e.target.value))}
                            className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Features
                        </label>
                        <div className="space-y-2">
                          {tier.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) => {
                                  const newFeatures = [...tier.features];
                                  newFeatures[featureIndex] = e.target.value;
                                  updateSubscriptionTier(tier.id, 'features', newFeatures);
                                }}
                                className="flex-1 px-3 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500"
                                placeholder="Feature name"
                              />
                              <button
                                onClick={() => removeFeatureFromTier(tier.id, featureIndex)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const newFeature = prompt('Enter feature name:');
                              if (newFeature) addFeatureToTier(tier.id, newFeature);
                            }}
                            className="w-full px-3 py-2 text-sm border-2 border-dashed border-slate-300 rounded-lg hover:border-indigo-500 hover:text-indigo-600 flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Feature
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Projected Users
                        </label>
                        <input
                          type="number"
                          value={tier.users}
                          onChange={(e) => updateSubscriptionTier(tier.id, 'users', Number(e.target.value))}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white shadow-sm hover:shadow-md"
                        />
                        <div className="mt-2 text-sm text-slate-600">
                          MRR: ${(tier.price * tier.users).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                  <h4 className="font-semibold text-slate-800 mb-4">Revenue Summary</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Total MRR</div>
                      <div className="text-2xl font-bold text-indigo-600">
                        ${subscriptionModel.tiers.reduce((sum, tier) => sum + (tier.price * tier.users), 0).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Total Users</div>
                      <div className="text-2xl font-bold text-slate-800">
                        {subscriptionModel.tiers.reduce((sum, tier) => sum + tier.users, 0).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Average Price</div>
                      <div className="text-2xl font-bold text-slate-800">
                        ${subscriptionModel.tiers.length > 0
                          ? (subscriptionModel.tiers.reduce((sum, tier) => sum + tier.price, 0) / subscriptionModel.tiers.length).toFixed(2)
                          : 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Business Model Templates</h3>
                  </div>
                  <p className="text-slate-600 ml-12">Select a template to auto-populate your revenue model</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businessModelTemplates.map(template => {
                    const Icon = template.icon;
                    return (
                      <div
                        key={template.id}
                        onClick={() => applyTemplate(template)}
                        className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
                          selectedTemplate === template.id
                            ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl ring-2 ring-indigo-200'
                            : 'border-slate-200 hover:border-indigo-300 shadow-lg'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${
                            selectedTemplate === template.id
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800">{template.name}</h4>
                            <p className="text-xs text-slate-500">{template.description}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Revenue/Unit:</span>
                            <span className="font-medium">${template.metrics.revenuePerUnit.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">CAC:</span>
                            <span className="font-medium">${template.metrics.cac}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">ARPU:</span>
                            <span className="font-medium">${template.metrics.arpu}</span>
                          </div>
                        </div>
                        {selectedTemplate === template.id && (
                          <div className="mt-4 pt-4 border-t border-indigo-200">
                            <div className="flex items-center gap-2 text-indigo-600 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              <span>Template Applied</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RevenueModelBuilder;

