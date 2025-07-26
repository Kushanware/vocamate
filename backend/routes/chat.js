const express = require('express');
const router = express.Router();
const OpenAIService = require('../services/openaiService');
const GeminiService = require('../services/geminiService');
const MurfService = require('../services/murfService');

const openaiService = new OpenAIService();
const geminiService = new GeminiService();
const murfService = new MurfService();

// POST /api/chat - Generate AI response with optional speech synthesis
router.post('/', async (req, res) => {
  try {
    const { 
      messages, 
      aiProvider = 'gemini', 
      language = 'en',
      synthesizeSpeech = false,
      speechOptions = {}
    } = req.body;

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Messages array is required and cannot be empty'
      });
    }

    // Validate message format
    for (const message of messages) {
      if (!message.role || !message.content) {
        return res.status(400).json({
          success: false,
          error: 'Each message must have role and content fields'
        });
      }
    }

    let aiResult;
    
    // Choose AI service based on provider
    if (aiProvider === 'openai') {
      aiResult = await openaiService.generateResponse(messages, language);
    } else {
      aiResult = await geminiService.generateResponse(messages, language);
    }

    // Prepare response object
    const response = {
      success: true,
      message: aiResult.message,
      provider: aiProvider,
      model: aiResult.model,
      language: language,
      usage: aiResult.usage,
      timestamp: new Date().toISOString()
    };

    // Optionally synthesize speech
    if (synthesizeSpeech && aiResult.message) {
      try {
        const speechResult = await murfService.textToSpeech(aiResult.message, {
          language,
          voiceId: speechOptions.voiceId,
          format: speechOptions.format || 'MP3',
          encodeAsBase64: speechOptions.encodeAsBase64 !== false,
          pitch: speechOptions.pitch,
          rate: speechOptions.rate,
          style: speechOptions.style,
          ...speechOptions
        });

        response.audio = {
          url: speechResult.audioUrl,
          base64: speechResult.audioBase64,
          duration: speechResult.duration,
          voiceId: speechResult.voiceId
        };
      } catch (speechError) {
        console.error('Speech synthesis error:', speechError);
        response.speechError = speechError.message;
      }
    }

    res.json(response);

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate AI response',
      timestamp: new Date().toISOString()
    });
  }
});

// Legacy route for backwards compatibility
router.post('/chat', async (req, res) => {
  // Redirect to the main chat endpoint
  req.url = '/';
  router.handle(req, res);
});

// GET /api/chat/providers - Get available AI providers
router.get('/providers', (req, res) => {
  res.json({
    success: true,
    providers: [
      {
        id: 'gemini',
        name: 'Google Gemini 2.0 Flash',
        available: !!process.env.GEMINI_API_KEY,
        features: ['Text Generation', 'Conversation', 'Multi-language']
      },
      {
        id: 'openai',
        name: 'OpenAI GPT-4',
        available: !!process.env.OPENAI_API_KEY,
        features: ['Text Generation', 'Conversation', 'Multi-language']
      }
    ],
    speechSynthesis: {
      available: !!process.env.MURF_API_KEY,
      provider: 'Murf AI',
      formats: ['MP3', 'WAV'],
      features: ['Multi-voice', 'Pitch Control', 'Rate Control', 'Style Control']
    }
  });
});

module.exports = router;
