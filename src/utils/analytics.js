export const initializeAnalytics = () => {
  if (import.meta.env.DEV) {
    console.log('Analytics initialized in development mode');
  }
};
