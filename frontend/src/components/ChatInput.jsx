import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Square } from 'lucide-react';

const ChatInput = ({ 
  onSendMessage, 
  disabled, 
  language,
  darkMode 
}) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [handsFree, setHandsFree] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const lastBotReplyRef = useRef('');

  // Check for speech recognition support
  useEffect(() => {
    setSpeechSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Stop any ongoing recognition when component unmounts
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition on unmount:', error);
        }
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Hands-free mode: continuous recognition and TTS
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'es': 'es-ES',
        'fr': 'fr-FR',
        'de': 'de-DE'
      }[language] || 'en-US';
      window.speechSynthesis.speak(utter);
    }
  };

  // Listen for bot reply and speak it in hands-free mode
  useEffect(() => {
    if (!handsFree) return;
    // Listen for new bot reply (assume parent passes latest bot reply as prop or via context)
    // For demo, you may need to wire this up to your chat state.
    // Example: if (lastBotReply !== lastBotReplyRef.current) { ... }
    // Here, just a placeholder for integration.
  }, [handsFree]);

  const startRecognition = () => {
    try {
      setMessage('');
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = handsFree; // continuous in hands-free mode
      recognitionRef.current.interimResults = true;
      const speechLang = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'es': 'es-ES',
        'fr': 'fr-FR',
        'de': 'de-DE'
      };
      recognitionRef.current.lang = speechLang[language] || 'en-US';
      let finalTranscript = '';
      let timeoutRef = null;

      const clearRecTimeout = () => {
        if (timeoutRef) clearTimeout(timeoutRef);
        timeoutRef = null;
      };

      recognitionRef.current.onresult = (event) => {
        clearRecTimeout();
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setMessage(finalTranscript + interim);
      };

      recognitionRef.current.onend = () => {
        clearRecTimeout();
        setIsListening(false);
        if (finalTranscript.trim()) {
          onSendMessage(finalTranscript.trim(), true);
          setMessage('');
          if (handsFree) {
            setTimeout(() => {
              startRecognition();
            }, 0);
          }
        } else if (handsFree) {
          setTimeout(() => {
            startRecognition();
          }, 0);
        }
      };

      recognitionRef.current.onerror = (event) => {
        clearRecTimeout();
        setIsListening(false);
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          alert('No speech was detected. Please try again.');
        } else if (event.error === 'audio-capture') {
          alert('No microphone was found or microphone is disabled. Please check your settings.');
        } else if (event.error === 'not-allowed') {
          alert('Microphone permission was denied. Please allow microphone access and try again.');
        }
        if (handsFree) {
          setTimeout(() => {
            startRecognition();
          }, 400);
        }
      };

      recognitionRef.current.onaudiostart = () => {
        clearRecTimeout();
      };

      // Timeout for no audio
      timeoutRef = setTimeout(() => {
        if (recognitionRef.current && isListening && !message.trim()) {
          console.warn('No audio detected, stopping recognition');
          recognitionRef.current.stop();
          alert('No audio detected. Please check your microphone and try again.');
        }
      }, 5000);

      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting recognition:', error);
      alert('Failed to start speech recognition. Please try again.');
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in your browser');
      return;
    }
    if (isListening) {
      try {
        recognitionRef.current?.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Error stopping recognition:', error);
        setIsListening(false);
      }
      return;
    }
    startRecognition();
  };

  const toggleHandsFree = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in your browser');
      return;
    }
    if (handsFree) {
      setHandsFree(false);
      try {
        recognitionRef.current?.stop();
        setIsListening(false);
      } catch (error) {
        setIsListening(false);
      }
    } else {
      setHandsFree(true);
      startRecognition();
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="max-w-full sm:max-w-4xl mx-auto px-2 sm:px-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 sm:gap-3">
            {/* Speech Recognition Button & Hands-Free Toggle */}
            <AnimatePresence>
              {speechSupported && (
                <>
                  <motion.button
                    type="button"
                    onClick={toggleListening}
                    disabled={disabled || handsFree}
                    className={`flex-shrink-0 p-3 rounded-full transition-all duration-200 ${
                      isListening && !handsFree
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
                    } ${disabled || handsFree ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    whileHover={!disabled && !handsFree ? { scale: 1.05 } : {}}
                    whileTap={!disabled && !handsFree ? { scale: 0.95 } : {}}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {isListening && !handsFree ? (
                      <Square className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={toggleHandsFree}
                    disabled={disabled}
                    className={`flex-shrink-0 p-3 ml-2 rounded-full transition-all duration-200 ${
                      handsFree
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    whileHover={!disabled ? { scale: 1.05 } : {}}
                    whileTap={!disabled ? { scale: 0.95 } : {}}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {handsFree ? (
                      <span role="img" aria-label="Hands Free">👐</span>
                    ) : (
                      <span role="img" aria-label="Start Hands Free">🤖</span>
                    )}
                  </motion.button>
                </>
              )}
            </AnimatePresence>

            {/* Message Input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? "Listening..." : "Type your message or use voice input..."}
                disabled={disabled || isListening}
                className={`w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all duration-200 ${
                  disabled || isListening ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                style={{
                  minHeight: '50px',
                  maxHeight: '120px'
                }}
              />
              
              {/* Character count */}
              <div className="absolute bottom-1 right-12 text-xs text-gray-400 dark:text-gray-500">
                {message.length}/1000
              </div>
            </div>

            {/* Send Button */}
            <motion.button
              type="submit"
              disabled={!message.trim() || disabled}
              className={`flex-shrink-0 p-3 rounded-full transition-all duration-200 ${
                message.trim() && !disabled
                  ? 'bg-primary-500 hover:bg-primary-600 text-white cursor-pointer'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
              whileHover={message.trim() && !disabled ? { scale: 1.05 } : {}}
              whileTap={message.trim() && !disabled ? { scale: 0.95 } : {}}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Listening Indicator */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span>Listening...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Help Text */}
        <motion.div
          className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Press Enter to send • Shift+Enter for new line {speechSupported && '• Click mic for voice input • 🤖 for hands-free'}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChatInput;