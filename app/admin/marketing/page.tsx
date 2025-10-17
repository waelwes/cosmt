'use client';

import React, { memo, useMemo, useState } from 'react';
import { Megaphone, Percent, Mail, BarChart3, Users, Calendar, Plus, Edit, Trash2, Eye, Send, Pause, Play } from 'lucide-react';

// Mock data for marketing
const campaigns = [
  {
    id: 1,
    name: 'Summer Beauty Sale',
    type: 'Email',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    budget: 5000,
    spent: 3200,
    reach: 15420,
    clicks: 892,
    conversions: 156,
    revenue: 12450
  },
  {
    id: 2,
    name: 'New Product Launch',
    type: 'Social Media',
    status: 'paused',
    startDate: '2024-01-10',
    endDate: '2024-01-25',
    budget: 3000,
    spent: 1800,
    reach: 8750,
    clicks: 445,
    conversions: 89,
    revenue: 5670
  },
  {
    id: 3,
    name: 'Holiday Special',
    type: 'Email',
    status: 'completed',
    startDate: '2023-12-01',
    endDate: '2023-12-31',
    budget: 8000,
    spent: 8000,
    reach: 25600,
    clicks: 1456,
    conversions: 312,
    revenue: 18900
  }
];

const coupons = [
  {
    id: 1,
    code: 'WELCOME20',
    name: 'Welcome Discount',
    type: 'percentage',
    value: 20,
    minOrder: 50,
    maxDiscount: 100,
    usageLimit: 1000,
    used: 456,
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  {
    id: 2,
    code: 'FREESHIP',
    name: 'Free Shipping',
    type: 'fixed',
    value: 10,
    minOrder: 75,
    maxDiscount: 10,
    usageLimit: 500,
    used: 234,
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-03-15'
  },
  {
    id: 3,
    code: 'SAVE50',
    name: 'Big Savings',
    type: 'fixed',
    value: 50,
    minOrder: 200,
    maxDiscount: 50,
    usageLimit: 100,
    used: 89,
    status: 'expired',
    startDate: '2023-12-01',
    endDate: '2023-12-31'
  }
];

const emailTemplates = [
  {
    id: 1,
    name: 'Welcome Email',
    subject: 'Welcome to Cosmat!',
    type: 'Transactional',
    status: 'active',
    openRate: 45.2,
    clickRate: 12.8,
    lastSent: '2024-01-16'
  },
  {
    id: 2,
    name: 'Abandoned Cart',
    subject: 'Don\'t forget your items!',
    type: 'Automated',
    status: 'active',
    openRate: 38.7,
    clickRate: 18.5,
    lastSent: '2024-01-15'
  },
  {
    id: 3,
    name: 'Product Launch',
    subject: 'New arrivals are here!',
    type: 'Promotional',
    status: 'draft',
    openRate: 0,
    clickRate: 0,
    lastSent: null
  }
];

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-600 bg-green-50';
    case 'paused': return 'text-yellow-600 bg-yellow-50';
    case 'completed': return 'text-blue-600 bg-blue-50';
    case 'expired': return 'text-red-600 bg-red-50';
    case 'draft': return 'text-gray-600 bg-gray-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
const formatPercentage = (value: number) => `${value}%`;

// Memoized components
const StatCard = memo(({ title, value, change, icon: Icon, color }: {
  title: string;
  value: string | number;
  change?: string;
  icon: any;
  color: string;
}) => (
        <div className="analytics-card p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        {change && (
          <p className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
));

const CampaignCard = memo(({ campaign, onEdit, onDelete, onView, onToggle }: {
  campaign: any;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onToggle: (id: number) => void;
}) => {
  const roi = campaign.spent > 0 ? ((campaign.revenue - campaign.spent) / campaign.spent * 100).toFixed(1) : 0;
  const conversionRate = campaign.clicks > 0 ? (campaign.conversions / campaign.clicks * 100).toFixed(1) : 0;
  
  return (
    <div className="analytics-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{campaign.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
              {campaign.status.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{campaign.type} Campaign</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {campaign.startDate} - {campaign.endDate}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onView(campaign.id)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(campaign.id)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggle(campaign.id)}
            className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
          >
            {campaign.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDelete(campaign.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(campaign.budget)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{campaign.reach.toLocaleString()}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Reach</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{conversionRate}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Conversion</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{roi}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">ROI</p>
        </div>
      </div>
    </div>
  );
});

const CouponCard = memo(({ coupon, onEdit, onDelete, onView }: {
  coupon: any;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}) => {
  const usagePercentage = (coupon.used / coupon.usageLimit * 100).toFixed(1);
  
  return (
    <div className="analytics-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{coupon.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(coupon.status)}`}>
              {coupon.status.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">
            {coupon.code}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {coupon.type === 'percentage' ? `${coupon.value}% off` : `$${coupon.value} off`}
            {coupon.minOrder > 0 && ` • Min order $${coupon.minOrder}`}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{coupon.used}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Used</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{coupon.usageLimit}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Limit</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{usagePercentage}%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Usage</p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onView(coupon.id)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(coupon.id)}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(coupon.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

const EmailTemplateCard = memo(({ template, onEdit, onDelete, onView, onSend }: {
  template: any;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onSend: (id: number) => void;
}) => (
  <div className="analytics-card p-4">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{template.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(template.status)}`}>
            {template.status.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{template.subject}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{template.type} Email</p>
        {template.lastSent && (
          <p className="text-xs text-gray-400">Last sent: {template.lastSent}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        {template.status === 'active' && (
          <>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{template.openRate}%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Open Rate</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{template.clickRate}%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Click Rate</p>
            </div>
          </>
        )}
        
        <div className="flex space-x-2">
          <button
            onClick={() => onView(template.id)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(template.id)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          {template.status === 'active' && (
            <button
              onClick={() => onSend(template.id)}
              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(template.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
));

export default function MarketingTools() {
  const [activeTab, setActiveTab] = useState('campaigns');

  // Memoized calculations
  const stats = useMemo(() => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
    const totalCoupons = coupons.length;
    const activeCoupons = coupons.filter(c => c.status === 'active').length;
    const totalEmailTemplates = emailTemplates.length;
    
    return {
      totalCampaigns,
      activeCampaigns,
      totalBudget,
      totalSpent,
      totalRevenue,
      totalCoupons,
      activeCoupons,
      totalEmailTemplates
    };
  }, []);

  const handleEdit = (id: number) => {
    console.log('Edit item:', id);
    // TODO: Implement edit functionality
  };

  const handleDelete = (id: number) => {
    console.log('Delete item:', id);
    // TODO: Implement delete functionality
  };

  const handleView = (id: number) => {
    console.log('View item:', id);
    // TODO: Implement view functionality
  };

  const handleToggle = (id: number) => {
    console.log('Toggle campaign:', id);
    // TODO: Implement toggle functionality
  };

  const handleSend = (id: number) => {
    console.log('Send email:', id);
    // TODO: Implement send functionality
  };

  return (
    <div className="space-y-6" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Marketing Tools</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage campaigns, coupons, and email marketing</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Campaigns"
          value={stats.activeCampaigns}
          change="+2 this week"
          icon={Megaphone}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Total Budget"
          value={formatCurrency(stats.totalBudget)}
          icon={Calendar}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Active Coupons"
          value={stats.activeCoupons}
          icon={Percent}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Email Templates"
          value={stats.totalEmailTemplates}
          icon={Mail}
          color="bg-orange-100 text-orange-600"
        />
      </div>

      {/* Tabs */}
      <div className="analytics-card">
        <div className="border-b" style={{ borderBottomColor: '#eef2f6' }}>
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'campaigns', name: 'Campaigns', count: campaigns.length },
              { id: 'coupons', name: 'Coupons', count: coupons.length },
              { id: 'emails', name: 'Email Templates', count: emailTemplates.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Marketing Campaigns</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>New Campaign</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Coupons Tab */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Discount Coupons</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>New Coupon</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {coupons.map((coupon) => (
                  <CouponCard
                    key={coupon.id}
                    coupon={coupon}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Email Templates Tab */}
          {activeTab === 'emails' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Email Templates</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>New Template</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {emailTemplates.map((template) => (
                  <EmailTemplateCard
                    key={template.id}
                    template={template}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    onSend={handleSend}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
