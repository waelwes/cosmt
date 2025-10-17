'use client';

import React, { memo, useMemo, useState } from 'react';
import { BarChart3, TrendingUp, Users, ShoppingCart, DollarSign, Eye, Star, Download, Filter, Calendar } from 'lucide-react';

// Mock data for analytics
const salesData = [
  { month: 'Jan', revenue: 12500, orders: 89, customers: 67 },
  { month: 'Feb', revenue: 15200, orders: 112, customers: 89 },
  { month: 'Mar', revenue: 18900, orders: 134, customers: 98 },
  { month: 'Apr', revenue: 22100, orders: 156, customers: 112 },
  { month: 'May', revenue: 19800, orders: 145, customers: 108 },
  { month: 'Jun', revenue: 25600, orders: 178, customers: 134 },
  { month: 'Jul', revenue: 28900, orders: 201, customers: 156 },
  { month: 'Aug', revenue: 31200, orders: 223, customers: 167 },
  { month: 'Sep', revenue: 27800, orders: 198, customers: 145 },
  { month: 'Oct', revenue: 33400, orders: 245, customers: 189 },
  { month: 'Nov', revenue: 28700, orders: 212, customers: 156 },
  { month: 'Dec', revenue: 35600, orders: 267, customers: 201 }
];

const topProducts = [
  { id: 1, name: 'AVEDA Invati Advanced™ Exfoliating Shampoo', sales: 156, revenue: 7020, growth: 12.5 },
  { id: 2, name: 'DAVINES Natural Tech Replumping Shampoo', sales: 134, revenue: 7370, growth: 8.3 },
  { id: 3, name: 'Retinol Anti-Aging Serum', sales: 98, revenue: 7350, growth: 15.7 },
  { id: 4, name: 'Luxury Foundation - Medium', sales: 87, revenue: 3306, growth: 5.2 },
  { id: 5, name: 'Signature Perfume - 50ml', sales: 76, revenue: 9120, growth: 22.1 }
];

const customerSegments = [
  { segment: 'New Customers', count: 89, percentage: 35.2, revenue: 12450 },
  { segment: 'Returning Customers', count: 112, percentage: 44.3, revenue: 28900 },
  { segment: 'VIP Customers', count: 52, percentage: 20.5, revenue: 45600 }
];

const trafficSources = [
  { source: 'Direct', visitors: 12450, percentage: 45.2, conversion: 3.2 },
  { source: 'Google Search', visitors: 8750, percentage: 31.8, conversion: 4.1 },
  { source: 'Social Media', visitors: 3450, percentage: 12.5, conversion: 2.8 },
  { source: 'Email Marketing', visitors: 1890, percentage: 6.9, conversion: 5.7 },
  { source: 'Referrals', visitors: 1060, percentage: 3.8, conversion: 3.9 }
];

const recentOrders = [
  { id: 1, customer: 'Sarah Johnson', product: 'AVEDA Shampoo', amount: 45.00, status: 'completed', date: '2024-01-16' },
  { id: 2, customer: 'Mike Chen', product: 'DAVINES Conditioner', amount: 55.00, status: 'shipped', date: '2024-01-16' },
  { id: 3, customer: 'Emma Wilson', product: 'Retinol Serum', amount: 75.00, status: 'processing', date: '2024-01-15' },
  { id: 4, customer: 'David Brown', product: 'Luxury Foundation', amount: 38.00, status: 'completed', date: '2024-01-15' },
  { id: 5, customer: 'Lisa Garcia', product: 'Signature Perfume', amount: 120.00, status: 'pending', date: '2024-01-14' }
];

const conversionFunnel = [
  { stage: 'Visitors', count: 27500, percentage: 100 },
  { stage: 'Product Views', count: 18900, percentage: 68.7 },
  { stage: 'Add to Cart', count: 3450, percentage: 12.5 },
  { stage: 'Checkout Started', count: 1890, percentage: 6.9 },
  { stage: 'Purchase Completed', count: 1234, percentage: 4.5 }
];

// Helper functions
const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
const formatPercentage = (value: number) => `${value}%`;
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-green-600 bg-green-50';
    case 'shipped': return 'text-blue-600 bg-blue-50';
    case 'processing': return 'text-yellow-600 bg-yellow-50';
    case 'pending': return 'text-gray-600 bg-gray-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

// Memoized components
const StatCard = memo(({ title, value, change, icon: Icon, color, trend }: {
  title: string;
  value: string | number;
  change?: string;
  icon: any;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}) => (
  <div className="p-5 rounded-md" style={{ border: '1px solid #eef2f6' }}>
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">{title}</h3>
      <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      {change && (
        <div className="flex items-center text-xs mt-1 text-gray-500 dark:text-gray-400">
          <span className={`flex items-center font-medium ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
            {trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
            {trend === 'down' && <TrendingUp className="w-3 h-3 mr-1 rotate-180" />}
            {change}
          </span>
        </div>
      )}
    </div>
  </div>
));

const ChartCard = memo(({ title, children, className = "" }: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`analytics-card p-0 ${className}`}>
    <div className="px-6 pt-6 pb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
    </div>
    <div className="border-t mb-4" style={{ borderTopColor: '#eef2f6', borderTopWidth: '1px' }}></div>
    <div className="px-6 pb-6">
      {children}
    </div>
  </div>
));

const TopProductCard = memo(({ product, rank }: { product: any; rank: number }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
    <div className="flex items-center space-x-3">
      <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold">
        {rank}
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{product.name}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">{product.sales} sales • {formatCurrency(product.revenue)}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-xs font-semibold text-green-600">+{product.growth}%</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">vs last month</p>
    </div>
  </div>
));

const OrderItem = memo(({ order }: { order: any }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
        <ShoppingCart className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{order.customer}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{order.product}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(order.amount)}</p>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
        {order.status.toUpperCase()}
      </span>
    </div>
  </div>
));

const FunnelStep = memo(({ step, index }: { step: any; index: number }) => (
  <div className="flex items-center space-x-3">
    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold text-xs">
      {index + 1}
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{step.stage}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{step.count.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
        <div 
          className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${step.percentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{step.percentage}% conversion</p>
    </div>
  </div>
));

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('12months');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  
  // Date picker state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Memoized calculations
  const stats = useMemo(() => {
    const totalRevenue = salesData.reduce((sum, month) => sum + month.revenue, 0);
    const totalOrders = salesData.reduce((sum, month) => sum + month.orders, 0);
    const totalCustomers = salesData.reduce((sum, month) => sum + month.customers, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const lastMonth = salesData[salesData.length - 1];
    const prevMonth = salesData[salesData.length - 2];
    
    const revenueGrowth = prevMonth ? ((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue * 100) : 0;
    const ordersGrowth = prevMonth ? ((lastMonth.orders - prevMonth.orders) / prevMonth.orders * 100) : 0;
    const customersGrowth = prevMonth ? ((lastMonth.customers - prevMonth.customers) / prevMonth.customers * 100) : 0;
    
    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      avgOrderValue,
      revenueGrowth,
      ordersGrowth,
      customersGrowth
    };
  }, []);

  // Analytics stats for the header
  const analyticsStats = useMemo(() => [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: `+${stats.revenueGrowth.toFixed(1)}%`,
      changeType: 'positive',
      icon: <DollarSign className="w-5 h-5 text-gray-400" />
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: `+${stats.ordersGrowth.toFixed(1)}%`,
      changeType: 'positive',
      icon: <ShoppingCart className="w-5 h-5 text-gray-400" />
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      change: `+${stats.customersGrowth.toFixed(1)}%`,
      changeType: 'positive',
      icon: <Users className="w-5 h-5 text-gray-400" />
    },
    {
      title: 'Avg Order Value',
      value: `$${stats.avgOrderValue.toFixed(2)}`,
      change: '+5.2%',
      changeType: 'positive',
      icon: <BarChart3 className="w-5 h-5 text-gray-400" />
    }
  ], [stats]);

  const conversionRate = useMemo(() => {
    const visitors = conversionFunnel[0].count;
    const purchases = conversionFunnel[conversionFunnel.length - 1].count;
    return visitors > 0 ? (purchases / visitors * 100) : 0;
  }, []);

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
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    setShowDatePicker(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  return (
    <div className="space-y-4" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Combined Analytics Card */}
      <div className="analytics-card p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Analytics</h1>
          </div>
          
          {/* Time Period Filter */}
          <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid #eef2f6' }}>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              All
            </button>
            <div className="w-px h-6" style={{ backgroundColor: '#eef2f6' }}></div>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Today
            </button>
            <div className="w-px h-6" style={{ backgroundColor: '#eef2f6' }}></div>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              This Week
            </button>
            <div className="w-px h-6" style={{ backgroundColor: '#eef2f6' }}></div>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              This Month
            </button>
            <div className="w-px h-6" style={{ backgroundColor: '#eef2f6' }}></div>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              This Year
            </button>
            <div className="w-px h-6" style={{ backgroundColor: '#eef2f6' }}></div>
            <div className="relative date-picker-container">
              <button 
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {selectedDate ? formatDate(selectedDate) : 'Select Date'}
              </button>
              
              {/* Date Picker Popover */}
              {showDatePicker && (
                <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-[9999] p-4 w-80" style={{ border: '1px solid #eef2f6' }}>
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
        
        {/* Horizontal Line */}
        <div className="border-t mb-4 -mx-6" style={{ borderTopColor: '#eef2f6', borderTopWidth: '1px' }}></div>
        
        {/* Stats Grid */}
        <div className="flex">
          {analyticsStats.map((stat, index) => (
            <div key={index} className="flex-1 py-4 px-4 border-r last:border-r-0" style={{ borderRightColor: '#eef2f6' }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">{stat.title}</h3>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <div className="flex items-center text-xs mt-1 text-gray-500 dark:text-gray-400">
                  <span className={`flex items-center font-medium ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.changeType === 'positive' ? 
                      <TrendingUp className="w-3 h-3 mr-1" /> : 
                      <TrendingUp className="w-3 h-3 mr-1 transform rotate-180" />
                    }
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <ChartCard title="Sales Trend">
          <div className="h-64 flex items-end justify-between space-x-2">
            {salesData.slice(-6).map((month, index) => (
              <div key={month.month} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-green-500 rounded-t"
                  style={{ height: `${(month.revenue / Math.max(...salesData.map(m => m.revenue))) * 200}px` }}
                ></div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{month.month}</p>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(month.revenue)}</p>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Conversion Funnel */}
        <ChartCard title="Conversion Funnel">
          <div className="space-y-4">
            {conversionFunnel.map((step, index) => (
              <FunnelStep key={step.stage} step={step} index={index} />
            ))}
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-800">
                Overall Conversion Rate: {conversionRate.toFixed(2)}%
              </p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <ChartCard title="Top Products" className="lg:col-span-1">
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <TopProductCard key={product.id} product={product} rank={index + 1} />
            ))}
          </div>
        </ChartCard>

        {/* Customer Segments */}
        <ChartCard title="Customer Segments">
          <div className="space-y-4">
            {customerSegments.map((segment) => (
              <div key={segment.segment} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{segment.segment}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{segment.count} customers</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(segment.revenue)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{segment.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Traffic Sources */}
        <ChartCard title="Traffic Sources">
          <div className="space-y-4">
            {trafficSources.map((source) => (
              <div key={source.source} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{source.source}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{source.visitors.toLocaleString()} visitors</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{source.percentage}%</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{source.conversion}% conversion</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Recent Orders */}
      <ChartCard title="Recent Orders">
        <div className="space-y-2">
          {recentOrders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
        <div className="mt-4 text-center">
          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
            View All Orders
          </button>
        </div>
      </ChartCard>
    </div>
  );
}
