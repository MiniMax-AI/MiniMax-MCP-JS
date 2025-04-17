#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { Config, ServerOptions, TransportMode } from './types/index.js';
import { MiniMaxAPI } from './utils/api.js';
import { TTSAPI } from './api/tts.js';
import { ImageAPI } from './api/image.js';
import { VideoAPI } from './api/video.js';
import { VoiceCloneAPI } from './api/voice-clone.js';
import { VoiceAPI } from './api/voice.js';
import { playAudio } from './utils/audio.js';
import { getParamValue } from '@chatmcp/sdk/utils/index.js';
import fs from 'fs';
import {
  DEFAULT_API_HOST,
  DEFAULT_BITRATE,
  DEFAULT_CHANNEL,
  DEFAULT_EMOTION,
  DEFAULT_FORMAT,
  DEFAULT_LANGUAGE_BOOST,
  DEFAULT_PITCH,
  DEFAULT_SAMPLE_RATE,
  DEFAULT_SPEECH_MODEL,
  DEFAULT_SPEED,
  DEFAULT_T2I_MODEL,
  DEFAULT_T2V_MODEL,
  DEFAULT_VOICE_ID,
  DEFAULT_VOLUME,
  ENV_CONFIG_PATH,
  ENV_MINIMAX_API_HOST,
  ENV_MINIMAX_API_KEY,
  ENV_MINIMAX_MCP_BASE_PATH,
  ENV_RESOURCE_MODE,
  ERROR_API_HOST_REQUIRED,
  ERROR_API_KEY_REQUIRED,
  RESOURCE_MODE_URL,
} from './const/index.js';
import { ConfigManager } from './config/ConfigManager.js';

/**
 * MCP Server class for managing MiniMax MCP server configuration and functionality
 * Specifically designed for STDIO transport mode
 */
export class MCPServer {
  private server: McpServer;
  private config!: Config;
  private api: MiniMaxAPI;
  private ttsApi: TTSAPI;
  private imageApi: ImageAPI;
  private videoApi: VideoAPI;
  private voiceCloneApi: VoiceCloneAPI;
  private voiceApi: VoiceAPI;

  /**
   * Create an MCP server instance (STDIO mode)
   * @param customConfig Optional custom configuration
   */
  constructor(customConfig?: Partial<Config>) {
    // Initialize configuration
    this.initializeConfig(customConfig);

    // Create API instances
    this.api = new MiniMaxAPI(this.config);
    this.ttsApi = new TTSAPI(this.api);
    this.imageApi = new ImageAPI(this.api);
    this.videoApi = new VideoAPI(this.api);
    this.voiceCloneApi = new VoiceCloneAPI(this.api);
    this.voiceApi = new VoiceAPI(this.api);

    // Create server instance
    this.server = new McpServer({
      name: 'minimax-mcp-js',
      version: '1.0.0',
    });

    // Register all tools
    this.registerTools();
  }

  /**
   * Initialize configuration
   * @param customConfig Custom configuration
   */
  private initializeConfig(customConfig?: Partial<Config>): void {
    // Use ConfigManager to get configuration, automatically handling priorities
    this.config = ConfigManager.getConfig(customConfig);

    // Remove unnecessary server configuration for STDIO mode
    // STDIO mode doesn't need port and endpoint configuration
    delete this.config.server;

    // console.log(`[${new Date().toISOString()}] STDIO server configuration initialized`);
  }

  /**
   * Register all MCP tools
   */
  private registerTools(): void {
    this.registerTextToAudioTool();
    this.registerListVoicesTool();
    this.registerPlayAudioTool();
    this.registerTextToImageTool();
    this.registerGenerateVideoTool();
    this.registerVoiceCloneTool();
    this.registerImageToVideoTool();
  }

  /**
   * Register text-to-speech tool
   */
  private registerTextToAudioTool(): void {
    this.server.tool(
      'text_to_audio',
      'Convert text to audio with a given voice and save the output audio file to a given directory. If no directory is provided, the file will be saved to desktop. If no voice ID is provided, the default voice will be used.\n\nNote: This tool calls MiniMax API and may incur costs. Use only when explicitly requested by the user.',
      {
        text: z.string().describe('Text to convert to audio'),
        outputDirectory: z.string().optional().describe('Directory to save the output file'),
        voiceId: z.string().optional().default(DEFAULT_VOICE_ID).describe('Voice ID to use, e.g. "female-shaonv"'),
        model: z.string().optional().default(DEFAULT_SPEECH_MODEL).describe('Model to use'),
        speed: z.number().min(0.5).max(2.0).optional().default(DEFAULT_SPEED).describe('Speech speed'),
        vol: z.number().min(0.1).max(10.0).optional().default(DEFAULT_VOLUME).describe('Speech volume'),
        pitch: z.number().min(-12).max(12).optional().default(DEFAULT_PITCH).describe('Speech pitch'),
        emotion: z
          .string()
          .optional()
          .default(DEFAULT_EMOTION)
          .describe('Speech emotion, values: ["happy", "sad", "angry", "fearful", "disgusted", "surprised", "neutral"]'),
        format: z
          .string()
          .optional()
          .default(DEFAULT_FORMAT)
          .describe('Audio format, values: ["pcm", "mp3","flac", "wav"]'),
        sampleRate: z
          .number()
          .optional()
          .default(DEFAULT_SAMPLE_RATE)
          .describe('Sample rate (Hz), values: [8000, 16000, 22050, 24000, 32000, 44100]'),
        bitrate: z
          .number()
          .optional()
          .default(DEFAULT_BITRATE)
          .describe('Bitrate (bps), values: [64000, 96000, 128000, 160000, 192000, 224000, 256000, 320000]'),
        channel: z.number().optional().default(DEFAULT_CHANNEL).describe('Audio channels, values: [1, 2]'),
        languageBoost: z.string().optional().default(DEFAULT_LANGUAGE_BOOST).describe('Language boost'),
        outputFile: z
          .string()
          .optional()
          .describe('Path to save the generated audio file, automatically generated if not provided'),
      },
      async (args, extra) => {
        try {
          // Build TTS request parameters
          const ttsParams = {
            text: args.text,
            outputDirectory: args.outputDirectory,
            voiceId: args.voiceId || DEFAULT_VOICE_ID,
            model: args.model || DEFAULT_SPEECH_MODEL,
            speed: args.speed || DEFAULT_SPEED,
            vol: args.vol || DEFAULT_VOLUME,
            pitch: args.pitch || DEFAULT_PITCH,
            emotion: args.emotion || DEFAULT_EMOTION,
            format: args.format || DEFAULT_FORMAT,
            sampleRate: args.sampleRate || DEFAULT_SAMPLE_RATE,
            bitrate: args.bitrate || DEFAULT_BITRATE,
            channel: args.channel || DEFAULT_CHANNEL,
            languageBoost: args.languageBoost || DEFAULT_LANGUAGE_BOOST,
            outputFile: args.outputFile,
          };

          // Use global configuration
          const requestApiKey = this.config.apiKey;

          if (!requestApiKey) {
            throw new Error(ERROR_API_KEY_REQUIRED);
          }

          // Update configuration with request-specific parameters
          const requestConfig: Partial<Config> = {
            apiKey: requestApiKey,
            apiHost: this.config.apiHost,
            resourceMode: this.config.resourceMode,
          };

          // Update API instance
          const requestApi = new MiniMaxAPI(requestConfig as Config);
          const requestTtsApi = new TTSAPI(requestApi);

          // Automatically set resource mode (if not specified)
          const outputFormat = requestConfig.resourceMode;
          const ttsRequest = {
            ...ttsParams,
            outputFormat,
          };

          // If no output filename is provided, generate one automatically
          if (!ttsRequest.outputFile) {
            const textPrefix = ttsRequest.text.substring(0, 20).replace(/[^\w]/g, '_');
            ttsRequest.outputFile = `tts_${textPrefix}_${Date.now()}`;
          }

          const result = await requestTtsApi.generateSpeech(ttsRequest);

          // Return different messages based on output format
          if (outputFormat === RESOURCE_MODE_URL) {
            return {
              content: [
                {
                  type: 'text',
                  text: `Success. Audio URL: ${result}`,
                },
              ],
            };
          } else {
            return {
              content: [
                {
                  type: 'text',
                  text: `Audio file saved: ${result}. Voice used: ${ttsParams.voiceId}`,
                },
              ],
            };
          }
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to generate audio: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      },
    );
  }

  /**
   * Register list voices tool
   */
  private registerListVoicesTool(): void {
    this.server.tool(
      'list_voices',
      'List all available voices. Only supported when api_host is https://api.minimax.chat.',
      {
        voiceType: z
          .string()
          .optional()
          .default('all')
          .describe('Type of voices to list, values: ["all", "system", "voice_cloning"]'),
      },
      async (params) => {
        try {
          // No need to update configuration from request parameters in stdio mode
          const result = await this.voiceApi.listVoices(params);

          return {
            content: [
              {
                type: 'text',
                text: `Success. System voices: ${result.systemVoices.join(', ')}, Cloned voices: ${result.voiceCloneVoices.join(', ')}`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to list voices: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      },
    );
  }

  /**
   * Register play audio tool
   */
  private registerPlayAudioTool(): void {
    this.server.tool(
      'play_audio',
      'Play an audio file. Supports WAV and MP3 formats. Does not support video.',
      {
        inputFilePath: z.string().describe('Path to the audio file to play'),
        isUrl: z.boolean().optional().default(false).describe('Whether the audio file is a URL'),
      },
      async (params) => {
        try {
          // No need to update configuration from request parameters in stdio mode
          const result = await playAudio(params);

          return {
            content: [
              {
                type: 'text',
                text: result,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to play audio: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      },
    );
  }

  /**
   * Register text-to-image tool
   */
  private registerTextToImageTool(): void {
    this.server.tool(
      'text_to_image',
      'Generate images based on text prompts.\n\nNote: This tool calls MiniMax API and may incur costs. Use only when explicitly requested by the user.',
      {
        model: z.string().optional().default(DEFAULT_T2I_MODEL).describe('Model to use'),
        prompt: z.string().describe('Text prompt for image generation'),
        aspectRatio: z
          .string()
          .optional()
          .default('1:1')
          .describe('Image aspect ratio, values: ["1:1", "16:9","4:3", "3:2", "2:3", "3:4", "9:16", "21:9"]'),
        n: z.number().min(1).max(9).optional().default(1).describe('Number of images to generate'),
        promptOptimizer: z.boolean().optional().default(true).describe('Whether to optimize the prompt'),
        outputDirectory: z.string().optional().describe('Directory to save the output file'),
        outputFile: z
          .string()
          .optional()
          .describe('Path to save the generated image file, automatically generated if not provided'),
      },
      async (params) => {
        try {
          // No need to update configuration from request parameters in stdio mode

          // If no output filename is provided, generate one automatically
          if (!params.outputFile) {
            const promptPrefix = params.prompt.substring(0, 20).replace(/[^\w]/g, '_');
            params.outputFile = `image_${promptPrefix}_${Date.now()}`;
          }

          const outputFiles = await this.imageApi.generateImage(params);

          // Handle different output formats
          if (this.config.resourceMode === RESOURCE_MODE_URL) {
            return {
              content: [
                {
                  type: 'text',
                  text: `Success. Image URL(s): ${outputFiles.join(', ')}`,
                },
              ],
            };
          } else {
            return {
              content: [
                {
                  type: 'text',
                  text: `Image(s) saved: ${outputFiles.join(', ')}`,
                },
              ],
            };
          }
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to generate image: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      },
    );
  }

  /**
   * Register generate video tool
   */
  private registerGenerateVideoTool(): void {
    this.server.tool(
      'generate_video',
      'Generate a video based on text prompts.\n\nNote: This tool calls MiniMax API and may incur costs. Use only when explicitly requested by the user.',
      {
        model: z
          .string()
          .optional()
          .default(DEFAULT_T2V_MODEL)
          .describe('Model to use, values: ["T2V-01", "T2V-01-Director", "I2V-01", "I2V-01-Director", "I2V-01-live"]'),
        prompt: z.string().describe('Text prompt for video generation'),
        firstFrameImage: z.string().optional().describe('First frame image'),
        outputDirectory: z.string().optional().describe('Directory to save the output file'),
        outputFile: z
          .string()
          .optional()
          .describe('Path to save the generated video file, automatically generated if not provided'),
      },
      async (params) => {
        try {
          // No need to update configuration from request parameters in stdio mode

          // If no output filename is provided, generate one automatically
          if (!params.outputFile) {
            const promptPrefix = params.prompt.substring(0, 20).replace(/[^\w]/g, '_');
            params.outputFile = `video_${promptPrefix}_${Date.now()}`;
          }

          const result = await this.videoApi.generateVideo(params);

          // Handle different output formats
          if (this.config.resourceMode === RESOURCE_MODE_URL) {
            return {
              content: [
                {
                  type: 'text',
                  text: `Success. Video URL: ${result}`,
                },
              ],
            };
          } else {
            return {
              content: [
                {
                  type: 'text',
                  text: `Video saved: ${result}`,
                },
              ],
            };
          }
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to generate video: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      },
    );
  }

  /**
   * Register voice clone tool
   */
  private registerVoiceCloneTool(): void {
    this.server.tool(
      'voice_clone',
      'Clone a voice using the provided audio file. New voices will incur costs when first used.\n\nNote: This tool calls MiniMax API and may incur costs. Use only when explicitly requested by the user.',
      {
        voiceId: z.string().describe('Voice ID to use'),
        audioFile: z.string().describe('Path to the audio file'),
        text: z.string().optional().describe('Text for the demo audio'),
        outputDirectory: z.string().optional().describe('Directory to save the output file'),
        isUrl: z.boolean().optional().default(false).describe('Whether the audio file is a URL'),
      },
      async (params) => {
        try {
          // No need to update configuration from request parameters in stdio mode
          const result = await this.voiceCloneApi.cloneVoice(params);

          return {
            content: [
              {
                type: 'text',
                text: `Voice cloning successful: ${result}`,
              },
            ],
          };
        } catch (error) {
          // 检查是否是实名认证错误
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (errorMessage.includes('voice clone user forbidden') ||
              errorMessage.includes('should complete real-name verification')) {

            // 国内平台认证URL
            const verificationUrl = 'https://platform.minimaxi.com/user-center/basic-information';

            return {
              content: [
                {
                  type: 'text',
                  text: `Voice cloning failed: Real-name verification required. To use voice cloning feature, please:\n\n1. Visit MiniMax platform (${verificationUrl})\n2. Complete the real-name verification process\n3. Try again after verification is complete\n\nThis requirement is for security and compliance purposes.`,
                },
              ],
            };
          }

          // 其他错误的常规处理
          return {
            content: [
              {
                type: 'text',
                text: `Voice cloning failed: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      },
    );
  }

  /**
   * Register image-to-video tool
   */
  private registerImageToVideoTool(): void {
    this.server.tool(
      'image_to_video',
      'Generate a video based on an image.\n\nNote: This tool calls MiniMax API and may incur costs. Use only when explicitly requested by the user.',
      {
        model: z
          .string()
          .optional()
          .default('I2V-01')
          .describe('Model to use, values: ["I2V-01", "I2V-01-Director", "I2V-01-live"]'),
        prompt: z.string().describe('Text prompt for video generation'),
        firstFrameImage: z.string().describe('Path to the first frame image'),
        outputDirectory: z.string().optional().describe('Directory to save the output file'),
        outputFile: z
          .string()
          .optional()
          .describe('Path to save the generated video file, automatically generated if not provided'),
      },
      async (params) => {
        try {
          // If no output filename is provided, generate one automatically
          if (!params.outputFile) {
            const promptPrefix = params.prompt.substring(0, 20).replace(/[^\w]/g, '_');
            params.outputFile = `i2v_${promptPrefix}_${Date.now()}`;
          }

          const result = await this.videoApi.generateVideo(params);

          // Handle different output formats
          if (this.config.resourceMode === RESOURCE_MODE_URL) {
            return {
              content: [
                {
                  type: 'text',
                  text: `Success. Video URL: ${result}`,
                },
              ],
            };
          } else {
            return {
              content: [
                {
                  type: 'text',
                  text: `Video saved: ${result}`,
                },
              ],
            };
          }
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to generate video: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      }
    );
  }

  /**
   * Update configuration and recreate API instances
   * @param newConfig New configuration object
   */
  public updateConfig(newConfig: Partial<Config>): void {
    // Merge server configuration
    if (newConfig.server && this.config.server) {
      // New configuration has higher priority and should override existing configuration
      this.config.server = {
        ...this.config.server, // Lower priority configuration loaded first
        ...newConfig.server // Higher priority configuration loaded last
      };
      delete newConfig.server;
    } else if (newConfig.server) {
      this.config.server = newConfig.server;
      delete newConfig.server;
    }

    // Merge other configurations, new configuration has higher priority
    this.config = {
      ...this.config, // Lower priority configuration loaded first
      ...newConfig // Higher priority configuration loaded last
    };

    // Update API instances
    this.api = new MiniMaxAPI(this.config);
    this.ttsApi = new TTSAPI(this.api);
    this.imageApi = new ImageAPI(this.api);
    this.videoApi = new VideoAPI(this.api);
    this.voiceCloneApi = new VoiceCloneAPI(this.api);
    this.voiceApi = new VoiceAPI(this.api);
  }

  /**
   * Read configuration from file
   * @returns Partial configuration object or undefined
   */
  private getConfigFromFile(): Partial<Config> | undefined {
    try {
      // Prioritize configuration file path parameter
      const configPath = getParamValue("config_path") || process.env[ENV_CONFIG_PATH] || './minimax-config.json';

      // Check if file exists
      if (!fs.existsSync(configPath)) {
        return undefined;
      }

      // Read and parse configuration file
      const fileContent = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(fileContent) as Partial<Config>;
    } catch (error) {
      // console.warn(`Failed to read config file: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  /**
   * Start the server
   * @returns Promise to start the server
   */
  public async start(): Promise<void> {
    try {
      // Validate necessary configuration
      if (!this.config.apiKey) {
        throw new Error(ERROR_API_KEY_REQUIRED);
      }

      if (!this.config.apiHost) {
        throw new Error(ERROR_API_HOST_REQUIRED);
      }

      // Start STDIO server
      return this.startStdioServer();
    } catch (error) {
      // console.error(`Failed to start server: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Start standard input/output server
   */
  public async startStdioServer(): Promise<void> {
    // console.log('Starting stdio server');
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    // console.log('MiniMax MCP Server running on stdio');
  }

  /**
   * Get server instance
   * @returns McpServer instance
   */
  public getServer(): McpServer {
    return this.server;
  }

  /**
   * Get current configuration
   * @returns Current configuration
   */
  public getConfig(): Config {
    return this.config;
  }
}

// Export types and API instances for use in other projects
export {
  Config,
  TTSRequest,
  ImageGenerationRequest,
  VideoGenerationRequest,
  VoiceCloneRequest,
  ListVoicesRequest,
  PlayAudioRequest,
  ServerOptions,
  TransportMode,
} from './types/index.js';
export { MiniMaxAPI } from './utils/api.js';
export { TTSAPI } from './api/tts.js';
export { ImageAPI } from './api/image.js';
export { VideoAPI } from './api/video.js';
export { VoiceCloneAPI } from './api/voice-clone.js';
export { VoiceAPI } from './api/voice.js';
export * from './exceptions/index.js';
export * from './const/index.js';
