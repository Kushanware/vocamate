const axios = require('axios');
const config = require('../config/config');

class OpenAIService {
  constructor() {
    this.apiKey = config.openai.apiKey;
    this.baseURL = config.openai.baseURL;
    this.model = config.openai.model;
  }

  async generateResponse(messages, language = 'en') {
    try {
      if (!this.apiKey) {
        throw new Error('OpenAI API key is not configured');
      }

      // Add system prompt based on language
      const systemPrompts = {
        en: "You are VocaMate, a helpful and friendly AI assistant. Provide concise, accurate, and engaging responses. Keep your answers conversational and helpful.",
        hi: "आप VocaMate हैं, एक सहायक और मित्रवत AI सहायक। संक्षिप्त, सटीक और आकर्षक उत्तर प्रदान करें। अपने उत्तर संवादात्मक और सहायक रखें।",
        es: "Eres VocaMate, un asistente de IA útil y amigable. Proporciona respuestas concisas, precisas y atractivas. Mantén tus respuestas conversacionales y útiles.",
        fr: "Vous êtes VocaMate, un assistant IA serviable et amical. Fournissez des réponses concises, précises et engageantes. Gardez vos réponses conversationnelles et utiles.",
        de: "Sie sind VocaMate, ein hilfreicher und freundlicher KI-Assistent. Geben Sie prägnante, genaue und ansprechende Antworten. Halten Sie Ihre Antworten gesprächig und hilfreich."
      };

      const systemMessage = {
        role: 'system',
        content: systemPrompts[language] || systemPrompts.en
      };

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [systemMessage, ...messages],
          max_tokens: 1000,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        message: response.data.choices[0].message.content,
        model: this.model,
        usage: response.data.usage
      };
    } catch (error) {
      console.error('OpenAI API Error:', error.response?.data || error.message);
      throw new Error(`OpenAI service error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

module.exports = OpenAIService;
