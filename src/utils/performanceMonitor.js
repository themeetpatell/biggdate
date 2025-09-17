// Performance monitoring utilities
export const performanceMonitor = {
  // Track component render times
  trackRender: (componentName) => {
    if (process.env.NODE_ENV === 'development') {
      const start = performance.now();
      return () => {
        const end = performance.now();
        console.log(`${componentName} render time: ${(end - start).toFixed(2)}ms`);
      };
    }
    return () => {};
  },

  // Track API call performance
  trackApiCall: async (apiName, apiCall) => {
    const start = performance.now();
    try {
      const result = await apiCall();
      const end = performance.now();
      console.log(`${apiName} completed in ${(end - start).toFixed(2)}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.error(`${apiName} failed after ${(end - start).toFixed(2)}ms:`, error);
      throw error;
    }
  },

  // Track bundle size
  trackBundleSize: () => {
    if (process.env.NODE_ENV === 'development') {
      const scripts = document.querySelectorAll('script[src]');
      let totalSize = 0;
      
      scripts.forEach(script => {
        const src = script.src;
        if (src.includes('assets/js/')) {
          // This is a rough estimate - in production you'd want to use Resource Timing API
          console.log(`Script loaded: ${src}`);
        }
      });
    }
  },

  // Track memory usage (if available)
  trackMemoryUsage: () => {
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const memory = performance.memory;
      console.log('Memory usage:', {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
      });
    }
  },

  // Track Core Web Vitals
  trackWebVitals: () => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Track Largest Contentful Paint (LCP)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Track First Input Delay (FID)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      }).observe({ entryTypes: ['first-input'] });

      // Track Cumulative Layout Shift (CLS)
      new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log('CLS:', clsValue);
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }
};

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.trackWebVitals();
  
  // Track page load performance
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor.trackMemoryUsage();
    }, 1000);
  });
}
