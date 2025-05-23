import { MiniMaxAPI } from '../utils/api.js';
import { VoiceCloneRequest } from '../types/index.js';
import { MinimaxRequestError } from '../exceptions/index.js';
import { DEFAULT_SPEECH_MODEL, ERROR_AUDIO_FILE_REQUIRED, RESOURCE_MODE_URL } from '../const/index.js';
import { buildOutputFile, processInputFile } from '../utils/file.js';
import * as fs from 'fs';
import * as path from 'path';
import * as requests from 'axios';

export class VoiceCloneAPI {
  private api: MiniMaxAPI;

  constructor(api: MiniMaxAPI) {
    this.api = api;
  }

  async cloneVoice(request: VoiceCloneRequest): Promise<string> {
    // Validate required parameters
    if (!request.audioFile) {
      throw new MinimaxRequestError(ERROR_AUDIO_FILE_REQUIRED);
    }

    if (!request.voiceId) {
      throw new MinimaxRequestError('Voice ID is required');
    }

    try {
      // Step 1: Upload file
      let files: any;

      if (request.isUrl) {
        // Handle URL file
        try {
          const response = await requests.default.get(request.audioFile, { responseType: 'stream' });
          const tempFilePath = path.join(process.cwd(), 'temp', path.basename(request.audioFile));
          
          // Ensure temp directory exists
          const tempDir = path.dirname(tempFilePath);
          if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
          }

          // Save stream to temp file
          const writer = fs.createWriteStream(tempFilePath);
          response.data.pipe(writer);

          await new Promise<void>((resolve, reject) => {
            writer.on('finish', () => resolve());
            writer.on('error', reject);
          });

          // Prepare upload parameters with temp file
          files = {
            file: {
              path: tempFilePath,
            },
          };
        } catch (error) {
          throw new MinimaxRequestError(`Failed to download audio from URL: ${String(error)}`);
        }
      } else {
        // Handle local file
        try {
          const filePath = processInputFile(request.audioFile);
          
          // Prepare upload parameters
          files = {
            file: {
              path: filePath,
            },
          };
        } catch (error) {
          throw new MinimaxRequestError(`Failed to read local file: ${String(error)}`);
        }
      }

      const data = {
        files,
        purpose: 'voice_clone',
      };

      // Upload file
      const uploadResponse = await this.api.post<any>('/v1/files/upload', data);

      // Get file ID
      const fileId = uploadResponse?.file?.file_id;
      if (!fileId) {
        throw new MinimaxRequestError('Failed to get file ID from upload response');
      }

      // Step 2: Clone voice
      const payload: Record<string, any> = {
        file_id: fileId,
        voice_id: request.voiceId,
      };

      // If demo text is provided, add it to the request
      if (request.text) {
        payload.text = request.text;
        payload.model = DEFAULT_SPEECH_MODEL;
      }

      // Send clone request
      const cloneResponse = await this.api.post<any>('/v1/voice_clone', payload);

      // Check if there's a demo audio
      const demoAudio = cloneResponse?.demo_audio;
      if (!demoAudio) {
        // If no demo audio, return voice ID directly
        return request.voiceId;
      }

      // If URL mode, return URL directly
      const resourceMode = this.api.getResourceMode();
      if (resourceMode === RESOURCE_MODE_URL) {
        return demoAudio;
      }

      // Step 3: Download demo audio
      const outputPath = buildOutputFile('voice_clone', request.outputDirectory, 'wav', true);

      try {
        // Download audio
        const audioResponse = await requests.default.get(demoAudio, { responseType: 'arraybuffer' });

        // Ensure directory exists
        const dirPath = path.dirname(outputPath);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }

        // Save file
        fs.writeFileSync(outputPath, Buffer.from(audioResponse.data));

        // Return voice ID with path information
        return `${request.voiceId} (Demo audio: ${outputPath})`;
      } catch (error) {
        // If download fails, still return voice ID
        return request.voiceId;
      }
    } catch (error) {
      if (error instanceof MinimaxRequestError) {
        throw error;
      }
      throw new MinimaxRequestError(`Error occurred while cloning voice: ${String(error)}`);
    }
  }
}
