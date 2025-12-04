// Keep-alive service to prevent Render free tier from sleeping
let keepAliveInterval = null;

export const startKeepAlive = () => {
  // Don't run in development
  if (import.meta.env.MODE !== 'production') {
    return;
  }

  // Ping the health endpoint every 10 minutes (600000ms)
  keepAliveInterval = setInterval(async () => {
    try {
      const response = await fetch('/health');
      if (response.ok) {
        console.log('Keep-alive ping successful');
      }
    } catch (error) {
      console.log('Keep-alive ping failed:', error.message);
    }
  }, 10 * 60 * 1000); // 10 minutes

  console.log('Keep-alive service started');
};

export const stopKeepAlive = () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
    console.log('Keep-alive service stopped');
  }
};
