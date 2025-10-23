// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(label: string): void {
    this.metrics.set(`${label}_start`, performance.now());
  }

  endTimer(label: string): number {
    const startTime = this.metrics.get(`${label}_start`);
    if (!startTime) {
      console.warn(`Timer ${label} was not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.metrics.set(`${label}_duration`, duration);
    
    // Log slow operations
    if (duration > 1000) {
      console.warn(`🐌 Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
    } else if (duration > 500) {
      console.log(`⏱️ ${label} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  getMetric(label: string): number | undefined {
    return this.metrics.get(`${label}_duration`);
  }

  getAllMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((value, key) => {
      if (key.endsWith('_duration')) {
        result[key.replace('_duration', '')] = value;
      }
    });
    return result;
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Hook for measuring component performance
export function usePerformanceMonitor(componentName: string) {
  const monitor = PerformanceMonitor.getInstance();
  
  return {
    startTimer: (label: string) => monitor.startTimer(`${componentName}_${label}`),
    endTimer: (label: string) => monitor.endTimer(`${componentName}_${label}`),
    getMetric: (label: string) => monitor.getMetric(`${componentName}_${label}`),
  };
}

// Utility to measure async operations
export async function measureAsync<T>(
  operation: () => Promise<T>,
  label: string
): Promise<T> {
  const monitor = PerformanceMonitor.getInstance();
  monitor.startTimer(label);
  
  try {
    const result = await operation();
    monitor.endTimer(label);
    return result;
  } catch (error) {
    monitor.endTimer(label);
    throw error;
  }
}

// Utility to measure sync operations
export function measureSync<T>(
  operation: () => T,
  label: string
): T {
  const monitor = PerformanceMonitor.getInstance();
  monitor.startTimer(label);
  
  try {
    const result = operation();
    monitor.endTimer(label);
    return result;
  } catch (error) {
    monitor.endTimer(label);
    throw error;
  }
}