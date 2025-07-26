import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Volume2 } from 'lucide-react';

const ChatMessage = ({ message, isUser, onPlayAudio, audioLoading, darkMode }) => {
  const handlePlayAudio = () => {
    if (!isUser && onPlayAudio) {
      onPlayAudio(message.content);
    }
  };

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`flex max-w-xs lg:max-w-md xl:max-w-lg ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        } items-end space-x-2`}
      >
        {/* Avatar */}
        <motion.div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-primary-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
          whileHover={{ scale: 1.1 }}
        >
          {isUser ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </motion.div>

        {/* Message Bubble */}
        <motion.div
          className={`relative px-4 py-2 rounded-2xl ${
            isUser
              ? 'bg-primary-500 text-white rounded-br-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
          } shadow-chat dark:shadow-chat-dark`}
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          
          {/* Timestamp */}
          <div className={`text-xs mt-1 ${
            isUser 
              ? 'text-primary-100' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>

          {/* Audio Button for AI messages */}
          {!isUser && (
            <motion.button
              onClick={handlePlayAudio}
              disabled={audioLoading}
              className={`absolute -right-2 -bottom-2 w-6 h-6 rounded-full flex items-center justify-center ${
                audioLoading
                  ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-accent-500 hover:bg-accent-600 text-white cursor-pointer'
              } shadow-lg transition-all duration-200`}
              whileHover={!audioLoading ? { scale: 1.1 } : {}}
              whileTap={!audioLoading ? { scale: 0.9 } : {}}
              title={audioLoading ? "Loading audio..." : "Play message"}
            >
              {audioLoading ? (
                <motion.div 
                  className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <Volume2 className="w-3 h-3" />
              )}
            </motion.button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
