// Simple client-side version of the mastra module
export const mastra = {
  agents: {},
  mcpServers: {},
  storage: {
    get: async () => ({}),
    set: async () => {},
    delete: async () => {},
    clear: async () => {},
    keys: async () => [],
    values: async () => [],
    entries: async () => [],
    has: async () => false,
    size: async () => 0,
  },
  logger: {
    info: () => {},
    error: () => {},
    warn: () => {},
    debug: () => {},
  },
  pubsub: {
    subscribe: () => () => {},
    publish: () => {},
  },
  telemetry: {
    track: () => {},
    identify: () => {},
    flush: () => {},
  },
  memory: {
    get: () => {},
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
  version: '0.0.0'
} as const;
