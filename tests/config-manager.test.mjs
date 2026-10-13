import assert from 'node:assert/strict';
import fs from 'node:fs';
import { afterEach, beforeEach, mock, test } from 'node:test';
import { ConfigManager } from '../build/config/ConfigManager.js';
import { DEFAULT_SERVER_ENDPOINT, DEFAULT_SERVER_PORT, DEFAULT_TRANSPORT_MODE } from '../build/const/index.js';

const originalEnv = process.env;
const originalArgv = process.argv;
const defaultServer = {
  port: DEFAULT_SERVER_PORT,
  endpoint: DEFAULT_SERVER_ENDPOINT,
  mode: DEFAULT_TRANSPORT_MODE,
};

beforeEach(() => {
  process.env = {};
  process.argv = originalArgv.slice(0, 2);
  mock.method(fs, 'existsSync', () => false);
});

afterEach(() => {
  mock.restoreAll();
  process.env = originalEnv;
  process.argv = originalArgv;
});

test('keeps built-in server defaults when no override is supplied', () => {
  assert.deepEqual(ConfigManager.getConfig().server, defaultServer);
});

test('fills omitted fields in a partial default server configuration', () => {
  const config = ConfigManager.getConfig({}, { server: { endpoint: '/messages' } });
  assert.deepEqual(config.server, { ...defaultServer, endpoint: '/messages' });
});

test('preserves the environment transport and endpoint when the API overrides only the port', () => {
  process.env.MINIMAX_TRANSPORT_MODE = 'sse';
  process.env.MINIMAX_SERVER_ENDPOINT = '/messages';
  process.env.MINIMAX_SERVER_PORT = '8123';

  const config = ConfigManager.getConfig({ server: { port: 9123 } });
  assert.deepEqual(config.server, { mode: 'sse', endpoint: '/messages', port: 9123 });
});

test('preserves a CLI endpoint when the entrypoint passes mode and port', () => {
  process.argv.push('--mode', 'rest', '--port', '8123', '--endpoint', '/custom-rest');

  const config = ConfigManager.getConfig({ server: { mode: 'rest', port: 8123 } });
  assert.deepEqual(config.server, { mode: 'rest', endpoint: '/custom-rest', port: 8123 });
});

test('merges a partial meta.auth server override with the existing configuration', () => {
  const request = ConfigManager.extractConfigFromMetaAuth({ server_endpoint: '/request' });
  const config = ConfigManager.getConfig(request, { server: { mode: 'rest', port: 8123, endpoint: '/existing' } });
  assert.deepEqual(config.server, { mode: 'rest', port: 8123, endpoint: '/request' });
});

test('applies server priorities per field across defaults, file, environment, CLI, and request', () => {
  fs.existsSync.mock.restore();
  mock.method(fs, 'existsSync', () => true);
  mock.method(fs, 'readFileSync', () => JSON.stringify({ server: { mode: 'rest', port: 2222, endpoint: '/file' } }));
  process.env.MINIMAX_SERVER_PORT = '3333';
  process.env.MINIMAX_SERVER_ENDPOINT = '/environment';
  process.argv.push('--endpoint', '/cli');

  const config = ConfigManager.getConfig(
    { server: { port: 5555 } },
    { server: { mode: 'stdio', port: 1111, endpoint: '/default' } },
  );
  assert.deepEqual(config.server, { mode: 'rest', port: 5555, endpoint: '/cli' });
});

test('does not mutate the caller default server when applying environment values', () => {
  const defaults = { server: { mode: 'rest', port: 8123, endpoint: '/messages' } };
  const before = structuredClone(defaults);
  process.env.MINIMAX_SERVER_PORT = '9123';

  assert.equal(ConfigManager.getConfig({}, defaults).server.port, 9123);
  assert.deepEqual(defaults, before);
});

test('retains lower-priority options for an empty request server', () => {
  assert.deepEqual(ConfigManager.getConfig({ server: {} }).server, defaultServer);
});

test('lets a complete request server override every lower-priority field', () => {
  process.env.MINIMAX_TRANSPORT_MODE = 'sse';
  process.env.MINIMAX_SERVER_PORT = '8123';
  process.env.MINIMAX_SERVER_ENDPOINT = '/messages';
  const server = { mode: 'rest', port: 9123, endpoint: '/request' };

  assert.deepEqual(ConfigManager.getConfig({ server }).server, server);
});
