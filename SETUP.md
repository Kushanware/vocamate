# VocaMate Environment Configuration Guide

This guide will help you set up the necessary API keys and environment variables for VocaMate.

## Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# AI Service API Keys
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Text-to-Speech API Key
MURF_API_KEY=your_murf_api_key_here
MURF_PROJECT_ID=your_murf_project_id_here

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Frontend Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
# Backend API Configuration
REACT_APP_API_BASE_URL=http://localhost:5000/api

# App Configuration
REACT_APP_NAME=VocaMate
REACT_APP_VERSION=1.0.0
REACT_APP_DESCRIPTION=AI Voice Assistant

# Features Configuration
REACT_APP_ENABLE_SPEECH_RECOGNITION=true
REACT_APP_ENABLE_SPEECH_SYNTHESIS=true
REACT_APP_DEFAULT_LANGUAGE=en
REACT_APP_DEFAULT_AI_PROVIDER=gemini

# UI Configuration
REACT_APP_MAX_MESSAGE_LENGTH=1000
REACT_APP_TYPING_ANIMATION_DELAY=50
```

## How to Get API Keys

### 1. OpenAI API Key (Optional)

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it in your backend `.env` file
5. Note: This requires a paid OpenAI account for GPT-4 access

### 2. Google Gemini API Key (Recommended)

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your backend `.env` file
5. Note: Gemini has a generous free tier

### 3. Murf AI API Key (For Voice Synthesis)

1. Visit [Murf AI](https://murf.ai/)
2. Sign up for an account
3. Navigate to your dashboard
4. Go to API settings
5. Generate an API key
6. Also note your Project ID
7. Add both to your backend `.env` file

## Environment Setup Checklist

- [ ] Backend `.env` file created
- [ ] Frontend `.env` file created
- [ ] At least one AI provider API key configured (OpenAI or Gemini)
- [ ] Murf AI API key configured (optional, will use mock audio in development)
- [ ] All dependencies installed (`npm install` in both directories)
- [ ] Both servers can start successfully

## Testing Your Setup

1. Start the backend server: `npm start` in the `backend` directory
2. Start the frontend server: `npm start` in the `frontend` directory
3. Open `http://localhost:3000` in your browser
4. Try sending a message to test AI integration
5. Try using the microphone button to test speech recognition
6. Check if voice output works for AI responses

## Troubleshooting

### Backend Server Won't Start
- Check if all required environment variables are set
- Ensure no other service is using port 5000
- Check the console for specific error messages

### AI Responses Not Working
- Verify your API keys are valid and have sufficient quota
- Check the browser console for error messages
- Ensure the backend server is running and accessible

### Speech Features Not Working
- Use HTTPS or localhost (required for Web Speech API)
- Check browser compatibility (Chrome/Edge recommended)
- Ensure microphone permissions are granted
- For voice output, check if Murf AI key is configured

### Common Issues
- **CORS errors**: Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- **API rate limits**: Check if you've exceeded your API quota
- **Network issues**: Ensure your internet connection is stable

## Security Notes

- Never commit `.env` files to version control
- Keep your API keys secure and don't share them
- Regenerate API keys if they're compromised
- Use environment variables in production, not hardcoded values

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in backend
2. Use a proper web server (nginx, Apache)
3. Set up HTTPS
4. Use a reverse proxy for the backend
5. Configure proper CORS origins
6. Use a process manager (PM2) for the Node.js backend
7. Set up monitoring and logging
