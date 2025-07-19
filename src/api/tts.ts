import { MiniMaxAPI } from '../utils/api.js';
import { TTSRequest } from '../types/index.js';
import { MinimaxRequestError } from '../exceptions/index.js';
import { ERROR_TEXT_REQUIRED, RESOURCE_MODE_URL } from '../const/index.js';
import * as path from 'path';
import { buildOutputFile } from '../utils/file.js';
import * as fs from 'fs';

export class TTSAPI {
  private api: MiniMaxAPI;

  constructor(api: MiniMaxAPI) {
    this.api = api;
  }

  async generateSpeech(request: TTSRequest): Promise<any> {
    // Validate required parameters
    if (!request.text || request.text.trim() === '') {
      throw new MinimaxRequestError(ERROR_TEXT_REQUIRED);
    }

    // Process output file
    let outputFile = request.outputFile;
    if (!outputFile) {
      // If no output file is provided, generate one based on text content
      const textPrefix = request.text.substring(0, 20).replace(/[^\w]/g, '_');
      outputFile = `tts_${textPrefix}_${Date.now()}`;
    }

    if (!path.extname(outputFile)) {
      // If no extension, add one based on format
      const format = request.format || 'mp3';
      outputFile = buildOutputFile(outputFile, request.outputDirectory, format);
    }

    // Prepare request data according to MiniMax API nested structure
    const requestData: Record<string, any> = {
      model: this.ensureValidModel(request.model),
      text: request.text,
      voice_setting: {
        voice_id: request.voiceId || 'male-qn-qingse',
        speed: request.speed || 1.0,
        vol: request.vol || 1.0,
        pitch: request.pitch || 0,
        emotion: this.ensureValidEmotion(request.emotion, this.ensureValidModel(request.model))
      },
      audio_setting: {
        sample_rate: this.ensureValidSampleRate(request.sampleRate),
        bitrate: this.ensureValidBitrate(request.bitrate),
        format: this.ensureValidFormat(request.format),
        channel: this.ensureValidChannel(request.channel)
      },
      language_boost: request.languageBoost || 'auto',
      subtitle_enable: request.subtitleEnable
    };

    // Add output format (if specified)
    if (request.outputFormat === RESOURCE_MODE_URL) {
      requestData.output_format = 'url';
    }

    // Filter out undefined fields (recursive)
    const filteredData = this.removeUndefinedFields(requestData);

    try {
      // Send request
      const response = await this.api.post<any>('/v1/t2a_v2', filteredData);

      // Process response
      const audioData = response?.data?.audio;

      const subtitleFile = response?.data?.subtitle_file;

      if (!audioData) {
        throw new MinimaxRequestError('Could not get audio data from response');
      }

      // If URL mode, return URL directly
      if (request.outputFormat === RESOURCE_MODE_URL) {
        return {
          audio: audioData,
          subtitle: subtitleFile
        };
      }

      // If base64 mode, decode and save file
      try {
        // Convert hex string to binary
        const audioBuffer = Buffer.from(audioData, 'hex');

        // Ensure output directory exists
        const outputDir = path.dirname(outputFile);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write to file
        fs.writeFileSync(outputFile, audioBuffer);

        return {
          audio: outputFile,
          subtitle: subtitleFile
        };
      } catch (error) {
        throw new MinimaxRequestError(`Failed to save audio file: ${String(error)}`);
      }
    } catch (error) {
      throw error;
    }
  }

  // Helper function: Recursively remove undefined fields from an object
  private removeUndefinedFields(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.removeUndefinedFields(item)).filter(item => item !== undefined);
    }

    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined) continue;

      if (typeof value === 'object' && value !== null) {
        const filteredValue = this.removeUndefinedFields(value);
        // Only add non-empty objects
        if (typeof filteredValue === 'object' && !Array.isArray(filteredValue) && Object.keys(filteredValue).length === 0) {
          continue;
        }
        result[key] = filteredValue;
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  // Helper function: Ensure sample rate is within valid range
  private ensureValidSampleRate(sampleRate?: number): number {
    // List of valid sample rates supported by MiniMax API
    const validSampleRates = [8000, 16000, 22050, 24000, 32000, 44100];

    // If no sample rate is provided or it's invalid, use default value 32000
    if (sampleRate === undefined) {
      return 32000;
    }

    // If the provided sample rate is not within the valid range, use the closest valid value
    if (!validSampleRates.includes(sampleRate)) {
      // Find the closest valid sample rate
      const closest = validSampleRates.reduce((prev, curr) => {
        return (Math.abs(curr - sampleRate) < Math.abs(prev - sampleRate)) ? curr : prev;
      });

      // console.error(`Warning: Provided sample rate ${sampleRate} is invalid, using closest valid value ${closest}`);
      return closest;
    }

    return sampleRate;
  }

  // Helper function: Ensure bitrate is within valid range
  private ensureValidBitrate(bitrate?: number): number {
    // List of valid bitrates supported by MiniMax API
    const validBitrates = [64000, 96000, 128000, 160000, 192000, 224000, 256000, 320000];

    // If no bitrate is provided or it's invalid, use default value 128000
    if (bitrate === undefined) {
      return 128000;
    }

    // If the provided bitrate is not within the valid range, use the closest valid value
    if (!validBitrates.includes(bitrate)) {
      // Find the closest valid bitrate
      const closest = validBitrates.reduce((prev, curr) => {
        return (Math.abs(curr - bitrate) < Math.abs(prev - bitrate)) ? curr : prev;
      });

      // console.error(`Warning: Provided bitrate ${bitrate} is invalid, using closest valid value ${closest}`);
      return closest;
    }

    return bitrate;
  }

  // Helper function: Ensure channel is within valid range
  private ensureValidChannel(channel?: number): number {
    // List of valid channels supported by MiniMax API
    const validChannels = [1, 2];

    // If no channel is provided or it's invalid, use default value 1
    if (channel === undefined) {
      return 1;
    }

    // If the provided channel is not within the valid range, use the closest valid value
    if (!validChannels.includes(channel)) {
      // Find the closest valid channel
      const closest = validChannels.reduce((prev, curr) => {
        return (Math.abs(curr - channel) < Math.abs(prev - channel)) ? curr : prev;
      });

      // console.error(`Warning: Provided channel ${channel} is invalid, using closest valid value ${closest}`);
      return closest;
    }

    return channel;
  }

  // Helper function: Ensure model is within valid range
  private ensureValidModel(model?: string): string {
    // List of valid models supported by MiniMax API
    const validModels = ['speech-02-hd', 'speech-02-turbo', 'speech-01-hd', 'speech-01-turbo', 'speech-01-240228', 'speech-01-turbo-240228'];

    // If no model is provided or it's invalid, use default value speech-02-hd
    if (!model) {
      return 'speech-02-hd';
    }

    // If the provided model is not within the valid range, use default value
    if (!validModels.includes(model)) {
      // console.error(`Warning: Provided model ${model} is invalid, using default value speech-02-hd`);
      return 'speech-02-hd';
    }

    return model;
  }

  // Helper function: Ensure format is within valid range
  private ensureValidFormat(format?: string): string {
    // List of valid formats supported by MiniMax API
    const validFormats = ['mp3', 'pcm', 'flac', 'wav'];

    // If no format is provided or it's invalid, use default value mp3
    if (!format) {
      return 'mp3';
    }

    // If the provided format is not within the valid range, use default value
    if (!validFormats.includes(format)) {
      // console.error(`Warning: Provided format ${format} is invalid, using default value mp3`);
      return 'mp3';
    }

    return format;
  }

  // Helper function: Ensure emotion is within valid range and compatible with the model
  private ensureValidEmotion(emotion?: string, model?: string): string | undefined {
    // List of valid emotions supported by MiniMax API
    const validEmotions = ['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral'];

    // List of models that support emotion parameter
    const emotionSupportedModels = ['speech-02-hd', 'speech-02-turbo', 'speech-01-turbo', 'speech-01-hd'];

    // Check if the model supports emotion
    if (model && !emotionSupportedModels.includes(model)) {
      return undefined; // Return undefined to remove the emotion parameter for unsupported models
    }

    // If no emotion is provided or it's invalid, use default value happy
    if (!emotion) {
      return 'happy';
    }

    // If the provided emotion is not within the valid range, use default value
    if (!validEmotions.includes(emotion)) {
      // console.error(`Warning: Provided emotion ${emotion} is invalid, using default value happy`);
      return 'happy';
    }

    return emotion;
  }
}
