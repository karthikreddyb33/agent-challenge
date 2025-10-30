// This file is used to disable telemetry in the application
// It prevents the OpenTelemetry error by setting the global variable that Mastra checks

export function register() {
  // Disable Mastra telemetry
  if (typeof globalThis !== 'undefined') {
    // @ts-ignore - We're intentionally setting this global variable
    globalThis.___MASTRA_TELEMETRY___ = true;
  }

  // Disable Next.js telemetry
  if (process.env.NEXT_TELEMETRY_DISABLED !== '1') {
    process.env.NEXT_TELEMETRY_DISABLED = '1';
  }
}
