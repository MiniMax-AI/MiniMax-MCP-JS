import { MiniMaxAPI } from '../utils/api.js';
import { ListVoicesRequest } from '../types/index.js';
import { MinimaxRequestError } from '../exceptions/index.js';

export class VoiceAPI {
  private api: MiniMaxAPI;

  constructor(api: MiniMaxAPI) {
    this.api = api;
  }

  /**
   * List all available voices
   * @param request Request parameters
   * @returns Voice list information
   */
  async listVoices(request: ListVoicesRequest = {}): Promise<{ systemVoices: string[], voiceCloneVoices: string[] }> {
    try {
      // Send request
      const response = await this.api.post<any>('/v1/get_voice', {
        voice_type: request.voiceType || 'all'
      });

      // Process response
      const systemVoices = response?.system_voice || [];
      const voiceCloneVoices = response?.voice_cloning || [];

      // Format voice information
      const systemVoiceList: string[] = [];
      const voiceCloneVoiceList: string[] = [];

      for (const voice of systemVoices) {
        systemVoiceList.push(`Name: ${voice.voice_name}, ID: ${voice.voice_id}`);
      }

      for (const voice of voiceCloneVoices) {
        const voiceName = voice.voice_name || voice.voice_id;
        voiceCloneVoiceList.push(`Name: ${voiceName}, ID: ${voice.voice_id}`);
      }

      return {
        systemVoices: systemVoiceList,
        voiceCloneVoices: voiceCloneVoiceList
      };
    } catch (error) {
      throw new MinimaxRequestError(`Failed to list voices: ${String(error)}`);
    }
  }
}
