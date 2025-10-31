/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  // Disable Next.js telemetry
  experimental: {
    // Add any experimental features here if needed
    instrumentationHook: true
  },
  // Disable Next.js telemetry
  telemetry: false
};

// Disable Mastra telemetry in development
if (process.env.NODE_ENV !== 'production') {
  globalThis.___MASTRA_TELEMETRY___ = false;
}

module.exports = nextConfig;
