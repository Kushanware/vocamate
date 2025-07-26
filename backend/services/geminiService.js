const axios = require('axios');
const config = require('../config/config');

class GeminiService {
  constructor() {
    this.apiKey = config.gemini.apiKey;
    this.baseURL = config.gemini.baseURL;
    this.model = config.gemini.model;
    this.maxOutputTokens = config.gemini.maxOutputTokens || 100;
    this.defaultPrompt = config.gemini.defaultPrompt;
    this.lastUserMessage = '';
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  async generateResponse(messages, language = 'en') {
    try {
      if (!this.apiKey) {
        throw new Error('Gemini API key is not configured');
      }

      // Get the current user message
      const currentUserMessage = messages[messages.length - 1]?.content;
      
      // Check for repetitive messages
      if (currentUserMessage === this.lastUserMessage) {
        return {
          success: true,
          message: "I noticed you sent the same message again. Is there something specific you'd like to discuss?",
          model: this.model
        };
      }
      this.lastUserMessage = currentUserMessage;

  
      const geminiMessages = this.convertMessagesToGeminiFormat(messages, language);

      const response = await axios.post(
        `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const generatedText = response.data.candidates[0].content.parts[0].text;

      return {
        success: true,
        message: generatedText,
        model: this.model,
        usage: response.data.usageMetadata
      };
    } catch (error) {
      console.error('Gemini API Error:', error.response?.data || error.message);
      
      // Handle rate limiting errors
      if (error.response?.status === 429 && this.retryCount < this.maxRetries) {
        this.retryCount++;
        const delay = Math.pow(2, this.retryCount) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.generateResponse(messages, language);
      }

      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few minutes.');
      }
      
      throw new Error(`Gemini service error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  convertMessagesToGeminiFormat(messages, language) {
    const systemPrompts = {
      en: "You are VocaMate, a helpful and friendly AI assistant. Provide concise, accurate, and engaging responses. Keep your answers conversational and helpful.",
      hi: "आप VocaMate हैं, एक सहायक और मित्रवत AI सहायक। संक्षिप्त, सटीक और आकर्षक उत्तर प्रदान करें। अपने उत्तर संवादात्मक और सहायक रखें।",
      es: "Eres VocaMate, un asistente de IA útil y amigable. Proporciona respuestas concisas, precisas y atractivas. Mantén tus respuestas conversacionales y útiles.",
      fr: "Vous êtes VocaMate, un assistant IA serviable et amical. Fournissez des réponses concises, précises et engageantes. Gardez vos réponses conversationnelles et utiles.",
      de: "Sie sind VocaMate, ein hilfreicher und freundlicher KI-Assistent. Geben Sie prägnante, genaue und ansprechende Antworten. Halten Sie Ihre Antworten gesprächig und hilfreich."
    };

    const geminiContents = [];
    
    // Add system prompt as the first user message
    geminiContents.push({
      role: 'user',
      parts: [{ text: systemPrompts[language] || systemPrompts.en }]
    });
    
    geminiContents.push({
      role: 'model',
      parts: [{ text: 'Hello! I\'m VocaMate, your AI assistant. How can I help you today?' }]
    });

    // Convert chat messages (skip system messages)
    messages.forEach(msg => {
      if (msg.role === 'user') {
        geminiContents.push({
          role: 'user',
          parts: [{ text: msg.content }]
        });
      } else if (msg.role === 'assistant') {
        geminiContents.push({
          role: 'model',
          parts: [{ text: msg.content }]
        });
      }
    });

    return geminiContents;
  }
}

module.exports = GeminiService;
