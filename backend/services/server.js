const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 5002;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const MURF_API_KEY = process.env.MURF_API_KEY || 'ap2_a4ee7dbb-68ac-496d-ac81-67b9bfea3f30';
const MURF_API_BASE_URL = 'https://api.murf.ai/v1';

const AVAILABLE_VOICES = [
    { voiceId: 'en-US-natalie', displayName: 'Natalie (US)', locale: 'en-US' },
    { voiceId: 'en-US-jennifer', displayName: 'Jennifer (US)', locale: 'en-US' },
    { voiceId: 'en-GB-emma', displayName: 'Emma (UK)', locale: 'en-GB' },
    { voiceId: 'en-IN-aria', displayName: 'Aria (India)', locale: 'en-IN' }
];

console.log('Using API Key:', MURF_API_KEY);
console.log('Using Base URL:', MURF_API_BASE_URL);

app.get('/api/voices', async (req, res) => {
    try {
        console.log('Fetching voices from Murf API...');
        const response = await axios.get(`${MURF_API_BASE_URL}/speech/voices`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': MURF_API_KEY
            }
        });

        console.log(`✅ Voices fetched: ${response.data.length} voices`);
        res.json({
            success: true,
            voices: response.data,
            count: response.data.length
        });
    } catch (error) {
        console.error('Error fetching voices:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        res.json({
            success: true,
            voices: AVAILABLE_VOICES,
            fallback: true,
            error: 'API temporarily unavailable'
        });
    }
});

app.post('/api/synthesize', async (req, res) => {
    try {
        console.log('Synthesis request:', JSON.stringify(req.body, null, 2));

        const text = req.body.text?.value || req.body.text;
        const voiceId = req.body.voiceId?.value || req.body.voiceId;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }
        if (!voiceId) {
            return res.status(400).json({ error: 'Voice ID is required' });
        }

        const response = await axios.post(
            `${MURF_API_BASE_URL}/speech/generate`,
            {
                text,
                voiceId,
                format: req.body.format || 'MP3',
                modelVersion: 'GEN2',
                encodeAsBase64: req.body.encodeAsBase64 !== false,
                ...(req.body.channelType && { channelType: req.body.channelType }),
                ...(req.body.sampleRate && { sampleRate: req.body.sampleRate }),
                ...(req.body.pitch && { pitch: req.body.pitch }),
                ...(req.body.rate && { rate: req.body.rate }),
                ...(req.body.style && { style: req.body.style }),
                ...(req.body.variation && { variation: req.body.variation }),
                ...(req.body.multiNativeLocale && { multiNativeLocale: req.body.multiNativeLocale }),
                ...(req.body.pronunciationDictionary && { pronunciationDictionary: req.body.pronunciationDictionary })
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'api-key': MURF_API_KEY
                }
            }
        );

        const { audioFile, encodedAudio, ...logData } = response.data;
        console.log('Murf API response metadata:', logData);

        if (!audioFile && !encodedAudio) {
            throw new Error('No audio content received from Murf API');
        }

        res.json({
            success: true,
            ...response.data,
            message: 'Speech synthesis completed successfully'
        });
    } catch (error) {
        console.error('Error in speech synthesis:', error);

        if (error.response) {
            res.status(error.response.status).json({
                success: false,
                error: error.response.data?.message || error.response.data?.error || error.message,
                details: error.response.data
            });
        } else if (error.request) {
            res.status(503).json({
                success: false,
                error: 'No response received from Murf API',
                details: 'The request was made but the server did not respond'
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: error.message
            });
        }
    }
});


app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});
