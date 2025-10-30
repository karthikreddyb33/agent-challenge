import { Mastra } from "@mastra/core/mastra";
import { ConsoleLogger } from "@mastra/core/logger";

// Client-side version of the mastra module
export const mastra = new Mastra({
  agents: {},
  mcpServers: {},
  storage: {
    get: async () => null,
    set: async () => {},
    delete: async () => {},
    clear: async () => {},
    keys: async () => [],
    values: async () => [],
    entries: async () => [],
    has: async () => false,
    size: async () => 0,
  },
  logger: new ConsoleLogger({ level: 'info' }),
  pubsub: {
    subscribe: () => () => {},
    publish: async () => {},
  },
  telemetry: {
    track: async () => {},
    identify: async () => {},
    flush: async () => {},
  },
  memory: {
    get: () => ({}),
    set: () => {},
    clear: () => {},
  },
  config: {},
  env: {},
  hooks: {},
  metrics: {},
  plugins: [],
  services: {},
  state: {},
  utils: {},
  version: '0.0.0',
  // Add any other required properties with default values
  // to match the Mastra interface
  // ...
} as any; // Using 'any' as a temporary workaround for the complex type
