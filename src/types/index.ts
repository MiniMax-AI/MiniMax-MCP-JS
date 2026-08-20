export interface BaseToolRequest {
  outputDirectory?: string;
}

export interface TTSRequest extends BaseToolRequest {
  text: string;
  model?: string;
  voiceId?: string;
  speed?: number;
  vol?: number;
  pitch?: number;
  emotion?: string;
  format?: string;
  sampleRate?: number;
  bitrate?: number;
  channel?: number;
  latexRead?: boolean;
  pronunciationDict?: string[];
  stream?: boolean;
  languageBoost?: string;
  subtitleEnable?: boolean;
  outputFormat?: string;
  outputFile?: string;
}

export interface ImageGenerationRequest extends BaseToolRequest {
  prompt: string;
  model?: string;
  aspectRatio?: string;
  n?: number;
  promptOptimizer?: boolean;
  outputFile?: string;
  subjectReference?: string;
}

export interface VideoGenerationRequest extends BaseToolRequest {
  prompt: string;
  model?: string;
  duration?: number;
  fps?: number;
  firstFrameImage?: string;
  outputFile?: string;
  resolution?: string;
  asyncMode?: boolean;
}

export interface VideoGenerationQueryRequest extends BaseToolRequest {
  taskId: string;
}

export interface VoiceCloneRequest extends BaseToolRequest {
  audioFile: string;
  voiceId: string;
  text?: string;
  name?: string;
  description?: string;
  isUrl?: boolean;
}

export interface ListVoicesRequest {
  voiceType?: string;
}

export interface PlayAudioRequest {
  inputFilePath: string;
  isUrl?: boolean;
}

export interface VoiceDesignRequest extends BaseToolRequest {
  prompt: string;
  previewText: string;
  voiceId?: string;
}

export type TransportMode = 'stdio' | 'rest' | 'sse';

export interface ServerOptions {
  port?: number;
  endpoint?: string;
  mode?: TransportMode;
}

export interface Config {
  apiKey: string;
  basePath?: string;
  apiHost?: string;
  resourceMode?: string;
  server?: ServerOptions;
}
