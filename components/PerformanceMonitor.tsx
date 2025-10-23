'use client';

import React, { useState, useEffect } from 'react';
import { connectionMonitor, networkOptimizedCache } from '@/lib/optimizations/networkOptimizations';

interface PerformanceStats {
  avgResponseTime: number;
  strategy: string;
  cacheSize: number;
  cacheKeys: string[];
}

export const PerformanceMonitor: React.FC = () => {
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      const cacheStats = networkOptimizedCache.getStats();
      setStats({
        avgResponseTime: cacheStats.avgResponseTime,
        strategy: cacheStats.strategy,
        cacheSize: cacheStats.size,
        cacheKeys: cacheStats.keys,
      });
    };

    // Update stats immediately
    updateStats();

    // Update stats every 5 seconds
    const interval = setInterval(updateStats, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!stats || !isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-3 py-1 rounded text-xs z-50"
      >
        📊 Perf
      </button>
    );
  }

  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case 'aggressive': return 'text-red-500';
      case 'moderate': return 'text-yellow-500';
      case 'minimal': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getResponseTimeColor = (time: number) => {
    if (time < 100) return 'text-green-500';
    if (time < 200) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-xs z-50 max-w-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Performance Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Response Time:</span>
          <span className={getResponseTimeColor(stats.avgResponseTime)}>
            {stats.avgResponseTime.toFixed(0)}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Strategy:</span>
          <span className={getStrategyColor(stats.strategy)}>
            {stats.strategy}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Cache Size:</span>
          <span className="text-blue-500">
            {stats.cacheSize} items
          </span>
        </div>
        
        {stats.cacheKeys.length > 0 && (
          <div>
            <span className="text-gray-600">Cached:</span>
            <div className="text-xs text-gray-500 mt-1">
              {stats.cacheKeys.join(', ')}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          {stats.avgResponseTime < 100 ? '🚀 Excellent' : 
           stats.avgResponseTime < 200 ? '⚡ Good' : 
           '🐌 Slow - Consider caching'}
        </div>
      </div>
    </div>
  );
};
