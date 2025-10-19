// Performance optimization utilities
import React, { memo, useCallback, useMemo, useRef, useEffect, useState } from 'react';

// Debounce hook for performance
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook for performance
export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now());

  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [hasIntersected, options]);

  return [ref, isIntersecting, hasIntersected];
};

// Image lazy loading component
export const LazyImage = memo(({ src, alt, className, placeholder, ...props }) => {
  const [ref, isIntersecting, hasIntersected] = useIntersectionObserver();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (hasIntersected && !isLoaded && !hasError) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setHasError(true);
      img.src = src;
    }
  }, [hasIntersected, src, isLoaded, hasError]);

  return (
    <div ref={ref} className={className} {...props}>
      {hasIntersected ? (
        isLoaded ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : hasError ? (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Failed to load</span>
          </div>
        ) : (
          <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
            <span className="text-gray-400">Loading...</span>
          </div>
        )
      ) : (
        placeholder || (
          <div className="w-full h-full bg-gray-100 animate-pulse" />
        )
      )}
    </div>
  );
});

// Virtual scrolling hook for large lists
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef();

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index,
      top: (startIndex + index) * itemHeight,
    }));
  }, [items, startIndex, endIndex, itemHeight]);

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return {
    containerRef,
    visibleItems,
    totalHeight,
    handleScroll,
  };
};

// Performance monitoring
export const usePerformanceMonitor = (componentName) => {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    
    if (import.meta.env.DEV) {
      console.log(`${componentName} rendered ${renderCount.current} times in ${renderTime.toFixed(2)}ms`);
    }
    
    startTime.current = performance.now();
  });

  return renderCount.current;
};

// Memoized component wrapper
export const withPerformanceOptimization = (Component, displayName) => {
  const OptimizedComponent = memo(Component);
  OptimizedComponent.displayName = displayName || Component.displayName || Component.name;
  return OptimizedComponent;
};

// Bundle size optimization - dynamic imports
export const loadComponent = (importFunc) => {
  return React.lazy(() => importFunc().catch(() => ({
    default: () => <div className="p-4 text-center text-red-500">Failed to load component</div>
  })));
};

// Preload critical resources
export const preloadResource = (href, as = 'script') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

// Prefetch resources
export const prefetchResource = (href) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
};

// Service Worker registration for caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.log('Service Worker registration failed:', error);
    }
  }
};

// Critical CSS inlining
export const inlineCriticalCSS = (css) => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};

// Resource hints
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const dnsPrefetchDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];
  
  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
};

// Image optimization
export const optimizeImage = (src, width, height, quality = 80) => {
  // This would integrate with an image optimization service
  // For now, return the original src
  return src;
};

// Bundle analyzer helper
export const analyzeBundle = () => {
  if (import.meta.env.DEV) {
    console.log('Bundle analysis available - use npm run analyze for detailed analysis');
  }
};
