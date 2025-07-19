import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { Config, MusicGenerationRequest, VoiceDesignRequest } from './types/index.js';
import { ConfigManager } from './config/ConfigManager.js';
import {
  DEFAULT_SERVER_ENDPOINT,
  DEFAULT_SERVER_PORT,
  ERROR_API_KEY_REQUIRED,
  ERROR_API_HOST_REQUIRED,
  RESOURCE_MODE_URL,
  TRANSPORT_MODE_SSE,
  DEFAULT_VOICE_ID,
  DEFAULT_SPEECH_MODEL,
  DEFAULT_SPEED,
  DEFAULT_VOLUME,
  DEFAULT_PITCH,
  DEFAULT_EMOTION,
  DEFAULT_FORMAT,
  DEFAULT_SAMPLE_RATE,
  DEFAULT_BITRATE,
  DEFAULT_CHANNEL,
  DEFAULT_LANGUAGE_BOOST,
  DEFAULT_T2I_MODEL,
  DEFAULT_VIDEO_MODEL
} from './const/index.js';
import { MiniMaxAPI } from './utils/api.js';
import { TTSAPI } from './api/tts.js';
import { ImageAPI } from './api/image.js';
import { VideoAPI } from './api/video.js';
import { VoiceCloneAPI } from './api/voice-clone.js';
import { VoiceAPI } from './api/voice.js';
import { MusicAPI } from './api/music.js';
import { VoiceDesignAPI } from './api/voice-design.js';
import { playAudio } from './utils/audio.js';
import { z } from 'zod';
import 'dotenv/config';
import { COMMON_PARAMETERS_SCHEMA } from './schema/index.js';

// Heartbeat interval in milliseconds
const HEARTBEAT_INTERVAL = 30000;

// Retry configuration
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

/**
 * Connection information interface for managing SSE connections
 */
interface ConnectionInfo {
  transport: SSEServerTransport;
  heartbeatInterval: NodeJS.Timeout | null;
  lastActivityTime: number;
}

/**
 * MCP SSE Server class, handles SSE transport mode
 * Supports multiple client connections and health checks
 */
export class MCPSSEServer {
  private server: any;
  private mcpServer: McpServer;
  private connections: Map<string, ConnectionInfo> = new Map();
  private config!: Config;
  private api: MiniMaxAPI;
  private ttsApi: TTSAPI;
  private imageApi: ImageAPI;
  private videoApi: VideoAPI;
  private voiceCloneApi: VoiceCloneAPI;
  private voiceApi: VoiceAPI;
  private musicApi: MusicAPI;
  private voiceDesignApi: VoiceDesignAPI;
  private connectionMonitorInterval: NodeJS.Timeout | null = null;

  /**
   * Create an SSE server instance
   * @param customConfig Configuration object
   */
  constructor(customConfig?: Partial<Config>) {
    // Initialize configuration using ConfigManager
    this.initializeConfig(customConfig);

    // Create API instances
    this.api = new MiniMaxAPI(this.config);
    this.ttsApi = new TTSAPI(this.api);
    this.imageApi = new ImageAPI(this.api);
    this.videoApi = new VideoAPI(this.api);
    this.voiceCloneApi = new VoiceCloneAPI(this.api);
    this.voiceApi = new VoiceAPI(this.api);
    this.musicApi = new MusicAPI(this.api);
    this.voiceDesignApi = new VoiceDesignAPI(this.api);
    // Create MCP server instance
    this.mcpServer = new McpServer({
      name: 'minimax-mcp-js',
      version: '1.0.0',
    });

    // Register tools
    this.registerTools();
  }

  /**
   * Initialize configuration
   * @param customConfig Custom configuration
   */
  private initializeConfig(customConfig?: Partial<Config>): void {
    // Use ConfigManager to get configuration, automatically handling priorities
    this.config = ConfigManager.getConfig(customConfig);

    // Ensure SSE transport mode is used
    if (this.config.server) {
      this.config.server.mode = TRANSPORT_MODE_SSE;
    } else {
      this.config.server = {
        mode: TRANSPORT_MODE_SSE,
        port: DEFAULT_SERVER_PORT,
        endpoint: DEFAULT_SERVER_ENDPOINT
      };
    }

    // console.log(`[${new Date().toISOString()}] SSE server configuration initialized`);
  }

  /**
   * Update configuration and recreate API instances
   * @param newConfig New configuration object
   */
  public updateConfig(newConfig: Partial<Config>): void {
    // Use ConfigManager to merge configurations
    this.config = ConfigManager.getConfig(newConfig, this.config);

    // Ensure SSE transport mode is used
    if (this.config.server) {
      this.config.server.mode = TRANSPORT_MODE_SSE;
    }

    // Update API instances
    this.api = new MiniMaxAPI(this.config);
    this.ttsApi = new TTSAPI(this.api);
    this.imageApi = new ImageAPI(this.api);
    this.videoApi = new VideoAPI(this.api);
    this.voiceCloneApi = new VoiceCloneAPI(this.api);
    this.voiceApi = new VoiceAPI(this.api);
    this.musicApi = new MusicAPI(this.api);
    this.voiceDesignApi = new VoiceDesignAPI(this.api);

    // console.log(`[${new Date().toISOString()}] SSE server configuration updated`);
  }

  /**
   * Register all MCP tools
   */
  private registerTools(): void {
    this.registerTextToAudioTool();
    this.registerListVoicesTool();
    this.registerPlayAudioTool();
    this.registerVoiceCloneTool();
    this.registerTextToImageTool();
    this.registerGenerateVideoTool();
    this.registerImageToVideoTool();
    this.registerQueryVideoGenerationTool();
    this.registerMusicGenerationTool();
    this.registerVoiceDesignTool();
  }

  /**
   * Register text-to-speech tool
   */
  private registerTextToAudioTool(): void {
    this.mcpServer.tool(
      'text_to_audio',
      'Convert text to audio with a given voice and save the output audio file to a given directory. If no directory is provided, the file will be saved to desktop. If no voice ID is provided, the default voice will be used.\n\nNote: This tool calls MiniMax API and may incur costs. Use only when explicitly requested by the user.',
      {
        text: z.string().describe('Text to convert to audio'),
        outputDirectory: COMMON_PARAMETERS_SCHEMA.outputDirectory,
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
        languageBoost: z.string().optional().default(DEFAULT_LANGUAGE_BOOST).describe(`Enhance the ability to recognize specified languages and dialects. Supported values include: 'Chinese', 'Chinese,Yue', 'English', 'Arabic', 'Russian', 'Spanish', 'French', 'Portuguese', 'German', 'Turkish', 'Dutch', 'Ukrainian', 'Vietnamese', 'Indonesian', 'Japanese', 'Italian', 'Korean', 'Thai', 'Polish', 'Romanian', 'Greek', 'Czech', 'Finnish', 'Hindi', 'auto', default is 'auto'`),
        subtitleEnable: z.boolean().optional().default(false).describe('The parameter controls whether the subtitle service is enabled. If this parameter is not provided, the default value is false'),
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
            subtitleEnable: args.subtitleEnable || false,
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
                  text: `Success. Audio URL: ${result.audio}. ${ttsParams.subtitleEnable ? `Subtitle file saved: ${result.subtitle}` : ''}`,
                },
              ],
            };
          } else {
            return {
              content: [
                {
                  type: 'text',
                  text: `Audio file saved: ${result.audio}. ${ttsParams.subtitleEnable ? `Subtitle file saved: ${result.subtitle}. ` : ''}Voice used: ${ttsParams.voiceId}`,
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
    this.mcpServer.tool(
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
    this.mcpServer.tool(
      'play_audio',
      'Play an audio file. Supports WAV and MP3 formats. Does not support video.',
      {
        inputFilePath: z.string().describe('Path to the audio file to play'),
        isUrl: z.boolean().optional().default(false).describe('Whether the audio file is a URL'),
      },
      async (params) => {
        try {
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
   * Register voice clone tool
   */
  private registerVoiceCloneTool(): void {
    this.mcpServer.tool(
      'voice_clone',
      'Clone a voice using the provided audio file. New voices will incur costs when first used.\n\nNote: This tool calls MiniMax API and may incur costs. Use only when explicitly requested by the user.',
      {
        voiceId: z.string().describe('Voice ID to use'),
        audioFile: z.string().describe('Path to the audio file'),
        text: z.string().optional().describe('Text for the demo audio'),
        outputDirectory: COMMON_PARAMETERS_SCHEMA.outputDirectory,
        isUrl: z.boolean().optional().default(false).describe('Whether the audio file is a URL'),
      },
      async (params) => {
        try {
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
          // Check if this is a real-name verification error
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (errorMessage.includes('voice clone user forbidden') ||
              errorMessage.includes('should complete real-name verification')) {

            // Domestic platform verification URL
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

          // Regular error handling
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
   * Register text-to-image tool
   */
  private registerTextToImageTool(): void {
    this.mcpServer.tool(
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
        outputDirectory: COMMON_PARAMETERS_SCHEMA.outputDirectory,
        outputFile: z
          .string()
          .optional()
          .describe('Path to save the generated image file, automatically generated if not provided'),
      },
      async (params) => {
        try {
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
    this.mcpServer.tool(
      'generate_video',
      'Generate a video based on text prompts.\n\nNote: This tool calls MiniMax API and may incur costs. Use only when explicitly requested by the user.',
      {
        model: z
          .string()
          .optional()
          .default(DEFAULT_VIDEO_MODEL)
          .describe('Model to use, values: ["T2V-01", "T2V-01-Director", "I2V-01", "I2V-01-Director", "I2V-01-live", "MiniMax-Hailuo-02"]'),
        prompt: z.string().describe('Text prompt for video generation'),
        firstFrameImage: z.string().optional().describe('First frame image'),
        duration: z.number().optional().describe('The duration of the video. The model must be "MiniMax-Hailuo-02". Values can be 6 and 10.'),
        resolution: z.string().optional().describe('The resolution of the video. The model must be "MiniMax-Hailuo-02". Values range ["768P", "1080P"]'),
        outputDirectory: COMMON_PARAMETERS_SCHEMA.outputDirectory,
        outputFile: z
          .string()
          .optional()
          .describe('Path to save the generated video file, automatically generated if not provided'),
        asyncMode: z
          .boolean()
          .optional()
          .default(false)
          .describe('Whether to use async mode. Defaults to False. If True, the video generation task will be submitted asynchronously and the response will return a task_id. Should use `query_video_generation` tool to check the status of the task and get the result.'),
      },
      async (params) => {
        try {
          // If no output filename is provided, generate one automatically
          if (!params.outputFile) {
            const promptPrefix = params.prompt.substring(0, 20).replace(/[^\w]/g, '_');
            params.outputFile = `video_${promptPrefix}_${Date.now()}`;
          }

          const result = await this.videoApi.generateVideo(params);

          if (params.asyncMode) {
            return {
              content: [
                {
                  type: 'text',
                  text: `Success. Video generation task submitted: Task ID: ${result.task_id}. Please use \`query_video_generation\` tool to check the status of the task and get the result.`,
                },
              ],
            };
          }

          // Handle different output formats
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
                  text: `Video saved: ${result.video_path}`,
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
   * Register image-to-video tool
   */
  private registerImageToVideoTool(): void {
    this.mcpServer.tool(
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
        outputDirectory: COMMON_PARAMETERS_SCHEMA.outputDirectory,
        outputFile: z
          .string()
          .optional()
          .describe('Path to save the generated video file, automatically generated if not provided'),
        asyncMode: z
          .boolean()
          .optional()
          .default(false)
          .describe('Whether to use async mode. Defaults to False. If True, the video generation task will be submitted asynchronously and the response will return a task_id. Should use `query_video_generation` tool to check the status of the task and get the result.'),
      },
      async (params) => {
        try {
          // If no output filename is provided, generate one automatically
          if (!params.outputFile) {
            const promptPrefix = params.prompt.substring(0, 20).replace(/[^\w]/g, '_');
            params.outputFile = `i2v_${promptPrefix}_${Date.now()}`;
          }

          const result = await this.videoApi.generateVideo(params);

          if (params.asyncMode) {
            return {
              content: [
                {
                  type: 'text',
                  text: `Success. Video generation task submitted: Task ID: ${result.task_id}. Please use \`query_video_generation\` tool to check the status of the task and get the result.`,
                },
              ],
            };
          }

          // Handle different output formats
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
                  text: `Video saved: ${result.video_path}`,
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
   * Register query video generation tool
   */
  private registerQueryVideoGenerationTool(): void {
    this.mcpServer.tool(
      'query_video_generation',
      'Query the status of a video generation task.',
      {
        taskId: z
          .string()
          .describe('The Task ID to query. Should be the task_id returned by `generate_video` tool if `async_mode` is True.'),
        outputDirectory: COMMON_PARAMETERS_SCHEMA.outputDirectory,
      },
      async (params: any) => {
        try {
          // No need to update configuration from request parameters in stdio mode
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
          return {
            content: [
              {
                type: 'text',
                text: `Failed to query video generation: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      },
    );
  }


  /**
   * Register music generation tool 
   */
  private registerMusicGenerationTool(): void {
    this.mcpServer.tool(
      'music_generation',
      'Create a music generation task using AI models. Generate music from prompt and lyrics.\n\nNote: This tool calls MiniMax API and may incur costs. Use only when explicitly requested by the user.',
      {
        prompt: z
          .string()
          .describe('Music creation inspiration describing style, mood, scene, etc.\nExample: "Pop music, sad, suitable for rainy nights". Character range: [10, 300]'),
        lyrics: z
          .string()
          .describe('Song lyrics for music generation.\nUse newline (\\n) to separate each line of lyrics. Supports lyric structure tags [Intro][Verse][Chorus][Bridge][Outro]\nto enhance musicality. Character range: [10, 600] (each Chinese character, punctuation, and letter counts as 1 character)'),
        sampleRate: z
          .number()
          .optional()
          .default(DEFAULT_SAMPLE_RATE)
          .describe('Sample rate of generated music. Values: [16000, 24000, 32000, 44100]'),
        bitrate: z
          .number()
          .optional()
          .default(DEFAULT_BITRATE)
          .describe('Bitrate of generated music. Values: [32000, 64000, 128000, 256000]'),
        format: z
          .string()
          .optional()
          .default(DEFAULT_FORMAT)
          .describe('Format of generated music. Values: ["mp3", "wav", "pcm"]'),
        outputDirectory: COMMON_PARAMETERS_SCHEMA.outputDirectory,
      },
      async (params: MusicGenerationRequest) => {
        try {
          // Automatically set resource mode (if not specified)
          const outputFormat = this.config.resourceMode;
          const musicRequest = {
            ...params,
            outputFormat,
          };

          // No need to update configuration from request parameters in stdio mode
          const outputFile = await this.musicApi.generateMusic(musicRequest);

          // Handle different output formats
          if (this.config.resourceMode === RESOURCE_MODE_URL) {
            return {
              content: [
                {
                  type: 'text',
                  text: `Success. Music URL(s): ${outputFile}`,
                },
              ],
            };
          } else {
            return {
              content: [
                {
                  type: 'text',
                  text: `Success. Music saved as: ${outputFile}`,
                },
              ],
            };
          }
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to generate music: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      },
    );  
  }

  /** 
   * Register voice design tool
   */
  private registerVoiceDesignTool(): void {
    this.mcpServer.tool(
      'voice_design',
      'Generate a voice based on description prompts.\n\nNote: This tool calls MiniMax API and may incur costs. Use only when explicitly requested by the user.',
      {
        prompt: z
          .string()
          .describe('The prompt to generate the voice from'),
        previewText: z
          .string()
          .describe('The text to preview the voice'),
        voiceId: z
          .string()
          .optional()
          .describe('The id of the voice to use. For example, "male-qn-qingse"/"audiobook_female_1"/"cute_boy"/"Charming_Lady"...'),
        outputDirectory: COMMON_PARAMETERS_SCHEMA.outputDirectory,
      },
      async (params: VoiceDesignRequest) => {
        try {
          // No need to update configuration from request parameters in stdio mode
          const { voiceId, outputFile } = await this.voiceDesignApi.voiceDesign(params);

          // Handle different output formats
          if (this.config.resourceMode === RESOURCE_MODE_URL) {
            return {
              content: [
                {
                  type: 'text',
                  text: `Success. Voice ID: ${voiceId}. Voice URL: ${outputFile}`,
                },
              ],
            };
          } else {
            return {
              content: [
                {
                  type: 'text',
                  text: `Success. Voice ID: ${voiceId}. Voice saved as: ${outputFile}`,
                },
              ],
            };
          }
        } catch (error) {
          return {  
            content: [
              {
                type: 'text',
                text: `Failed to design voice: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      },
    );
  }

  /**
   * Start SSE server
   * @returns Promise<void>
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

      const port = this.config.server?.port || DEFAULT_SERVER_PORT;
      const endpoint = this.config.server?.endpoint || DEFAULT_SERVER_ENDPOINT;

      // Create Express application
      const app = express();

      // Configure CORS - more flexible configuration
      app.use(cors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization']
      }));
      app.use(express.json());

      // Configure SSE route
      app.get('/sse', async (req, res) => {
        try {
          // Create SSE transport instance
          const transport = new SSEServerTransport(endpoint, res);
          const sessionId = transport.sessionId || `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        // console.log(`[${new Date().toISOString()}] New SSE connection established: ${sessionId}`);

          // Set response headers to prevent connection timeout
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');

          // Start heartbeat mechanism
          const heartbeatInterval = setInterval(() => {
            try {
              res.write(`event: heartbeat\ndata: ${Date.now()}\n\n`);
              // console.log(`[${new Date().toISOString()}] Heartbeat sent: ${sessionId}`);
            } catch (error) {
              // console.error(`[${new Date().toISOString()}] Failed to send heartbeat: ${sessionId}`, error);
              this.closeConnection(sessionId);
            }
          }, HEARTBEAT_INTERVAL);

          // Save connection information
          this.connections.set(sessionId, {
            transport,
            heartbeatInterval,
            lastActivityTime: Date.now()
          });

          // Handle connection close
          req.on('close', () => {
          // console.log(`[${new Date().toISOString()}] SSE connection closed: ${sessionId}`);
              this.closeConnection(sessionId);
          });

          // Connect to MCP server
          await this.mcpServer.connect(transport);
        // console.log(`[${new Date().toISOString()}] MCP server connection successful: ${sessionId}`);

          // Send initial connection confirmation event
          res.write(`event: connected\ndata: {"sessionId":"${sessionId}","timestamp":${Date.now()}}\n\n`);

        } catch (error) {
          // console.error(`[${new Date().toISOString()}] Failed to establish SSE connection:`, error);
          res.status(500).end();
        }
      });

      // Configure message handling route
      app.post(endpoint, async (req, res) => {
        try {
          // console.log(`[${new Date().toISOString()}] Received client message:`, req.query);
          const sessionId = req.query.sessionId as string;

          if (sessionId && this.connections.has(sessionId)) {
            // If sessionId is provided and exists, use the specified connection
            const connectionInfo = this.connections.get(sessionId);
            if (connectionInfo) {
              // Update last activity time
              connectionInfo.lastActivityTime = Date.now();

              // Handle message
              await this.handleClientMessage(connectionInfo.transport, req, res);
              return;
            }
          }

          // If no sessionId is specified or connection not found, but there are active connections
          if (this.connections.size > 0) {
            // Use the first available connection (simple implementation)
            const [firstSessionId, connectionInfo] = [...this.connections.entries()][0];
            // console.log(`[${new Date().toISOString()}] No session ID specified, using first available connection: ${firstSessionId}`);

            // Update last activity time
            connectionInfo.lastActivityTime = Date.now();

            // Handle message
            await this.handleClientMessage(connectionInfo.transport, req, res);
          } else {
            throw new Error('No active SSE connections');
          }
        } catch (error) {
          // console.error(`[${new Date().toISOString()}] Failed to handle client message:`, error);
          res.status(500).json({
            error: 'Failed to process message',
            message: error instanceof Error ? error.message : String(error),
            timestamp: Date.now()
          });
        }
      });

      // Error handling middleware
      app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        // console.error(`[${new Date().toISOString()}] Unhandled exception:`, err);
        res.status(500).json({
          error: 'Internal server error',
          message: err.message,
          timestamp: Date.now()
        });
      });

      // Start Express server
      return new Promise((resolve) => {
        this.server = app.listen(port, () => {
          // console.log(`[${new Date().toISOString()}] MiniMax MCP SSE server started at: http://localhost:${port}`);
          // console.log(`- SSE connection endpoint: http://localhost:${port}/sse`);
          // console.log(`- Message handling endpoint: http://localhost:${port}${endpoint}`);

          // Set up process signal handlers
          this.setupSignalHandlers();

          // Start connection monitoring
          this.startConnectionMonitoring();

          resolve();
        });
      });
    } catch (error) {
      // console.error(`[${new Date().toISOString()}] Failed to start SSE server:`, error);
      throw error;
    }
  }

  /**
   * Handle client messages with retry mechanism
   */
  private async handleClientMessage(transport: SSEServerTransport, req: Request, res: Response, attempt = 1): Promise<void> {
    try {
      await transport.handlePostMessage(req, res, req.body);
    } catch (error) {
      if (attempt < MAX_RETRY_ATTEMPTS) {
        // console.warn(`[${new Date().toISOString()}] Failed to handle message, attempting retry (${attempt}/${MAX_RETRY_ATTEMPTS}):`, error);
        // Exponential backoff retry
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt - 1)));
        return this.handleClientMessage(transport, req, res, attempt + 1);
      }
      // console.error(`[${new Date().toISOString()}] Failed to handle message after ${MAX_RETRY_ATTEMPTS} attempts:`, error);
      throw error;
    }
  }

  /**
   * Start connection monitoring, periodically check and clean up inactive connections
   */
  private startConnectionMonitoring(): void {
    // Check connection status every minute
    this.connectionMonitorInterval = setInterval(() => {
      const now = Date.now();
      const inactiveThreshold = 5 * 60 * 1000; // 5 minutes of inactivity is considered timeout

      // console.log(`[${new Date().toISOString()}] Performing connection monitoring: ${this.connections.size} active connections`);

      for (const [sessionId, connectionInfo] of this.connections.entries()) {
        const inactiveDuration = now - connectionInfo.lastActivityTime;

        if (inactiveDuration > inactiveThreshold) {
          // console.warn(`[${new Date().toISOString()}] Detected inactive connection ${sessionId}, timed out after ${Math.round(inactiveDuration / 1000)} seconds, closing...`);
          this.closeConnection(sessionId);
        }
      }
    }, 60000); // Check every minute
  }

  /**
   * Close a single connection
   * @param sessionId Session ID
   */
  private closeConnection(sessionId: string): void {
    const connectionInfo = this.connections.get(sessionId);
    if (!connectionInfo) return;

    try {
      // Clear heartbeat timer
      if (connectionInfo.heartbeatInterval) {
        clearInterval(connectionInfo.heartbeatInterval);
      }

      // Try to send close event
      try {
        const res = connectionInfo.transport['res']; // Access private property
        if (res && typeof res.write === 'function') {
          res.write(`event: server_shutdown\ndata: {"reason":"Connection closed","timestamp":${Date.now()}}\n\n`);
          res.end();
        }
      } catch (error) {
        // console.error(`[${new Date().toISOString()}] Failed to send close event: ${sessionId}`, error);
      }

      // console.log(`[${new Date().toISOString()}] Connection closed: ${sessionId}`);
    } catch (error) {
      // console.error(`[${new Date().toISOString()}] Error closing connection: ${sessionId}`, error);
    } finally {
      // Always remove the connection from the Map
      this.connections.delete(sessionId);
    }
  }

  /**
   * Set up process signal handlers
   */
  private setupSignalHandlers(): void {
    process.on('SIGTERM', async () => {
      // console.log(`[${new Date().toISOString()}] 接收到SIGTERM信号，准备关闭`);
      await this.closeAllConnections();
      this.stopConnectionMonitoring();
      this.server.close(() => {
        // console.log(`[${new Date().toISOString()}] 服务器已关闭`);
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      // console.log(`[${new Date().toISOString()}] 接收到SIGINT信号，准备关闭`);
      await this.closeAllConnections();
      this.stopConnectionMonitoring();
      if (this.server) {
        this.server.close();
      }
      process.exit(0);
    });
  }
  /**
   * Stop connection monitoring
   */
  private stopConnectionMonitoring(): void {
    if (this.connectionMonitorInterval) {
      clearInterval(this.connectionMonitorInterval);
      this.connectionMonitorInterval = null;
    }
  }

  /**
   * Close all SSE connections
   */
  private async closeAllConnections(): Promise<void> {
    // console.log(`[${new Date().toISOString()}] Closing all connections (${this.connections.size})`);

    // Get all session IDs
    const sessionIds = [...this.connections.keys()];

    // Close each connection sequentially
    for (const sessionId of sessionIds) {
      try {
        // console.log(`[${new Date().toISOString()}] Attempting to close connection: ${sessionId}`);
        this.closeConnection(sessionId);
      } catch (error) {
        // console.error(`[${new Date().toISOString()}] Failed to close connection: ${sessionId}`, error);
      }
    }

    // Ensure connections map is empty
    this.connections.clear();
    // console.log(`[${new Date().toISOString()}] All connections closed`);
  }

  /**
   * Get the MCP server instance
   * @returns McpServer instance
   */
  public getMCPServer(): McpServer {
    return this.mcpServer;
  }

  /**
   * Get current configuration
   * @returns Current configuration
   */
  public getConfig(): Config {
    return this.config;
  }

  /**
   * Get connection count
   * @returns Number of active connections
   */
  public getConnectionCount(): number {
    return this.connections.size;
  }

  /**
   * Get all connection session IDs
   * @returns Array of session IDs
   */
  public getSessionIds(): string[] {
    return [...this.connections.keys()];
  }
}
