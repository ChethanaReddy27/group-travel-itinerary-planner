import 'dotenv/config';
import { createApp } from './app';

const app = createApp();
const PORT = Number(process.env.PORT) || 3019;

const server = app.listen(PORT, () => {
  console.log('──────────────────────────────────────');
  console.log('  Group Travel Planner API started');
  console.log(`  Port:           ${PORT}`);
  console.log(`  Environment:    ${process.env.NODE_ENV || 'development'}`);
  console.log('──────────────────────────────────────');
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed. Shutdown complete.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received — shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed. Shutdown complete.');
    process.exit(0);
  });
});
