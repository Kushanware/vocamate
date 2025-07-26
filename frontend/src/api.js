import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Chat API functions
export const chatAPI = {
  // Send message to AI and get response
  sendMessage: async (messages, aiProvider = 'gemini', language = 'en') => {
    try {
      const response = await apiClient.post('/chat/chat', {
        messages,
        aiProvider,
        language
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to send message');
    }
  },

  // Get available AI providers
  getProviders: async () => {
    try {
      const response = await apiClient.get('/chat/providers');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get providers');
    }
  }
};

// Speech API functions
export const speechAPI = {
  // Convert text to speech with enhanced options
  textToSpeech: async (text, options = {}) => {
    try {
      const {
        voiceId,
        language = 'en',
        format = 'MP3',
        encodeAsBase64 = false,
        channelType = 'STEREO',
        sampleRate = 44100,
        pitch = 0,
        rate = 1.0,
        style = 'Conversational',
        variation = 1,
        ...additionalOptions
      } = options;

      const payload = {
        text,
        language,
        format,
        encodeAsBase64,
        ...(voiceId && { voiceId }),
        ...(channelType && { channelType }),
        ...(sampleRate && { sampleRate }),
        ...(pitch !== undefined && { pitch }),
        ...(rate !== undefined && { rate }),
        ...(style && { style }),
        ...(variation !== undefined && { variation }),
        ...additionalOptions
      };

      // Use longer timeout for speech synthesis
      const response = await apiClient.post('/speech/speak', payload, {
        timeout: 60000 // 60 second timeout for speech synthesis
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to synthesize speech');
    }
  },

  // Get available voices with enhanced data
  getVoices: async () => {
    try {
      const response = await apiClient.get('/speech/voices');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get voices');
    }
  },

  // Get supported languages
  getLanguages: async () => {
    try {
      const response = await apiClient.get('/speech/languages');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get languages');
    }
  }
};

// Health check function
export const healthCheck = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`, {
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    throw new Error('Backend server is not accessible');
  }
};

// Utility function to check if backend is available
export const checkBackendHealth = async () => {
  try {
    await healthCheck();
    return true;
  } catch (error) {
    console.error('Backend health check failed:', error.message);
    return false;
  }
};

export default apiClient;
