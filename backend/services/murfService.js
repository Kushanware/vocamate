const axios = require('axios');
const config = require('../config/config');

class MurfService {
  constructor() {
    this.apiKey = config.murf.apiKey;
    this.projectId = config.murf.projectId || process.env.MURF_PROJECT_ID;
    this.baseURL = config.murf.baseURL || 'https://api.murf.ai/v1';
  }

  async textToSpeech({ text, voiceId, language = 'en', encodeAsBase64 = false }) {
    try {
      if (!this.apiKey) throw new Error('Murf API key is missing');
      if (!voiceId) throw new Error('voiceId is required for Murf TTS');
      if (!text) throw new Error('Text input is empty');

      const payload = {
        text: text,
        voiceId: voiceId,
        format: 'MP3',
        modelVersion: 'GEN2',
        encodeAsBase64: false
      };

      const response = await axios.post(`${this.baseURL}/speech/generate`, payload, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        }
      });

      if (!response.data || (!response.data.audioFile && !response.data.encodedAudio)) {
        console.error("No audio returned from Murf API:", response.data);
        throw new Error("Audio not returned from Murf API");
      }

      return {
        success: true,
        audioUrl: response.data.audioFile,
        audioBase64: response.data.encodedAudio,
        voiceId: voiceId
      };
    } catch (err) {
      console.error('❌ MurfService Error:', err.message);
      if (err.response) {
        console.error('Murf API Response Error Data:', err.response.data);
        console.error('Murf API Response Error Status:', err.response.status);
      }
      return {
        success: false,
        error: err.response?.data?.message || err.message || 'Text-to-speech failed'
      };
    }
  }

  async getAvailableVoices() {
    try {
      const response = await axios.get(`${this.baseURL}/speech/voices`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        }
      });

      return {
        success: true,
        voices: response.data
      };
    } catch (err) {
      console.error('❌ Error fetching voices:', err.message);
      return {
        success: false,
        error: err.message || 'Failed to fetch voices'
      };
    }
  }
}

module.exports = MurfService;
