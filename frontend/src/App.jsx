import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Header from './components/Header';
import ChatContainer from './components/ChatContainer';
import ChatInput from './components/ChatInput';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import LoadingScreen from './components/LoadingScreen';

// API
import { chatAPI, speechAPI, checkBackendHealth } from './api';

// CSS
import './index.css';

function App() {
  // App State
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [aiProvider, setAiProvider] = useState('gemini');
  const [backendConnected, setBackendConnected] = useState(null);
  const [error, setError] = useState(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [voiceSettings, setVoiceSettings] = useState({
    pitch: 1.0,
    rate: 1.0,
    style: 'conversational'
  });

  // Load available voices
  const loadVoices = useCallback(async () => {
    try {
      const response = await speechAPI.getVoices();
      if (response.success && response.voices) {
        setAvailableVoices(response.voices);
        // Set default voice if none selected
        if (!selectedVoice && response.voices.length > 0) {
          setSelectedVoice(response.voices[0].voiceId || response.voices[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load voices:', error);
    }
  }, [selectedVoice]);

  // Configuration State
  const [languages, setLanguages] = useState([
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' }
  ]);
  const [providers, setProviders] = useState([
    { id: 'gemini', name: 'Google Gemini 1.5 Flash', available: true },
    { id: 'openai', name: 'OpenAI GPT-4', available: true }
  ]);

  // Initialize app
  useEffect(() => {
    initializeApp();
    loadUserPreferences();
    checkBackendConnection();
    loadVoices(); // Load available voices
  }, [loadVoices]);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Initialize app data
  const initializeApp = async () => {
    try {
      // Load supported languages
      const languagesResponse = await speechAPI.getLanguages();
      if (languagesResponse.success) {
        setLanguages(languagesResponse.languages);
      }

      // Load available AI providers
      const providersResponse = await chatAPI.getProviders();
      if (providersResponse.success) {
        setProviders(providersResponse.providers);
        
        // Set default provider to first available one
        const availableProvider = providersResponse.providers.find(p => p.available);
        if (availableProvider) {
          setAiProvider(availableProvider.id);
        }
      }
    } catch (err) {
      console.error('Failed to initialize app:', err);
    }
  };

  // Load user preferences from localStorage
  const loadUserPreferences = () => {
    try {
      const savedDarkMode = localStorage.getItem('vocamate_darkMode');
      const savedLanguage = localStorage.getItem('vocamate_language');
      const savedProvider = localStorage.getItem('vocamate_aiProvider');

      if (savedDarkMode !== null) {
        setDarkMode(savedDarkMode === 'true');
      }
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
      if (savedProvider) {
        setAiProvider(savedProvider);
      }
    } catch (err) {
      console.error('Failed to load user preferences:', err);
    }
  };

  // Check backend connection
  const checkBackendConnection = async () => {
    try {
      const isConnected = await checkBackendHealth();
      setBackendConnected(isConnected);
      if (!isConnected) {
        setError('Backend server is not accessible');
      } else {
        setError(null);
      }
    } catch (err) {
      setBackendConnected(false);
      setError('Failed to connect to backend server');
    }
  };

  // Save user preferences
  const saveUserPreferences = useCallback(() => {
    try {
      localStorage.setItem('vocamate_darkMode', darkMode.toString());
      localStorage.setItem('vocamate_language', language);
      localStorage.setItem('vocamate_aiProvider', aiProvider);
    } catch (err) {
      console.error('Failed to save user preferences:', err);
    }
  }, [darkMode, language, aiProvider]);

  useEffect(() => {
    saveUserPreferences();
  }, [saveUserPreferences]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Send message to AI
  const handleSendMessage = async (messageText, wasVoiceInput = false) => {
    if (!messageText.trim() || loading) return;
    setIsVoiceMode(wasVoiceInput);

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    // Add user message immediately
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);
    setError(null);

    try {
      // Prepare conversation context (last 10 messages to avoid token limits)
      const conversationContext = newMessages
        .slice(-10)
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));

      // Get AI response
      const response = await chatAPI.sendMessage(
        conversationContext,
        aiProvider,
        language
      );

      if (response.success) {
        const aiMessage = {
          role: 'assistant',
          content: response.message,
          timestamp: new Date().toISOString(),
          provider: response.provider,
          model: response.model
        };

        setMessages(prev => [...prev, aiMessage]);

        // Auto-play speech for AI response when in voice mode
        if (wasVoiceInput || isVoiceMode) {
          setTimeout(() => {
            handlePlayAudio(response.message);
          }, 500);
        }
      } else {
        throw new Error(response.error || 'Failed to get AI response');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message);
      
      // Add error message to chat
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Play audio for text with enhanced options
  const handlePlayAudio = async (text) => {
    if (!text || audioLoading) return;

    setAudioLoading(true);
    let audio = null;
    
    try {
      const response = await speechAPI.textToSpeech(text, {
        language,
        voiceId: selectedVoice,
        format: 'MP3',
        encodeAsBase64: true,
        pitch: voiceSettings.pitch,
        rate: voiceSettings.rate,
        style: voiceSettings.style
      });
      
      if (response.success) {
        audio = new Audio();
        
        if (response.audioBase64 && !response.isMock) {
          // Use base64 audio if available
          audio.src = `data:audio/mp3;base64,${response.audioBase64}`;
        } else if (response.audioUrl) {
          // Use audio URL
          audio.src = response.audioUrl;
        } else {
          throw new Error('No audio data received');
        }

        // Set up event handlers before starting playback
        audio.onloadstart = () => console.log('Audio loading started');
        audio.oncanplay = () => console.log('Audio ready to play');
        audio.onplaying = () => console.log('Audio playback started');
        audio.onended = () => {
          console.log('Audio playback completed');
          setAudioLoading(false);
        };
        audio.onerror = (e) => {
          console.error('Audio playback error:', e);
          setAudioLoading(false);
          throw new Error('Audio playback failed');
        };

        // Load and play the audio
        try {
          // Wait for the audio to be loaded
          await new Promise((resolve, reject) => {
            audio.oncanplaythrough = resolve;
            audio.onerror = reject;
            
            // Set a timeout in case loading takes too long
            const timeout = setTimeout(() => {
              reject(new Error('Audio loading timeout'));
            }, 10000); // 10 second timeout
            
            // Clear timeout if loaded successfully
            audio.oncanplaythrough = () => {
              clearTimeout(timeout);
              resolve();
            };
          });
          
          // Start playback
          await audio.play();
        } catch (playError) {
          console.error('Audio playback error:', playError);
          setAudioLoading(false);
          throw playError;
        }
      } else {
        throw new Error('Failed to get audio from speech service');
      }
    } catch (err) {
      console.error('Error playing audio:', err);
      setAudioLoading(false);
      // Show error to user
      setError(err.message || 'Failed to play audio');
    }
  };

 
  const handleRetry = () => {
    setError(null);
    checkBackendConnection();
  };

  
  if (backendConnected === null) {
    return <LoadingScreen message="Connecting to VocaMate..." />;
  }

  
  if (backendConnected === false) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <div className="h-screen flex flex-col">
          <ErrorBoundary 
            error={error}
            isNetworkError={true}
            onRetry={handleRetry}
            darkMode={darkMode}
          />
        </div>
      </div>
    );
  }

  return (
    <GlobalErrorBoundary darkMode={darkMode} onRetry={handleRetry}>
      <div className={darkMode ? 'dark' : ''}>
        <motion.div 
        className="h-screen flex flex-col bg-white dark:bg-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          language={language}
          setLanguage={setLanguage}
          aiProvider={aiProvider}
          setAiProvider={setAiProvider}
          languages={languages}
          providers={providers}
          selectedVoice={selectedVoice}
          setSelectedVoice={setSelectedVoice}
          availableVoices={availableVoices}
          voiceSettings={voiceSettings}
          setVoiceSettings={setVoiceSettings}
        />

        
        <ChatContainer
          messages={messages}
          loading={loading}
          onPlayAudio={handlePlayAudio}
          audioLoading={audioLoading}
          darkMode={darkMode}
          onSendMessage={handleSendMessage}
        />

        
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={loading}
          language={language}
          darkMode={darkMode}
        />

        
        <AnimatePresence>
          {error && !loading && (
            <motion.div
              className="fixed bottom-20 left-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-4 text-white hover:text-red-200"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
    </GlobalErrorBoundary>
  );
}

export default App;
