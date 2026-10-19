import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 TaskForge API server listening on http://localhost:${PORT}`);
  console.log(`📋 Health check available at http://localhost:${PORT}/health`);
  console.log(`📝 Tasks API base URL at http://localhost:${PORT}/api/v1/tasks`);
});

// Graceful shutdown handling
const handleShutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed successfully.');
    process.exit(0);
  });

  // Force shutdown after timeout if pending connections hang
  setTimeout(() => {
    console.error('Forcefully terminating process after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

export default server;

