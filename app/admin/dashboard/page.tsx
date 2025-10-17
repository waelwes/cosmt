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
  ShoppingCart,
  CheckCircle,
  ArrowDown,
  Target,
  Zap
} from 'lucide-react';
import { formatPrice } from '../../../utils/currency';
import { useLanguage } from '../../../contexts/LanguageContext';
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


// Live Visitor Count Component
const LiveVisitorCount = memo(() => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

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
    <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg" style={{ border: '1px solid #eef2f6' }}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Live Visitors</h3>
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
        </div>
      </div>
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
  );
});

// Traffic Sources Component
const TrafficSources = ({ t }: { t: any }) => {
  const trafficData = [
    {
      source: 'Organic Search',
      visitors: 1247,
      percentage: 45.2,
      icon: Search,
      color: 'bg-gray-600',
      trend: '+12.5%'
    },
    {
      source: 'Direct',
      visitors: 892,
      percentage: 32.3,
      icon: ExternalLink,
      color: 'bg-gray-500',
      trend: '+8.2%'
    },
    {
      source: 'Social Media',
      visitors: 456,
      percentage: 16.5,
      icon: Share2,
      color: 'bg-gray-400',
      trend: '+15.3%'
    },
    {
      source: 'Email',
      visitors: 123,
      percentage: 4.5,
      icon: Mail,
      color: 'bg-gray-300',
      trend: '+3.1%'
    },
    {
      source: 'Referral',
      visitors: 89,
      percentage: 3.2,
      icon: Globe,
      color: 'bg-cosmt-primary',
      trend: '-2.4%'
    }
  ];

  return (
    <div className="analytics-card p-0">
      {/* Card Header with full-width border line */}
      <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b" style={{ borderBottomColor: '#eef2f6' }}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.trafficSources}</h3>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Activity className="w-3 h-3 mr-1" />
          30 days
        </div>
      </div>

      {/* Card Content */}
      <div className="px-6 py-6">
      
      <div className="space-y-3">
        {trafficData.map((source, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <div className={`w-2 h-2 rounded-full ${source.color} mr-2`}></div>
              <div className="flex items-center">
                <source.icon className="w-3 h-3 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{source.source}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{source.visitors.toLocaleString()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{source.percentage}%</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-1 mr-2">
                  <div 
                    className={`h-1 rounded-full ${source.color}`}
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
const DeviceAnalytics = ({ t }: { t: any }) => {
  const deviceData = [
    {
      device: 'Desktop',
      visitors: 1847,
      percentage: 66.9,
      icon: Monitor,
      color: 'bg-gray-600'
    },
    {
      device: 'Mobile',
      visitors: 789,
      percentage: 28.6,
      icon: Smartphone,
      color: 'bg-gray-400'
    },
    {
      device: 'Tablet',
      visitors: 127,
      percentage: 4.6,
      icon: Monitor,
      color: 'bg-cosmt-primary'
    }
  ];

  return (
    <div className="analytics-card p-0">
      {/* Card Header with full-width border line */}
      <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b" style={{ borderBottomColor: '#eef2f6' }}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.deviceAnalytics}</h3>
      </div>

      {/* Card Content */}
      <div className="px-6 py-6">
        <div className="space-y-3">
        {deviceData.map((device, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <div className={`w-2 h-2 rounded-full ${device.color} mr-2`}></div>
              <div className="flex items-center">
                <device.icon className="w-3 h-3 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{device.device}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{device.visitors.toLocaleString()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{device.percentage}%</div>
              </div>
              
              <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full ${device.color}`}
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
const ConversionFunnel = ({ t }: { t: any }) => {
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
      <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b" style={{ borderBottomColor: '#eef2f6' }}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.conversionFunnel}</h3>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Zap className="w-3 h-3 mr-1" />
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
                  <div className={`w-6 h-6 ${step.color} rounded flex items-center justify-center mr-3`}>
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
                
                <div className="text-right">
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
      <div className="mt-4 pt-3 border-t" style={{ borderTopColor: '#eef2f6' }}>
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
  <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg" style={{ border: '1px solid #eef2f6' }}>
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">{stat.title}</h3>
      {stat.icon}
    </div>
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
));



// Modern Chart Component
const ModernChart = ({ timeRange = 'All', selectedDate, currentCurrency = 'USD', t }: { timeRange?: string; selectedDate?: Date | null; currentCurrency?: string; t: any }) => {
  
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t.salesOverview}</h2>
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
  // Test if context is available
  let languageContext;
  try {
    languageContext = useLanguage();
  } catch (error) {
    console.error('LanguageContext not available in dashboard:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">
          Language Context Error in Dashboard: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }
  
  const { t, currentLanguage, direction } = languageContext;
  // Get current currency from localStorage
  const [currentCurrency, setCurrentCurrency] = React.useState('USD');
  // Force re-render state
  const [refreshKey, setRefreshKey] = React.useState(0);
  
  // Date picker state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Time range state for chart
  const [selectedTimeRange, setSelectedTimeRange] = useState('All');
  
  React.useEffect(() => {
    const savedCurrency = localStorage.getItem('preferred-currency') || 'USD';
    setCurrentCurrency(savedCurrency);
  }, []);

  // Listen for currency changes
  React.useEffect(() => {
    const handleCurrencyChange = (e: CustomEvent) => {
      if (e.detail && e.detail.currency) {
        setCurrentCurrency(e.detail.currency);
      }
    };

    window.addEventListener('currencyChanged', handleCurrencyChange as EventListener);
    return () => window.removeEventListener('currencyChanged', handleCurrencyChange as EventListener);
  }, []);

  // Listen for language changes
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

  // Check for language changes every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      const savedLanguage = localStorage.getItem('preferred-language') || 'en';
      if (savedLanguage !== currentLanguage) {
        console.log('Language changed in localStorage:', savedLanguage);
        setRefreshKey(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentLanguage]);

  // Force re-render when language changes
  const [forceUpdate, setForceUpdate] = React.useState(0);
  
  React.useEffect(() => {
    // This effect will run whenever currentLanguage changes, forcing a re-render
    console.log('Language changed to:', currentLanguage);
    console.log('Current translations:', t);
    setForceUpdate(prev => prev + 1);
  }, [currentLanguage, t]);

  // Close date picker when clicking outside
  useEffect(() => {
    if (!showDatePicker) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.date-picker-container')) {
        setShowDatePicker(false);
      }
    };

    // Use a small delay to prevent conflicts with Next.js routing
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

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
  
  // Memoized data to prevent unnecessary re-renders
  const stats = useMemo(() => [
    {
      title: t.totalSales,
      value: formatPrice(125430, currentCurrency, 'USD'),
      change: '+12.5% from last month',
      changeType: 'positive',
      icon: <DollarSign className="w-5 h-5 text-gray-500 dark:text-gray-400" />
    },
    {
      title: t.netSales,
      value: formatPrice(118900, currentCurrency, 'USD'),
      change: '+11.8% from last month',
      changeType: 'positive',
      icon: <TrendingUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
    },
    {
      title: t.orderCount,
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
  ], [currentCurrency, t]);



  return (
    <div 
      className={`space-y-6 ${direction === 'rtl' ? 'rtl' : 'ltr'}`} 
      key={`${currentLanguage}-${refreshKey}`}
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
        <div className={`flex justify-between items-center px-4 pt-4 pb-3 border-b ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`} style={{ borderBottomColor: '#eef2f6' }}>
          <h1 className={`text-lg font-semibold text-gray-900 dark:text-white ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>Dashboard</h1>
          <div className={`flex items-center text-sm ${direction === 'rtl' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
            {/* Time Period Filter */}
            <div className={`flex items-center rounded-lg overflow-hidden ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`} style={{ border: '1px solid #eef2f6' }}>
            <button 
              onClick={() => setSelectedTimeRange('All')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedTimeRange === 'All' 
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
{t.all}
            </button>
            <div className="w-px h-6" style={{ backgroundColor: '#eef2f6' }}></div>
            <button 
              onClick={() => setSelectedTimeRange('Today')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedTimeRange === 'Today' 
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {t.today}
            </button>
            <div className="w-px h-6" style={{ backgroundColor: '#eef2f6' }}></div>
            <button 
              onClick={() => setSelectedTimeRange('This Week')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedTimeRange === 'This Week' 
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {t.thisWeek}
            </button>
            <div className="w-px h-6" style={{ backgroundColor: '#eef2f6' }}></div>
            <button 
              onClick={() => setSelectedTimeRange('This Month')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedTimeRange === 'This Month' 
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {t.thisMonth}
            </button>
            <div className="w-px h-6" style={{ backgroundColor: '#eef2f6' }}></div>
            <button 
              onClick={() => setSelectedTimeRange('This Year')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedTimeRange === 'This Year' 
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {t.thisYear}
            </button>
            <div className="w-px h-6" style={{ backgroundColor: '#eef2f6' }}></div>
            <div className="relative date-picker-container">
              <button 
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {selectedDate ? formatDate(selectedDate) : t.selectDate}
              </button>
              
              {/* Date Picker Popover */}
              {showDatePicker && (
                <div 
                  className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded z-[9999] p-4 w-80"
                  style={{ border: '1px solid #eef2f6' }}
                  style={{ 
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    marginTop: '8px',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
                    zIndex: 9999,
                    padding: '16px',
                    width: '320px'
                  }}
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
                  <div className="mt-4 pt-3 border-t" style={{ borderTopColor: '#eef2f6' }}>
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
        <div className={`flex ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
          {stats.map((stat, index) => (
            <div key={index} className={`flex-1 py-4 px-4 ${direction === 'rtl' ? 'border-l last:border-l-0' : 'border-r last:border-r-0'}`} style={{ borderRightColor: '#eef2f6' }}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300">{stat.title}</h3>
                {stat.icon}
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
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
          ))}
          
          {/* Live Visitors */}
          <div className="flex-1 py-4 px-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Live Visitors</h3>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${true ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
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
            <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b" style={{ borderBottomColor: '#eef2f6' }}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics Overview</h3>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Activity className="w-3 h-3 mr-1" />
                Last 30 days
              </div>
            </div>

            {/* Chart Content */}
            <div>
              <ModernChart timeRange={selectedDate ? 'Custom Date' : selectedTimeRange} selectedDate={selectedDate} currentCurrency={currentCurrency} t={t} />
            </div>
          </div>
        </div>

        {/* Right Side - Top Pages and Live Visitors stacked */}
        <div className="lg:col-span-1 space-y-6">
          {/* Top Pages */}
          <div className="analytics-card">
          {/* Card Header with full-width border line */}
          <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b" style={{ borderBottomColor: '#eef2f6' }}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.topPages}</h3>
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
          <div className="analytics-card">
          {/* Card Header with full-width border line */}
          <div className="flex justify-between items-center px-4 pt-4 pb-3 border-b" style={{ borderBottomColor: '#eef2f6' }}>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t.liveVisitors}</h3>
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
        </div>
      </div>

      {/* Traffic Sources & Device Analytics */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${direction === 'rtl' ? 'rtl' : 'ltr'}`}>
        <TrafficSources t={t} />
        <DeviceAnalytics t={t} />
      </div>

      {/* Conversion Funnel */}
      <div className={`grid grid-cols-1 gap-4 ${direction === 'rtl' ? 'rtl' : 'ltr'}`}>
        <ConversionFunnel t={t} />
      </div>
    </div>
  );
}

export default memo(AdminDashboard);
