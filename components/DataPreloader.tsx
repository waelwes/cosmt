'use client';

import { useEffect, useState } from 'react';
import { dataPreloader } from '@/lib/optimizations/dataPreloader';

interface DataPreloaderProps {
  children: React.ReactNode;
}

export const DataPreloader: React.FC<DataPreloaderProps> = ({ children }) => {
  const [isPreloading, setIsPreloading] = useState(true);
  const [preloadStatus, setPreloadStatus] = useState<{
    preloaded: string[];
    inProgress: string[];
  }>({ preloaded: [], inProgress: [] });

  useEffect(() => {
    const initializePreloading = async () => {
      try {
        // Start preloading critical data
        await dataPreloader.preloadCriticalData();
        
        // Update status periodically
        const statusInterval = setInterval(() => {
          setPreloadStatus(dataPreloader.getPreloadStatus());
        }, 1000);

        // Clear interval after 10 seconds
        setTimeout(() => {
          clearInterval(statusInterval);
          setIsPreloading(false);
        }, 10000);

        // Set initial status
        setPreloadStatus(dataPreloader.getPreloadStatus());
      } catch (error) {
        console.error('Preloading failed:', error);
        setIsPreloading(false);
      }
    };

    initializePreloading();
  }, []);

  return (
    <>
      {children}
      
      {/* Preloading indicator (optional) */}
      {isPreloading && process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg z-50 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Preloading data...</span>
          </div>
          <div className="mt-2 text-xs">
            <div>✅ {preloadStatus.preloaded.join(', ')}</div>
            {preloadStatus.inProgress.length > 0 && (
              <div>🔄 {preloadStatus.inProgress.join(', ')}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
