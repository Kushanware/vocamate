# 🚀 VocaMate - AI Voice Assistant

A modern, full-stack conversational AI voice assistant web application built with React and Node.js.

![VocaMate Banner](https://via.placeholder.com/1200x400/667eea/ffffff?text=VocaMate+AI+Voice+Assistant)

## ✨ Features

- **🎤 Voice Input**: Web Speech API integration for voice-to-text conversion
- **🔊 Text-to-Speech**: Murf AI integration for natural-sounding voice output  
- **🧠 Multiple AI Providers**: Support for OpenAI GPT-4 and Google Gemini 1.5 Pro
- **🌍 Multi-language Support**: English, Hindi, Spanish, French, and German
- **🌙 Dark/Light Mode**: Toggle between themes with smooth animations
- **📱 Responsive Design**: Optimized for both desktop and mobile devices
- **💬 Real-time Chat**: Smooth chat interface with typing indicators
- **🎨 Modern UI**: Built with Tailwind CSS and Framer Motion animations
- **🔒 Secure**: Environment-based API key management

## 🛠️ Tech Stack

### Frontend
- **React 18** - User interface library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

### AI Services
- **OpenAI GPT-4** - Conversational AI
- **Google Gemini 1.5 Pro** - Advanced AI model
- **Murf AI** - Text-to-speech synthesis

## 📦 Project Structure

```
vocamate/
├── backend/                 # Node.js backend server
│   ├── config/             # Configuration files
│   │   └── config.js       # App configuration
│   ├── routes/             # API routes
│   │   ├── chat.js         # Chat endpoints
│   │   └── speech.js       # Speech endpoints
│   ├── services/           # Service layers
│   │   ├── openaiService.js # OpenAI integration
│   │   ├── geminiService.js # Gemini integration
│   │   └── murfService.js   # Murf AI integration
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies
│   └── .env               # Environment variables
├── frontend/               # React frontend app
│   ├── public/            # Static files
│   │   ├── index.html     # HTML template
│   │   └── manifest.json  # PWA manifest
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   │   ├── Header.jsx
│   │   │   ├── ChatContainer.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   ├── TypingIndicator.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── LoadingScreen.jsx
│   │   ├── App.jsx        # Main app component
│   │   ├── api.js         # API client
│   │   ├── index.js       # App entry point
│   │   └── index.css      # Global styles
│   ├── package.json       # Dependencies
│   ├── tailwind.config.js # Tailwind configuration
│   ├── postcss.config.js  # PostCSS configuration
│   └── .env              # Environment variables
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 16+** and **npm**
- **API Keys** for:
  - OpenAI (optional)
  - Google Gemini (optional)
  - Murf AI (recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/vocamate.git
cd vocamate
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the backend directory:

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
```

Start the backend server:

```bash
npm start
```

The backend will be running on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create `.env` file in the frontend directory:

```env
# Backend API Configuration
REACT_APP_API_BASE_URL=http://localhost:5000/api

# App Configuration
REACT_APP_NAME=VocaMate
REACT_APP_VERSION=1.0.0
REACT_APP_DEFAULT_LANGUAGE=en
REACT_APP_DEFAULT_AI_PROVIDER=gemini
```

Start the frontend development server:

```bash
npm start
```

The frontend will be running on `http://localhost:3000`

## 🔑 API Keys Setup

### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your backend `.env` file

### Google Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to your backend `.env` file

### Murf AI API Key
1. Visit [Murf AI](https://murf.ai/)
2. Sign up for an account
3. Get your API key from the dashboard
4. Add it to your backend `.env` file

## 🌍 Supported Languages

- **English (en)** - Default
- **Hindi (hi)** - हिंदी
- **Spanish (es)** - Español
- **French (fr)** - Français
- **German (de)** - Deutsch

## 📱 Usage

1. **Text Chat**: Type your message in the input box and press Enter
2. **Voice Input**: Click the microphone button to speak your message
3. **Voice Output**: AI responses are automatically converted to speech
4. **Language Switch**: Use the language dropdown to change conversation language
5. **AI Provider**: Switch between OpenAI and Gemini models
6. **Dark Mode**: Toggle between light and dark themes

## 🔧 Development

### Running in Development Mode

Backend:
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

Frontend:
```bash
cd frontend
npm start    # Hot reload enabled
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

## 🚨 Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Ensure backend server is running on port 5000
   - Check if CORS is configured correctly
   - Verify API keys are set in environment variables

2. **Speech Recognition Not Working**
   - Use HTTPS or localhost (required for Web Speech API)
   - Check browser compatibility (Chrome/Edge recommended)
   - Ensure microphone permissions are granted

3. **Text-to-Speech Issues**
   - Verify Murf AI API key is valid
   - Check internet connection
   - In development mode, mock audio will be used

4. **AI Responses Not Working**
   - Ensure at least one AI provider API key is configured
   - Check API key validity and quota
   - Monitor browser console for error messages

### Browser Compatibility

- **Chrome 80+** ✅ (Recommended)
- **Edge 80+** ✅
- **Firefox 75+** ⚠️ (Limited speech features)
- **Safari 14+** ⚠️ (Limited speech features)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for GPT-4 API
- [Google](https://ai.google.dev/) for Gemini API
- [Murf AI](https://murf.ai/) for text-to-speech services
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations

## 📧 Support

If you encounter any issues or have questions, please:

1. Check the [troubleshooting section](#-troubleshooting)
2. Search existing [GitHub issues](https://github.com/your-username/vocamate/issues)
3. Create a new issue with detailed information

---

**Made with ❤️ by [Your Name]**

**🌟 If you found this project helpful, please give it a star!**
