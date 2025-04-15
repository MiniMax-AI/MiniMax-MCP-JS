// Environment variables
export const ENV_MINIMAX_API_KEY = 'MINIMAX_API_KEY';
export const ENV_MINIMAX_MCP_BASE_PATH = 'MINIMAX_MCP_BASE_PATH';
export const ENV_MINIMAX_API_HOST = 'MINIMAX_API_HOST';
export const ENV_RESOURCE_MODE = 'MINIMAX_API_RESOURCE_MODE';

// Default values
export const DEFAULT_API_HOST = 'https://api.minimax.chat';

// Resource modes
export const RESOURCE_MODE_URL = 'url';
export const RESOURCE_MODE_LOCAL = 'local';
export const RESOURCE_MODE_BASE64 = 'base64';

// Error messages
export const ERROR_API_KEY_REQUIRED = 'API key is required. Please set the MINIMAX_API_KEY environment variable.';
export const ERROR_API_HOST_REQUIRED = 'API host is required. Please set the MINIMAX_API_HOST environment variable.';
export const ERROR_TEXT_REQUIRED = 'Text is required for text-to-speech conversion.';
export const ERROR_PROMPT_REQUIRED = 'Prompt is required for generation.';
export const ERROR_AUDIO_FILE_REQUIRED = 'Audio file is required for voice cloning.';

// Default Values
export const DEFAULT_SPEECH_MODEL = 'speech-02-hd';
export const DEFAULT_FORMAT = 'mp3';
export const DEFAULT_VOICE_ID = 'male-qn-qingse';
export const DEFAULT_SPEED = 1.0;
export const DEFAULT_VOLUME = 1.0;
export const DEFAULT_PITCH = 0;
export const DEFAULT_EMOTION = 'happy';
export const DEFAULT_SAMPLE_RATE = 32000;
export const DEFAULT_BITRATE = 128000;
export const DEFAULT_CHANNEL = 1;
export const DEFAULT_LANGUAGE_BOOST = 'auto';
export const DEFAULT_T2V_MODEL = 'T2V-01';
export const VALID_VIDEO_MODELS = ['T2V-01', 'T2V-01-Director', 'I2V-01', 'I2V-01-Director', 'I2V-01-live', 'S2V-01'];
export const DEFAULT_T2I_MODEL = 'image-01';
export const VALID_IMAGE_MODELS = ['image-01'];


