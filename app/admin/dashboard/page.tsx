'use client';

import React, { memo, useMemo, useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  Activity,
  CreditCard,
  Eye,
  Globe,
  Search,
  ExternalLink,
  Mail,
  Share2,
  Smartphone,
  Monitor,
  Tablet,
  ShoppingCart,
  CheckCircle,
  ArrowDown,
  Target,
  Zap,
  RefreshCw,
  Calendar,
  Filter,
  Download,
  Settings,
  Bell,
  AlertCircle,
  Star,
  Package,
  Truck
} from 'lucide-react';
import { formatPrice } from '../../../utils/currency';
import { useRTL } from '../../../contexts/UnifiedLanguageContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);


// Real-time Notifications Component
const RealTimeNotifications = memo(() => {
  const { isArabic } = useRTL();
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'order', message: 'New order #12345 received', time: '2 min ago', priority: 'high' },
    { id: 2, type: 'payment', message: 'Payment of $89.99 completed', time: '5 min ago', priority: 'medium' },
    { id: 3, type: 'inventory', message: 'Low stock alert: Hair Mask', time: '10 min ago', priority: 'high' },
    { id: 4, type: 'customer', message: 'New customer registered', time: '15 min ago', priority: 'low' }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="w-4 h-4" />;
      case 'payment': return <CreditCard className="w-4 h-4" />;
      case 'inventory': return <Package className="w-4 h-4" />;
      case 'customer': return <Users className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="analytics-card p-0">
      <div className="px-4 pt-4 pb-3 border-b flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Recent Activity</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <Settings className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4 space-y-3">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className={`p-1 rounded-full ${getPriorityColor(notification.priority)}`}>
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-gray-100">{notification.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// Quick Actions Component
const QuickActions = memo(() => {
  const { isArabic } = useRTL();
  
  const actions = [
    { icon: Package, label: 'Add Product', color: 'bg-blue-500', href: '/admin/products' },
    { icon: Users, label: 'View Customers', color: 'bg-green-500', href: '/admin/customers' },
    { icon: ShoppingCart, label: 'Process Orders', color: 'bg-purple-500', href: '/admin/orders' },
    { icon: Settings, label: 'Settings', color: 'bg-gray-500', href: '/admin/settings' }
  ];

  return (
    <div className="analytics-card p-0">
      <div className="px-4 pt-4 pb-3 border-b">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Quick Actions</h3>
      </div>
      <div className="p-4">
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <a
            key={index}
            href={action.href}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className={`p-2 rounded-lg ${action.color} text-white`}>
              <action.icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{action.label}</span>
          </a>
        ))}
      </div>
      </div>
    </div>
  );
});

// Data Status Component
const DataStatus = memo(() => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="analytics-card p-0">
      <div className="px-4 pt-4 pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Data Status</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 dark:text-gray-400">Last updated</div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatTime(lastUpdated)}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Live Visitor Count Component
const LiveVisitorCount = memo(() => {
  const { isArabic } = useRTL();
  const [visitorCount, setVisitorCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  // Translation function for LiveVisitorCount
  const getTranslation = (key: string) => {
    const translations: { [key: string]: { en: string; ar: string } } = {
      liveVisitors: { en: 'Live Visitors', ar: 'الزوار المباشرون' }
    };
    
    return translations[key] ? translations[key][isArabic ? 'ar' : 'en'] : key;
  };

  useEffect(() => {
    // Simulate real-time visitor count updates
    const updateVisitorCount = () => {
      const baseCount = 127;
      const randomVariation = Math.floor(Math.random() * 20) - 10; // -10 to +10
      const newCount = Math.max(0, baseCount + randomVariation);
      setVisitorCount(newCount);
    };

    // Initial count
    updateVisitorCount();

    // Update every 3-8 seconds
    const interval = setInterval(() => {
      updateVisitorCount();
    }, Math.random() * 5000 + 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="analytics-card p-0">
      <div className="px-4 pt-4 pb-3 border-b flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">{getTranslation('liveVisitors')}</h3>
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
        </div>
      </div>
      <div className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{visitorCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Currently online</p>
        </div>
        <div className="flex items-center space-x-1">
          <Eye className="w-4 h-4 text-gray-400" />
          <Globe className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      </div>
    </div>
  );
});

// Traffic Sources Component
const TrafficSources = () => {
  const { isArabic } = useRTL();
  
  // Translation function for TrafficSources
  const getTranslation = (key: string) => {
    const translations: { [key: string]: { en: string; ar: string } } = {
      trafficSources: { en: 'Traffic Sources', ar: 'مصادر الزيارات' }
    };
    
    return translations[key] ? translations[key][isArabic ? 'ar' : 'en'] : key;
  };
  
  const trafficData = [
    {
      source: isArabic ? 'البحث العضوي' : 'Organic Search',
      visitors: 1247,
      percentage: 45.2,
      icon: Search,
      color: 'bg-cosmt-primary',
      trend: '+12.5%'
    },
    {
      source: isArabic ? 'مباشر' : 'Direct',
      visitors: 892,
      percentage: 32.3,
      icon: ExternalLink,
      color: 'bg-blue-500',
      trend: '+8.2%'
    },
    {
      source: isArabic ? 'وسائل التواصل الاجتماعي' : 'Social Media',
      visitors: 456,
      percentage: 16.5,
      icon: Share2,
      color: 'bg-purple-500',
      trend: '+15.3%'
    },
    {
      source: isArabic ? 'البريد الإلكتروني' : 'Email',
      visitors: 123,
      percentage: 4.5,
      icon: Mail,
      color: 'bg-orange-500',
      trend: '+3.1%'
    },
    {
      source: isArabic ? 'الإحالة' : 'Referral',
      visitors: 89,
      percentage: 3.2,
      icon: Globe,
      color: 'bg-teal-500',
      trend: '-2.4%'
    }
  ];

  return (
    <div className="analytics-card p-0">
      {/* Card Header with full-width border line */}
      <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{getTranslation('trafficSources')}</h3>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Activity className="w-3 h-3 me-1" />
          30 days
        </div>
      </div>

      {/* Card Content */}
      <div className="px-6 py-6">
      
      <div className="space-y-3">
        {trafficData.map((source, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <div className={`w-2 h-2 rounded-full ${source.color} me-2`}></div>
              <div className="flex items-center">
                <source.icon className="w-3 h-3 text-gray-400 me-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{source.source}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-end">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{source.visitors.toLocaleString()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{source.percentage}%</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 me-3">
                  <div 
                    className={`h-2 rounded-full ${source.color}`}
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
                <span className={`text-xs font-medium ${
                  source.trend.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {source.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

// Device Analytics Component
const DeviceAnalytics = () => {
  const { isArabic } = useRTL();
  
  // Translation function for DeviceAnalytics
  const getTranslation = (key: string) => {
    const translations: { [key: string]: { en: string; ar: string } } = {
      deviceAnalytics: { en: 'Device Analytics', ar: 'تحليلات الأجهزة' }
    };
    
    return translations[key] ? translations[key][isArabic ? 'ar' : 'en'] : key;
  };
  
  const deviceData = [
    {
      device: isArabic ? 'سطح المكتب' : 'Desktop',
      visitors: 1847,
      percentage: 66.9,
      icon: Monitor,
      color: 'bg-cosmt-primary'
    },
    {
      device: isArabic ? 'الهاتف المحمول' : 'Mobile',
      visitors: 789,
      percentage: 28.6,
      icon: Smartphone,
      color: 'bg-blue-500'
    },
    {
      device: isArabic ? 'التابلت' : 'Tablet',
      visitors: 127,
      percentage: 4.6,
      icon: Tablet,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="analytics-card p-0">
      {/* Card Header with full-width border line */}
      <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{getTranslation('deviceAnalytics')}</h3>
      </div>

      {/* Card Content */}
      <div className="px-6 py-6">
        <div className="space-y-3">
        {deviceData.map((device, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <div className={`w-2 h-2 rounded-full ${device.color} me-2`}></div>
              <div className="flex items-center">
                <device.icon className="w-3 h-3 text-gray-400 me-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{device.device}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-end">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{device.visitors.toLocaleString()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{device.percentage}%</div>
              </div>
              
              <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${device.color}`}
                  style={{ width: `${device.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

// Conversion Funnel Component
const ConversionFunnel = () => {
  const { isArabic } = useRTL();
  
  // Translation function for ConversionFunnel
  const getTranslation = (key: string) => {
    const translations: { [key: string]: { en: string; ar: string } } = {
      conversionFunnel: { en: 'Conversion Funnel', ar: 'قمع التحويل' }
    };
    
    return translations[key] ? translations[key][isArabic ? 'ar' : 'en'] : key;
  };
  
  const funnelData = [
    {
      step: 'Total Visitors',
      count: 11,
      conversionRate: 100,
      dropOffRate: 0,
      icon: Users,
      color: 'bg-cosmt-primary',
      bgColor: 'bg-white dark:bg-gray-800/50',
      textColor: 'text-gray-700 dark:text-gray-300'
    },
    {
      step: 'Carts Created',
      count: 8,
      conversionRate: 72.73,
      dropOffRate: 27.27,
      icon: ShoppingCart,
      color: 'bg-cosmt-primary',
      bgColor: 'bg-white dark:bg-gray-800/50',
      textColor: 'text-gray-700 dark:text-gray-300'
    },
    {
      step: 'Reached Checkout',
      count: 6,
      conversionRate: 54.55,
      dropOffRate: 18.18,
      icon: CreditCard,
      color: 'bg-cosmt-primary',
      bgColor: 'bg-white dark:bg-gray-800/50',
      textColor: 'text-gray-700 dark:text-gray-300'
    },
    {
      step: 'Completed Purchases',
      count: 5,
      conversionRate: 45.45,
      dropOffRate: 9.09,
      icon: CheckCircle,
      color: 'bg-cosmt-primary',
      bgColor: 'bg-cosmt-primary-light dark:bg-cosmt-primary/10',
      textColor: 'text-cosmt-primary dark:text-cosmt-primary'
    }
  ];

  return (
    <div className="analytics-card p-0">
      {/* Card Header with full-width border line */}
      <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{getTranslation('conversionFunnel')}</h3>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Zap className="w-3 h-3 me-1" />
          Optimize ✨
        </div>
      </div>

      {/* Card Content */}
      <div className="px-6 py-6">
        <div className="space-y-2">
        {funnelData.map((step, index) => (
          <div key={index}>
            {/* Funnel Step - No inner card */}
            <div className="py-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={`w-6 h-6 ${step.color} rounded flex items-center justify-center me-3`}>
                    <step.icon className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{step.step}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`text-base font-bold ${step.textColor}`}>{step.count}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {step.conversionRate}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-end">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Drop-off</div>
                  <div className="text-sm font-medium text-red-600 dark:text-red-400">
                    {step.dropOffRate > 0 ? `-${step.dropOffRate}%` : '0%'}
                  </div>
                </div>
              </div>
              
              {/* Progress Bar - Below the content */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded h-1">
                <div 
                  className={`h-1 rounded ${step.color}`}
                  style={{ width: `${step.conversionRate}%` }}
                ></div>
              </div>
            </div>
            
            {/* Arrow Down (except for last step) */}
            {index < funnelData.length - 1 && (
              <div className="flex justify-center py-1">
                <ArrowDown className="w-3 h-3 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Funnel Summary */}
      <div className="mt-4 pt-3 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Target className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Overall Rate</span>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900 dark:text-white">45.45%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">11 → 5</div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

// Memoized components for better performance
const StatCard = memo(({ stat, index }: { stat: any; index: number }) => (
  <div className="analytics-card p-0">
    <div className="px-4 pt-4 pb-3 border-b flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">{stat.title}</h3>
      {stat.icon}
    </div>
    <div className="p-4">
    <div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
      <div className="flex items-center text-xs mt-1 text-gray-500 dark:text-gray-400">
        <span className={`flex items-center font-medium ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
          {stat.changeType === 'positive' ? 
            <ArrowUpRight className="w-3 h-3 mr-1" /> : 
            <ArrowUpRight className="w-3 h-3 mr-1 transform rotate-90" />
          }
          {stat.change}
        </span>
      </div>
    </div>
    </div>
  </div>
));



// Modern Chart Component
const ModernChart = ({ timeRange = 'All', selectedDate, currentCurrency = 'USD' }: { timeRange?: string; selectedDate?: Date | null; currentCurrency?: string }) => {
  const { isArabic } = useRTL();
  
  // Translation function for ModernChart
  const getTranslation = (key: string) => {
    const translations: { [key: string]: { en: string; ar: string } } = {
      salesOverview: { en: 'Sales Overview', ar: 'نظرة عامة على المبيعات' }
    };
    
    return translations[key] ? translations[key][isArabic ? 'ar' : 'en'] : key;
  };
  
  const salesData = {
    'All': [
      { date: '2024-01-01', sales: 1200 },
      { date: '2024-01-02', sales: 1900 },
      { date: '2024-01-03', sales: 1500 },
      { date: '2024-01-04', sales: 2200 },
      { date: '2024-01-05', sales: 2800 },
      { date: '2024-01-06', sales: 3200 },
      { date: '2024-01-07', sales: 2900 },
      { date: '2024-01-08', sales: 1200 },
      { date: '2024-01-09', sales: 1900 },
      { date: '2024-01-10', sales: 1500 },
      { date: '2024-01-11', sales: 2200 },
      { date: '2024-01-12', sales: 2800 },
      { date: '2024-01-13', sales: 3200 },
      { date: '2024-01-14', sales: 2900 }
    ],
    'Today': [
      { date: '2024-01-15T00:00', sales: 800 },
      { date: '2024-01-15T04:00', sales: 1200 },
      { date: '2024-01-15T08:00', sales: 1800 },
      { date: '2024-01-15T12:00', sales: 2200 },
      { date: '2024-01-15T16:00', sales: 2800 },
      { date: '2024-01-15T20:00', sales: 2500 },
      { date: '2024-01-15T23:59', sales: 1900 }
    ],
    'This Week': [
      { date: '2024-01-08', sales: 1200 },
      { date: '2024-01-09', sales: 1900 },
      { date: '2024-01-10', sales: 1500 },
      { date: '2024-01-11', sales: 2200 },
      { date: '2024-01-12', sales: 2800 },
      { date: '2024-01-13', sales: 3200 },
      { date: '2024-01-14', sales: 2900 }
    ],
    'This Month': [
      { date: '2024-01-01', sales: 1200 },
      { date: '2024-01-02', sales: 1900 },
      { date: '2024-01-03', sales: 1500 },
      { date: '2024-01-04', sales: 2200 },
      { date: '2024-01-05', sales: 2800 },
      { date: '2024-01-06', sales: 3200 },
      { date: '2024-01-07', sales: 2900 },
      { date: '2024-01-08', sales: 1200 },
      { date: '2024-01-09', sales: 1900 },
      { date: '2024-01-10', sales: 1500 },
      { date: '2024-01-11', sales: 2200 },
      { date: '2024-01-12', sales: 2800 },
      { date: '2024-01-13', sales: 3200 },
      { date: '2024-01-14', sales: 2900 }
    ],
    'This Year': [
      { date: '2024-01-01', sales: 1200 },
      { date: '2024-01-02', sales: 1900 },
      { date: '2024-01-03', sales: 1500 },
      { date: '2024-01-04', sales: 2200 },
      { date: '2024-01-05', sales: 2800 },
      { date: '2024-01-06', sales: 3200 },
      { date: '2024-01-07', sales: 2900 }
    ],
    'Custom Date': selectedDate ? [
      { 
        date: selectedDate.toISOString().split('T')[0], 
        sales: Math.floor(Math.random() * 3000) + 1000 
      }
    ] : []
  };

  const data = salesData[timeRange as keyof typeof salesData];
  
  const { totalSales, percentageChange } = useMemo(() => {
    if (!data || data.length === 0) return { totalSales: 0, percentageChange: 0 };
    const total = data.reduce((acc, item) => acc + item.sales, 0);
    const firstValue = data[0]?.sales;
    const lastValue = data[data.length - 1]?.sales;
    let change = 0;
    if (firstValue > 0) {
      change = ((lastValue - firstValue) / firstValue) * 100;
    }
    return { totalSales: total, percentageChange: change };
  }, [data]);

  const formatXAxisTick = (dateStr: string) => {
    const date = new Date(dateStr);
    switch(timeRange) {
      case 'Today': return date.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false });
      case 'This Week': return date.toLocaleDateString('en-US', { weekday: 'short' });
      case 'This Month': return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'This Year': return date.toLocaleDateString('en-US', { month: 'short' });
      default: return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const chartData = useMemo(() => ({
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Sales',
        data: data.map(d => d.sales),
        borderColor: '#00833F',
        backgroundColor: 'rgba(0, 131, 63, 0.05)',
        borderWidth: 1.5,
        fill: false,
        tension: 0.2,
        pointBackgroundColor: '#00833F',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 4,
      }
    ]
  }), [data]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#00833F',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: false,
        padding: 8,
        callbacks: {
          title: function(context: any) {
            return new Date(context[0].label).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric'
            });
          },
          label: function(context: any) {
            return formatPrice(context.parsed.y, currentCurrency, 'USD');
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11
          },
          maxTicksLimit: 6,
          callback: function(value: any, index: any) {
            const label = this.getLabelForValue(value);
            return formatXAxisTick(label);
          }
        },
        border: {
          display: false
        }
      },
      y: {
        display: true,
        grid: {
          color: '#f3f4f6',
          drawBorder: false,
          drawTicks: false
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11
          },
          callback: function(value: any) {
            return formatPrice(value, currentCurrency, 'USD');
          },
          maxTicksLimit: 5
        },
        border: {
          display: false
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  }), []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{getTranslation('salesOverview')}</h2>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(totalSales, currentCurrency, 'USD')}</div>
        </div>
        <div className={`flex items-center text-sm ${percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {percentageChange >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          <span>{percentageChange.toFixed(1)}%</span>
        </div>
      </div>
      <div className="h-64 w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

function AdminDashboard() {
  const [mounted, setMounted] = useState(false);

  // RTL context
  const { language, direction, isRTL, isArabic } = useRTL();

  // Translation function
  const getTranslation = (key: string) => {
    const translations: { [key: string]: { en: string; ar: string } } = {
      loading: { en: 'Loading...', ar: 'جاري التحميل...' },
      totalSales: { en: 'Total Sales', ar: 'إجمالي المبيعات' },
      netSales: { en: 'Net Sales', ar: 'صافي المبيعات' },
      orderCount: { en: 'Order Count', ar: 'عدد الطلبات' },
      conversionRate: { en: 'Conversion Rate', ar: 'معدل التحويل' },
      salesOverview: { en: 'Sales Overview', ar: 'نظرة عامة على المبيعات' },
      liveVisitors: { en: 'Live Visitors', ar: 'الزوار المباشرون' },
      topPages: { en: 'Top Pages', ar: 'الصفحات الأكثر زيارة' },
      trafficSources: { en: 'Traffic Sources', ar: 'مصادر الزيارات' },
      deviceAnalytics: { en: 'Device Analytics', ar: 'تحليلات الأجهزة' },
      conversionFunnel: { en: 'Conversion Funnel', ar: 'قمع التحويل' },
      all: { en: 'All', ar: 'الكل' },
      today: { en: 'Today', ar: 'اليوم' },
      thisWeek: { en: 'This Week', ar: 'هذا الأسبوع' },
      thisMonth: { en: 'This Month', ar: 'هذا الشهر' },
      thisYear: { en: 'This Year', ar: 'هذا العام' },
      selectDate: { en: 'Select Date', ar: 'اختر التاريخ' },
      overview: { en: 'Analytics Overview', ar: 'نظرة عامة على التحليلات' }
    };
    
    return translations[key] ? translations[key][isArabic ? 'ar' : 'en'] : key;
  };

  // All other hooks must be called before any conditional returns
  const [currentCurrency, setCurrentCurrency] = React.useState('USD');
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState('All');
  const [forceUpdate, setForceUpdate] = React.useState(0);

  // All useEffect hooks must be called before any conditional returns
  useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const savedCurrency = localStorage.getItem('preferred-currency') || 'USD';
    setCurrentCurrency(savedCurrency);
  }, []);

  React.useEffect(() => {
    const handleCurrencyChange = (e: CustomEvent) => {
      if (e.detail && e.detail.currency) {
        setCurrentCurrency(e.detail.currency);
        setRefreshKey(prev => prev + 1);
      }
    };

    window.addEventListener('currencyChanged', handleCurrencyChange as EventListener);
    return () => window.removeEventListener('currencyChanged', handleCurrencyChange as EventListener);
  }, []);

  React.useEffect(() => {
    const handleLanguageChange = (e: CustomEvent) => {
      if (e.detail && e.detail.language) {
        console.log('Language change event received:', e.detail.language);
        setForceUpdate(prev => prev + 1);
        setRefreshKey(prev => prev + 1);
      }
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
  }, []);

  React.  useEffect(() => {
    console.log('Dashboard: Language changed to:', language, 'Direction:', direction);
    console.log('Dashboard: RTL mode:', isRTL, 'Arabic:', isArabic);
    setForceUpdate(prev => prev + 1);
    setRefreshKey(prev => prev + 1);
  }, [language, direction, isRTL, isArabic]);

  useEffect(() => {
    if (!showDatePicker) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.date-picker-container')) {
        setShowDatePicker(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  // Memoized data to prevent unnecessary re-renders
  const stats = useMemo(() => {
    return [
      {
        title: getTranslation('totalSales'),
        value: formatPrice(125430, currentCurrency, 'USD'),
        change: '+12.5% from last month',
        changeType: 'positive',
        icon: <DollarSign className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      },
      {
        title: getTranslation('netSales'),
        value: formatPrice(118900, currentCurrency, 'USD'),
        change: '+11.8% from last month',
        changeType: 'positive',
        icon: <TrendingUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      },
      {
        title: getTranslation('orderCount'),
        value: '1,234',
        change: '+8.2% from last month',
        changeType: 'positive',
        icon: <CreditCard className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      },
      {
        title: 'Returns',
        value: '45',
        change: '-2.1% from last month',
        changeType: 'negative',
        icon: <TrendingDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      }
    ];
  }, [currentCurrency]);

  // If not mounted, return loading state
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  // Show loading if not mounted
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">{isArabic ? 'جاري التحميل...' : 'Loading...'}</div>
      </div>
    );
  }

  // Date picker functions
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const handleDateSelect = (day: number) => {
    try {
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      setSelectedDate(newDate);
      setSelectedTimeRange('Custom Date');
      setShowDatePicker(false);
    } catch (error) {
      console.error('Error selecting date:', error);
      setShowDatePicker(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    try {
      const newMonth = new Date(currentMonth);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      setCurrentMonth(newMonth);
    } catch (error) {
      console.error('Error navigating month:', error);
    }
  };
  



  return (
    <div 
      className={`space-y-6 ${direction === 'rtl' ? 'rtl' : 'ltr'}`} 
      key={`dashboard-${language}-${direction}-${refreshKey}`}
      dir={direction}
      style={{
        direction: direction,
        textAlign: direction === 'rtl' ? 'right' : 'left',
        backgroundColor: '#f8fafc',
        minHeight: '100vh'
      }}
    >
      
      {/* Main Dashboard Card */}
      <div className={`analytics-card p-0 ${direction === 'rtl' ? 'rtl' : 'ltr'}`}>
        {/* Card Header with full-width border line */}
        <div className={`flex justify-between items-center px-4 pt-4 pb-3 border-b ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
          <h1 className={`text-lg font-semibold text-gray-900 dark:text-white ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>Dashboard</h1>
          <div className={`flex items-center text-sm ${direction === 'rtl' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
            {/* Time Period Filter */}
            <div className={`flex items-center rounded-lg overflow-hidden border ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
            <button 
              onClick={() => setSelectedTimeRange('All')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedTimeRange === 'All' 
                  ? 'text-cosmt-primary bg-cosmt-primary-light dark:bg-cosmt-primary/20' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {getTranslation('all')}
            </button>
            <button 
              onClick={() => setSelectedTimeRange('Today')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedTimeRange === 'Today' 
                  ? 'text-cosmt-primary bg-cosmt-primary-light dark:bg-cosmt-primary/20' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {getTranslation('today')}
            </button>
            <button 
              onClick={() => setSelectedTimeRange('This Week')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedTimeRange === 'This Week' 
                  ? 'text-cosmt-primary bg-cosmt-primary-light dark:bg-cosmt-primary/20' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {getTranslation('thisWeek')}
            </button>
            <button 
              onClick={() => setSelectedTimeRange('This Month')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedTimeRange === 'This Month' 
                  ? 'text-cosmt-primary bg-cosmt-primary-light dark:bg-cosmt-primary/20' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {getTranslation('thisMonth')}
            </button>
            <button 
              onClick={() => setSelectedTimeRange('This Year')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedTimeRange === 'This Year' 
                  ? 'text-cosmt-primary bg-cosmt-primary-light dark:bg-cosmt-primary/20' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {getTranslation('thisYear')}
            </button>
            <div className="relative date-picker-container">
              <button 
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {selectedDate ? formatDate(selectedDate) : getTranslation('selectDate')}
              </button>
              
              {/* Date Picker Popover */}
              {showDatePicker && (
                <div 
                  className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded z-[9999] p-4 w-80"
                  style={{ border: '1px solid #eef2f6' }}
                >
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                      onClick={() => navigateMonth('next')}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells for days before the first day of the month */}
                    {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, index) => (
                      <div key={`empty-${index}`} className="h-8"></div>
                    ))}
                    
                    {/* Days of the month */}
                    {Array.from({ length: getDaysInMonth(currentMonth) }, (_, index) => {
                      const day = index + 1;
                      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                      const isTodayDate = isToday(date);
                      const isSelectedDate = isSelected(date);
                      
                      return (
                        <button
                          key={day}
                          onClick={() => handleDateSelect(day)}
                          className={`h-8 w-8 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                            isSelectedDate 
                              ? 'bg-cosmt-primary text-white' 
                              : isTodayDate 
                                ? 'border border-cosmt-primary text-cosmt-primary' 
                                : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Today Button */}
                  <div className="mt-4 pt-3 border-t">
                    <button
                      onClick={() => {
                        setSelectedDate(new Date());
                        setSelectedTimeRange('Custom Date');
                        setShowDatePicker(false);
                      }}
                      className="w-full text-sm text-cosmt-primary hover:text-cosmt-primary-dark font-medium"
                    >
                      Today
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>

        {/* Card Content */}
        <div className="px-4 py-4">
          {/* Stats Grid */}
        <div className="flex flex-row">
          {stats.map((stat, index) => (
            <div key={index} className="flex-1 py-4 px-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300">{stat.title}</h3>
                {stat.icon}
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <div className="flex items-center text-xs mt-1 text-gray-500 dark:text-gray-400">
                  <span className={`flex items-center font-medium ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.changeType === 'positive' ? 
                      <ArrowUpRight className="w-3 h-3 me-1" /> : 
                      <ArrowUpRight className="w-3 h-3 me-1 transform rotate-90" />
                    }
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Live Visitors */}
          <div className="flex-1 py-4 px-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">{getTranslation('liveVisitors')}</h3>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full me-2 ${true ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">125</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Currently online</p>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4 text-gray-400" />
                <Globe className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            {/* Refresh Button */}
            <button 
              onClick={() => {
                setRefreshKey(prev => prev + 1);
                setForceUpdate(prev => prev + 1);
              }}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors ml-2"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Chart and Right Side Section */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${direction === 'rtl' ? 'rtl' : 'ltr'}`}>
        {/* Modern Chart - Takes 2/3 of the width */}
        <div className="lg:col-span-2">
          <div className="analytics-card p-0">
            {/* Chart Header with full-width border line */}
            <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{getTranslation('overview')}</h3>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Activity className="w-3 h-3 mr-1" />
                Last 30 days
              </div>
            </div>

            {/* Chart Content */}
            <div>
              <ModernChart timeRange={selectedDate ? 'Custom Date' : selectedTimeRange} selectedDate={selectedDate} currentCurrency={currentCurrency} />
            </div>
          </div>
        </div>

        {/* Right Side - Top Pages and Live Visitors stacked */}
        <div className="lg:col-span-1 space-y-6">
          {/* Top Pages */}
          <div className="analytics-card p-0">
          {/* Card Header with full-width border line */}
          <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{getTranslation('topPages')}</h3>
          </div>

          {/* Card Content */}
          <div className="px-6 py-6">
            <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-600 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">/</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">1,247 views</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">/products</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">892 views</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">/categories</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">456 views</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-cosmt-primary rounded-full mr-3"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">/about</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">234 views</span>
            </div>
          </div>
          </div>
          </div>

          {/* Live Visitors */}
          <div className="analytics-card p-0">
          {/* Card Header with full-width border line */}
          <div className="flex justify-between items-center px-4 pt-4 pb-3 border-b">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{getTranslation('liveVisitors')}</h3>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">Live</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="px-4 py-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-xs text-gray-600 dark:text-gray-300">Currently Online</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">127</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-xs text-gray-600 dark:text-gray-300">Page Views (Today)</span>
                  </div>
                  <span className="text-base font-semibold text-gray-900 dark:text-white">2,847</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-xs text-gray-600 dark:text-gray-300">Unique Visitors (Today)</span>
                  </div>
                  <span className="text-base font-semibold text-gray-900 dark:text-white">1,234</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Notifications */}
          <RealTimeNotifications />

          {/* Quick Actions */}
          <QuickActions />

          {/* Data Status */}
          <DataStatus />
        </div>
      </div>

      {/* Traffic Sources & Device Analytics */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${direction === 'rtl' ? 'rtl' : 'ltr'}`}>
        <TrafficSources />
        <DeviceAnalytics />
      </div>

      {/* Conversion Funnel */}
      <div className={`grid grid-cols-1 gap-4 ${direction === 'rtl' ? 'rtl' : 'ltr'}`}>
        <ConversionFunnel />
      </div>
    </div>
  );
}

export default memo(AdminDashboard);
