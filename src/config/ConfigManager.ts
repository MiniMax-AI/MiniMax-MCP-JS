import { Config, TransportMode } from '../types/index.js';
import fs from 'fs';
import path from 'path';
import {
  DEFAULT_API_HOST,
  DEFAULT_SERVER_ENDPOINT,
  DEFAULT_SERVER_PORT,
  ENV_MINIMAX_API_HOST,
  ENV_MINIMAX_API_KEY,
  ENV_MINIMAX_MCP_BASE_PATH,
  ENV_RESOURCE_MODE,
  ENV_SERVER_ENDPOINT,
  ENV_SERVER_PORT,
  ENV_TRANSPORT_MODE,
  RESOURCE_MODE_URL,
  TRANSPORT_MODE_STDIO,
} from '../const/index.js';

/**
 * Configuration Manager Class
 * Handles priority of various configuration sources:
 * 1. Request-level configuration (via meta.auth, per API request) - Highest priority
 * 2. Command line arguments - High priority
 * 3. Environment variables - Medium priority
 * 4. Configuration file - Low priority
 * 5. Default values - Lowest priority
 */
export class ConfigManager {
  /**
   * Get merged configuration
   * @param requestConfig Request-level configuration (highest priority)
   * @param defaultConfig Default configuration (lowest priority)
   * @returns Merged configuration
   */
  static getConfig(requestConfig: Partial<Config> = {}, defaultConfig: Partial<Config> = {}): Config {
    // Get user desktop path as default output path
    const DesktopPath = process.env[ENV_MINIMAX_MCP_BASE_PATH]!;

    // Create base configuration (lowest priority - 5)
    const config: Config = {
      apiKey: '',
      apiHost: DEFAULT_API_HOST,
      basePath: DesktopPath,
      resourceMode: RESOURCE_MODE_URL,
      server: {
        port: DEFAULT_SERVER_PORT,
        endpoint: DEFAULT_SERVER_ENDPOINT,
        mode: TRANSPORT_MODE_STDIO,
      },
    };

    // Merge default configuration (lowest priority - 5)
    if (defaultConfig) {
      Object.assign(config, defaultConfig, {
        server: { ...config.server, ...defaultConfig.server },
      });
    }

    // Apply configurations in order from low to high priority

    // 1. Apply configuration from config file (low priority - 4)
    this.applyConfigFile(config);

    // 2. Apply configuration from environment variables (medium priority - 3)
    this.applyEnvVars(config);

    // 3. Apply configuration from command line arguments (high priority - 2)
    this.applyCliArgs(config);

    // 4. Merge request-level configuration (highest priority - 1)
    if (requestConfig) {
      Object.assign(config, requestConfig, {
        server: { ...config.server, ...requestConfig.server },
      });
    }

    // console.log(`[${new Date().toISOString()}] Configuration loaded, transport mode: ${config.server?.mode || DEFAULT_TRANSPORT_MODE}`);

    return config;
  }

  /**
   * Parse command line arguments
   * Supports --parameter value format
   */
  private static parseCliArgs(): Record<string, string> {
    const args = process.argv.slice(2); // Exclude node and script name
    const parsedArgs: Record<string, string> = {};

    for (let i = 0; i < args.length; i++) {
      // Check if it starts with --
      if (args[i].startsWith('--')) {
        const key = args[i].substring(2); // Remove -- prefix

        // Check if the next argument is a value (not starting with --)
        if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
          parsedArgs[key] = args[i + 1];
          i++; // Skip the next argument as it's already processed
        } else {
          // Flag parameter without value
          parsedArgs[key] = 'true';
        }
      }
    }

    return parsedArgs;
  }

  /**
   * Find specific parameter in command line arguments
   */
  private static findCliArg(name: string): string | undefined {
    const args = this.parseCliArgs();

    // Support both kebab-case and camelCase
    const kebabCase = name.replace(/([A-Z])/g, '-$1').toLowerCase();
    const camelCase = name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

    return args[name] || args[kebabCase] || args[camelCase];
  }

  /**
   * Apply command line arguments to configuration
   */
  private static applyCliArgs(config: Config): void {
    // Main configuration parameters
    const apiKey = this.findCliArg('api-key');
    if (apiKey) {
      config.apiKey = apiKey;
    }

    const apiHost = this.findCliArg('api-host');
    if (apiHost) {
      config.apiHost = apiHost;
    }

    const basePath = this.findCliArg('base-path');
    if (basePath) {
      config.basePath = basePath;
    }

    const resourceMode = this.findCliArg('resource-mode');
    if (resourceMode) {
      config.resourceMode = resourceMode;
    }

    // Server configuration parameters
    if (config.server) {
      const port = this.findCliArg('port');
      if (port) {
        config.server.port = parseInt(port, 10);
      }

      const endpoint = this.findCliArg('endpoint');
      if (endpoint) {
        config.server.endpoint = endpoint;
      }

      const mode = this.findCliArg('mode');
      if (mode) {
        // Ensure mode is a valid TransportMode
        if (this.isValidTransportMode(mode)) {
          config.server.mode = mode;
        }
      }
    }
  }

  /**
   * Check if a string is a valid TransportMode
   */
  private static isValidTransportMode(mode: string): mode is TransportMode {
    return ['stdio', 'rest', 'sse'].includes(mode);
  }

  /**
   * Apply environment variables to configuration
   */
  private static applyEnvVars(config: Config): void {
    // Main configuration parameters
    if (process.env[ENV_MINIMAX_API_KEY]) {
      config.apiKey = process.env[ENV_MINIMAX_API_KEY];
    }

    if (process.env[ENV_MINIMAX_API_HOST]) {
      config.apiHost = process.env[ENV_MINIMAX_API_HOST];
    }

    if (process.env[ENV_MINIMAX_MCP_BASE_PATH]) {
      config.basePath = process.env[ENV_MINIMAX_MCP_BASE_PATH];
    }

    if (process.env[ENV_RESOURCE_MODE]) {
      config.resourceMode = process.env[ENV_RESOURCE_MODE];
    }

    // Server configuration parameters
    if (config.server) {
      if (process.env[ENV_SERVER_PORT]) {
        config.server.port = parseInt(process.env[ENV_SERVER_PORT], 10);
      }

      if (process.env[ENV_SERVER_ENDPOINT]) {
        config.server.endpoint = process.env[ENV_SERVER_ENDPOINT];
      }

      if (process.env[ENV_TRANSPORT_MODE]) {
        const mode = process.env[ENV_TRANSPORT_MODE];
        // Ensure mode is a valid TransportMode
        if (this.isValidTransportMode(mode)) {
          config.server.mode = mode;
        }
      }
    }
  }

  /**
   * Apply configuration file to configuration
   */
  private static applyConfigFile(config: Config): void {
    const configFiles = ['example.minimax-config.json', path.join(process.cwd(), 'example.minimax-config.json')];

    for (const file of configFiles) {
      try {
        if (fs.existsSync(file)) {
          const fileContent = fs.readFileSync(file, 'utf-8');
          const fileConfig = JSON.parse(fileContent);

          // Merge configuration
          this.mergeConfig(config, fileConfig);
          // console.log(`[${new Date().toISOString()}] Loaded configuration from file: ${file}`);
          break;
        }
      } catch (error) {
        // console.warn(`[${new Date().toISOString()}] Failed to read configuration file: ${file}`, error);
      }
    }
  }

  /**
   * Merge configuration objects
   */
  private static mergeConfig(target: Config, source: any): void {
    if (!source) return;

    // Merge basic configuration
    if (source.apiKey) target.apiKey = source.apiKey;
    if (source.apiHost) target.apiHost = source.apiHost;
    if (source.basePath) target.basePath = source.basePath;
    if (source.resourceMode) target.resourceMode = source.resourceMode;

    // Merge server configuration
    if (source.server && target.server) {
      if (source.server.port) target.server.port = source.server.port;
      if (source.server.endpoint) target.server.endpoint = source.server.endpoint;
      if (source.server.mode && this.isValidTransportMode(source.server.mode)) {
        target.server.mode = source.server.mode;
      }
    }
  }

  /**
   * Extract configuration from meta.auth
   */
  static extractConfigFromMetaAuth(metaAuth: any): Partial<Config> | undefined {
    if (!metaAuth || typeof metaAuth !== 'object') {
      return undefined;
    }

    const config: Partial<Config> = {};

    // Support underscore format
    if (metaAuth.api_key) config.apiKey = metaAuth.api_key;
    if (metaAuth.api_host) config.apiHost = metaAuth.api_host;
    if (metaAuth.base_path) config.basePath = metaAuth.base_path;
    if (metaAuth.resource_mode) config.resourceMode = metaAuth.resource_mode;

    // Support camelCase format
    if (metaAuth.apiKey) config.apiKey = metaAuth.apiKey;
    if (metaAuth.apiHost) config.apiHost = metaAuth.apiHost;
    if (metaAuth.basePath) config.basePath = metaAuth.basePath;
    if (metaAuth.resourceMode) config.resourceMode = metaAuth.resourceMode;

    // Server configuration
    const server: any = {};
    let hasServerConfig = false;

    // Underscore format
    if (metaAuth.server_port) {
      server.port = parseInt(metaAuth.server_port, 10);
      hasServerConfig = true;
    }
    if (metaAuth.server_endpoint) {
      server.endpoint = metaAuth.server_endpoint;
      hasServerConfig = true;
    }
    if (metaAuth.server_mode) {
      const mode = metaAuth.server_mode;
      if (this.isValidTransportMode(mode)) {
        server.mode = mode;
        hasServerConfig = true;
      }
    }

    // CamelCase format
    if (metaAuth.serverPort) {
      server.port = parseInt(metaAuth.serverPort, 10);
      hasServerConfig = true;
    }
    if (metaAuth.serverEndpoint) {
      server.endpoint = metaAuth.serverEndpoint;
      hasServerConfig = true;
    }
    if (metaAuth.serverMode) {
      const mode = metaAuth.serverMode;
      if (this.isValidTransportMode(mode)) {
        server.mode = mode;
        hasServerConfig = true;
      }
    }

    // Only add server object if there are server configurations
    if (hasServerConfig) {
      config.server = server;
    }

    return Object.keys(config).length > 0 ? config : undefined;
  }
}
