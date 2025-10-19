export const setupGlobalErrorHandlers = () => {
  window.addEventListener('error', (event) => {
    if (import.meta.env.DEV) {
      console.error('Error:', event.error);
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (import.meta.env.DEV) {
      console.error('Unhandled Promise Rejection:', event.reason);
    }
  });
};
