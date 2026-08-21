// Environment variable names
export const ENV_MINIMAX_API_KEY = 'MINIMAX_API_KEY';
export const ENV_MINIMAX_API_HOST = 'MINIMAX_API_HOST';
export const ENV_MINIMAX_MCP_BASE_PATH = 'MINIMAX_MCP_BASE_PATH';
export const ENV_RESOURCE_MODE = 'MINIMAX_RESOURCE_MODE';
export const ENV_TRANSPORT_MODE = 'MINIMAX_TRANSPORT_MODE';
export const ENV_SERVER_PORT = 'MINIMAX_SERVER_PORT';
export const ENV_SERVER_ENDPOINT = 'MINIMAX_SERVER_ENDPOINT';
export const ENV_CONFIG_PATH = 'MINIMAX_CONFIG_PATH';

// Resource modes
export const RESOURCE_MODE_URL = 'url';
export const RESOURCE_MODE_LOCAL = 'local';
export const RESOURCE_MODE_BASE64 = 'base64';

// Transport modes
export const TRANSPORT_MODE_STDIO = 'stdio';
export const TRANSPORT_MODE_REST = 'rest';
export const TRANSPORT_MODE_SSE = 'sse';

// Default values
export const DEFAULT_API_HOST = 'https://api.minimax.chat';
export const DEFAULT_SPEECH_MODEL = 'speech-02-hd';
export const DEFAULT_T2I_MODEL = 'image-01';
export const DEFAULT_T2V_MODEL = 'T2V-01';
export const DEFAULT_VOICE_ID = 'male-qn-qingse';
export const DEFAULT_EMOTION = 'happy';
export const DEFAULT_FORMAT = 'mp3';
export const DEFAULT_SPEED = 1.0;
export const DEFAULT_VOLUME = 1.0;
export const DEFAULT_PITCH = 0;
export const DEFAULT_BITRATE = 128000;
export const DEFAULT_CHANNEL = 1;
export const DEFAULT_SAMPLE_RATE = 32000;
export const DEFAULT_LANGUAGE_BOOST = 'auto';
export const DEFAULT_TRANSPORT_MODE = TRANSPORT_MODE_STDIO;
export const DEFAULT_SERVER_PORT = 9593;
export const DEFAULT_SERVER_ENDPOINT = '/rest';
export const DEFAULT_VIDEO_MODEL = 'MiniMax-Hailuo-02';

// Error messages
export const ERROR_API_KEY_REQUIRED = 'API_KEY environment variable is required';
export const ERROR_API_HOST_REQUIRED = 'API_HOST is required';
export const ERROR_TEXT_REQUIRED = 'Text is required for text-to-speech conversion.';
export const ERROR_PROMPT_REQUIRED = 'Prompt is required for generation.';
export const ERROR_AUDIO_FILE_REQUIRED = 'Audio file is required for voice cloning.';
export const ERROR_PREVIEW_TEXT_REQUIRED = 'Preview text is required for voice design.';

// Default Values
export const VALID_VIDEO_MODELS = ['T2V-01', 'T2V-01-Director', 'I2V-01', 'I2V-01-Director', 'I2V-01-live', 'S2V-01', "MiniMax-Hailuo-02"];
export const VALID_IMAGE_MODELS = ['image-01'];


// Default Description
export const OUTPUT_DIRECTORY_DESCRIPTION = 'The directory to save the output file. `outputDirectory` is relative to `MINIMAX_MCP_BASE_PATH` (or `basePath` in config). The final save path is `${basePath}/${outputDirectory}`. For example, if `MINIMAX_MCP_BASE_PATH=~/Desktop` and `outputDirectory=workspace`, the output will be saved to `~/Desktop/workspace/`';  
