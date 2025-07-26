const express = require('express');
const router = express.Router();
const MurfService = require('../services/murfService');

const murf = new MurfService();

// POST /api/speech/speak
router.post('/speak', async (req, res) => {
  try {
    const result = await murf.textToSpeech(req.body);
    res.json(result);
  } catch (err) {
    console.error('Murf TTS error:', err);
    res.status(500).json({ success: false, error: 'TTS failed' });
  }
});

// Optional: Get voices
router.get('/voices', async (req, res) => {
  try {
    const voices = await murf.getAvailableVoices();
    res.json(voices);
  } catch (err) {
    console.error('Voice fetch error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch voices' });
  }
});

// GET /api/speech/languages - Get supported languages
router.get('/languages', (req, res) => {
  res.json({
    success: true,
    languages: [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ar', name: 'Arabic' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'it', name: 'Italian' }
    ]
  });
});

module.exports = router;
