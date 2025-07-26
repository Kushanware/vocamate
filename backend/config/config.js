require('dotenv').config();

const config = {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // AI Service Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-4' // Default model, can be overridden
  },
  
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-2.0-flash',
    defaultPrompt: 'You are VocaMate, a friendly voice assistant. Keep responses concise and conversational. Avoid repeating yourself.',
    maxOutputTokens: 256,    // Optimized for flash model
    requestsPerMinute: 15,   // Rate limit per minute for flash model
    maxRequestsPerDay: 200   // Daily request limit for flash model
  },
  
  // Murf AI Configuration
  murf: {
    apiKey: process.env.MURF_API_KEY,
    baseURL: 'https://api.murf.ai/v1',
    defaultOptions: {
      format: 'MP3',
      channelType: 'STEREO',
      sampleRate: 44100,
      encodeAsBase64: true
    }
  },
  
  // CORS Configuration
  corsOrigin: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Rate Limiting
  rateLimiting: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },
  
  // Voice Configuration
  voices: {
    // English Voices
    en: {
      default: {
        voiceId: 'en-US-natalie',
        name: 'Natalie (US)',
        style: 'conversational'
      },
      alternatives: [
        { voiceId: 'en-US-miles', name: 'Miles (US)', style: 'professional' },
        { voiceId: 'en-UK-ruby', name: 'Ruby (UK)', style: 'friendly' },
        { voiceId: 'en-AU-leyton', name: 'Leyton (AU)', style: 'casual' }
      ]
    },
    // Hindi Voices
    hi: {
      default: {
        voiceId: 'hi-IN-shaan',
        name: 'Shaan',
        style: 'conversational'
      },
      alternatives: [
        { voiceId: 'hi-IN-shweta', name: 'Shweta', style: 'professional' }
      ]
    },
    // Spanish Voices
    es: {
      default: {
        voiceId: 'es-ES-elvira',
        name: 'Elvira (Spain)',
        style: 'conversational'
      },
      alternatives: [
        { voiceId: 'es-ES-enrique', name: 'Enrique (Spain)', style: 'professional' },
        { voiceId: 'es-MX-alejandro', name: 'Alejandro (Mexico)', style: 'casual' }
      ]
    },
    // French Voices
    fr: {
      default: {
        voiceId: 'fr-FR-adélie',
        name: 'Adélie',
        style: 'conversational'
      },
      alternatives: [
        { voiceId: 'fr-FR-justine', name: 'Justine', style: 'professional' },
        { voiceId: 'fr-FR-louis', name: 'Louis', style: 'casual' }
      ]
    },
    // German Voices
    de: {
      default: {
        voiceId: 'de-DE-matthias',
        name: 'Matthias',
        style: 'professional'
      },
      alternatives: [
        { voiceId: 'de-DE-josephine', name: 'Josephine', style: 'conversational' },
        { voiceId: 'de-DE-björn', name: 'Björn', style: 'promo' }
      ]
    },
    // Japanese Voices
    ja: {
      default: {
        voiceId: 'ja-JP-kenji',
        name: 'Kenji',
        style: 'conversational'
      },
      alternatives: [
        { voiceId: 'ja-JP-kimi', name: 'Kimi', style: 'conversational' }
      ]
    },
    // Korean Voices
    ko: {
      default: {
        voiceId: 'ko-KR-hwan',
        name: 'Hwan',
        style: 'conversational'
      },
      alternatives: [
        { voiceId: 'ko-KR-sanghoon', name: 'Sanghoon', style: 'promo' }
      ]
    }
  },
  
  // Speaking Styles
  voiceStyles: {
    conversational: { pitch: 1.0, rate: 1.0 },
    professional: { pitch: 0.9, rate: 0.95 },
    friendly: { pitch: 1.1, rate: 1.05 },
    casual: { pitch: 1.05, rate: 1.1 },
    polite: { pitch: 0.95, rate: 0.9 }
  }
};

module.exports = config;
