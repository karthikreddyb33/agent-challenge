/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Disable OpenTelemetry telemetry
    instrumentationHook: false,
  },
  // Disable Next.js telemetry
  telemetry: false,
};

module.exports = nextConfig;
