import { BaseService } from './index.js';
import { MiniMaxAPI } from '../utils/api.js';
import { TTSAPI } from '../api/tts.js';
import { ImageAPI } from '../api/image.js';
import { VideoAPI } from '../api/video.js';
import { VoiceCloneAPI } from '../api/voice-clone.js';
import { VoiceAPI } from '../api/voice.js';
import { VoiceDesignAPI } from '../api/voice-design.js';
import { Config } from '../types/index.js';
import { RESOURCE_MODE_URL } from '../const/index.js';

/**
 * Media service, handles all media-related operations
 */
export class MediaService extends BaseService {
  private ttsApi: TTSAPI;
  private imageApi: ImageAPI;
  private videoApi: VideoAPI;
  private voiceCloneApi: VoiceCloneAPI;
  private voiceApi: VoiceAPI;
  private voiceDesignApi: VoiceDesignAPI;

  /**
   * Create media service instance
   * @param api API instance
   */
  constructor(api: MiniMaxAPI) {
    super(api, 'media-service');
    this.ttsApi = new TTSAPI(api);
    this.imageApi = new ImageAPI(api);
    this.videoApi = new VideoAPI(api);
    this.voiceCloneApi = new VoiceCloneAPI(api);
    this.voiceApi = new VoiceAPI(api);
    this.voiceDesignApi = new VoiceDesignAPI(api);
    this.config = {} as Config; // Initialize as empty object, will be set in initialize
  }

  /**
   * Initialize service
   * @param config Configuration
   */
  public async initialize(config: Config): Promise<void> {
    await super.initialize(config);
    // Any media service specific initialization logic
  }

  /**
   * Update API instance
   * @param api New API instance
   */
  public updateApi(api: MiniMaxAPI): void {
    super.updateApi(api);
    this.ttsApi = new TTSAPI(api);
    this.imageApi = new ImageAPI(api);
    this.videoApi = new VideoAPI(api);
    this.voiceCloneApi = new VoiceCloneAPI(api);
    this.voiceApi = new VoiceAPI(api);
    this.voiceDesignApi = new VoiceDesignAPI(api);
  }

  /**
   * Generate speech
   * @param params Speech generation parameters
   * @returns Generation result (URL or file path)
   */
  public async generateSpeech(params: any): Promise<string> {
    this.checkInitialized();
    try {
      return await this.ttsApi.generateSpeech(params);
    } catch (error) {
      // console.error(`[${new Date().toISOString()}] Failed to generate speech:`, error);
      throw this.wrapError('Failed to generate speech', error);
    }
  }

  /**
   * List available voices
   * @param params Voice listing parameters
   * @returns Voice list results
   */
  public async listVoices(params: any): Promise<{systemVoices: string[], voiceCloneVoices: string[]}> {
    this.checkInitialized();
    try {
      return await this.voiceApi.listVoices(params);
    } catch (error) {
      // console.error(`[${new Date().toISOString()}] Failed to get voice list:`, error);
      throw this.wrapError('Failed to get voice list', error);
    }
  }

  /**
   * Clone voice
   * @param params Voice cloning parameters
   * @returns Cloning result
   */
  public async cloneVoice(params: any): Promise<string> {
    this.checkInitialized();
    try {
      return await this.voiceCloneApi.cloneVoice(params);
    } catch (error) {
      // console.error(`[${new Date().toISOString()}] Failed to clone voice:`, error);
      throw this.wrapError('Failed to clone voice', error);
    }
  }

  /**
   * Generate image
   * @param params Image generation parameters
   * @returns Generation results (URL array or file path array)
   */
  public async generateImage(params: any): Promise<string[]> {
    this.checkInitialized();
    try {
      // Auto-generate output filename if not provided
      if (!params.outputFile) {
        const promptPrefix = params.prompt.substring(0, 20).replace(/[^\w]/g, '_');
        params.outputFile = `image_${promptPrefix}_${Date.now()}`;
      }

      const outputFiles = await this.imageApi.generateImage(params);
      return outputFiles;
    } catch (error) {
      // console.error(`[${new Date().toISOString()}] Failed to generate image:`, error);
      throw this.wrapError('Failed to generate image', error);
    }
  }

  /**
   * Generate video
   * @param params Video generation parameters
   * @returns Generation result (URL or file path)
   */
  public async generateVideo(params: any): Promise<any> {
    this.checkInitialized();
    try {
      // Auto-generate output filename if not provided
      if (!params.outputFile) {
        const promptPrefix = params.prompt.substring(0, 20).replace(/[^\w]/g, '_');
        params.outputFile = `video_${promptPrefix}_${Date.now()}`;
      }

      const result = await this.videoApi.generateVideo(params);
      if (params.async_mode) {
        return {
          content: [
            {
              type: 'text',
              text: `Success. Video generation task submitted: Task ID: ${result.task_id}. Please use \`query_video_generation\` tool to check the status of the task and get the result.`,
            },
          ],
        };
      } else if (this.config.resourceMode === RESOURCE_MODE_URL) {
        return {
          content: [
            {
              type: 'text',
              text: `Success. Video URL: ${result.video_url}`,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: `Success. Video saved as: ${result.video_path}`,
            },
          ],
        };
      }
    } catch (error) {
      // console.error(`[${new Date().toISOString()}] Failed to generate video:`, error);
      throw this.wrapError('Failed to generate video', error);
    }
  }

  /**
   * Query video generation
   * @param params Video generation query parameters
   * @returns Query result
   */
  public async queryVideoGeneration(params: any): Promise<any> {
    this.checkInitialized();
    try {
      const result = await this.videoApi.queryVideoGeneration(params);
      if (result.status === 'Success') {
        if (this.config.resourceMode === RESOURCE_MODE_URL) {
          return {
          content: [
              {
                type: 'text',
                text: `Success. Video URL: ${result.video_url}`,
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: 'text',
                text: `Success. Video saved as: ${result.video_path}`,
              },
            ],
          };
        }
      } else {
        return {
          content: [
            {
              type: 'text',
              text: `Video generation task is still processing: Task ID: ${params.taskId}.`,
            },
          ],
        };
      }
    } catch (error) {
      throw this.wrapError('Failed to query video generation status', error);
    }
  }

  /** 
   * Design voice
   * @param params Voice design parameters
   * @returns Design result (voice ID and file path)
   */
  public async designVoice(params: any): Promise<any> {
    this.checkInitialized();
    try {
      return await this.voiceDesignApi.voiceDesign(params);
    } catch (error) {
      throw this.wrapError('Failed to design voice', error);
    }
  } 

  /**
   * Wrap error message
   * @param message Error message prefix
   * @param error Original error
   * @returns Wrapped error
   */
  private wrapError(message: string, error: unknown): Error {
    if (error instanceof Error) {
      const wrappedError = new Error(`${message}: ${error.message}`);
      wrappedError.stack = error.stack;
      return wrappedError;
    }
    return new Error(`${message}: ${String(error)}`);
  }
}
