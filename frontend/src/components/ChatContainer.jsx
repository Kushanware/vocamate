import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

const ChatContainer = ({ 
  messages, 
  loading, 
  onPlayAudio, 
  audioLoading, 
  darkMode 
}) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages, loading]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 px-2 sm:px-4 py-6"
    >
      <div className="max-w-full sm:max-w-4xl mx-auto">
        {/* Welcome Message */}
        <AnimatePresence>
          {messages.length === 0 && !loading && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-white font-bold text-xl">VM</span>
              </motion.div>
              
              <motion.h2
                className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Welcome to VocaMate
              </motion.h2>
              
              <motion.p
                className="text-gray-600 dark:text-gray-400 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Your intelligent AI voice assistant. Start a conversation by typing below or using voice input.
              </motion.p>
              
              <motion.div
                className="mt-6 flex flex-wrap justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {[
                  "What's the weather like?",
                  "Tell me a joke",
                  "Help me with coding",
                  "What can you do?"
                ].map((suggestion, index) => (
                  <motion.span
                    key={index}
                    className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-400"
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: darkMode ? '#374151' : '#f3f4f6'
                    }}
                    transition={{ delay: 0.1 * index }}
                  >
                    {suggestion}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Messages */}
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <ChatMessage
              key={`${message.timestamp}-${index}`}
              message={message}
              isUser={message.role === 'user'}
              onPlayAudio={onPlayAudio}
              audioLoading={audioLoading}
              darkMode={darkMode}
            />
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {loading && <TypingIndicator />}
        </AnimatePresence>

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer;
