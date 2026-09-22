import assert from 'node:assert/strict';
import test from 'node:test';
import { MediaService } from '../build/services/media-service.js';

class FakeVideoAPI {
  constructor() {
    this.postCalls = [];
    this.getCalls = [];
  }

  async post(endpoint, body) {
    this.postCalls.push({ endpoint, body });
    return { task_id: 'task-123' };
  }

  async get(endpoint) {
    this.getCalls.push(endpoint);
    throw new Error('video polling should not start for async requests');
  }

  getResourceMode() {
    return 'url';
  }
}

test('REST async_mode returns the task id without polling', async () => {
  const api = new FakeVideoAPI();
  const service = new MediaService(api);
  await service.initialize({ apiKey: 'test-key', resourceMode: 'url' });

  const result = await service.generateVideo({
    prompt: 'a test video',
    async_mode: true,
  });

  assert.deepEqual(result, {
    content: [
      {
        type: 'text',
        text: 'Success. Video generation task submitted: Task ID: task-123. Please use `query_video_generation` tool to check the status of the task and get the result.',
      },
    ],
  });
  assert.equal(api.postCalls.length, 1);
  assert.equal(api.getCalls.length, 0);
});
