export const performanceMonitor = {
  trackRender: (componentName) => {
    if (import.meta.env.DEV) {
      const start = performance.now();
      return () => {
        const end = performance.now();
        console.log(`${componentName}: ${(end - start).toFixed(2)}ms`);
      };
    }
    return () => {};
  },
};
