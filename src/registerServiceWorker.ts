export function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('mytoolsbox Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  } else if ('serviceWorker' in navigator) {
    // In dev mode, register anyway to allow offline testing
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('mytoolsbox Service Worker registered (dev):', registration.scope);
        })
        .catch((error) => {
          console.warn('Service Worker registration skipped or failed in dev:', error);
        });
    });
  }
}
