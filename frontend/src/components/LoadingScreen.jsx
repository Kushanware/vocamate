import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ message = "Loading VocaMate..." }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 flex items-center justify-center z-50">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div
          className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6"
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
          <img
            src={require('../logo.png')}
            alt="VocaMate Logo"
            className="w-16 h-16 object-contain"
            style={{ background: 'white', borderRadius: '1rem' }}
          />
        </motion.div>

        {/* Loading Spinner */}
        <motion.div
          className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Loading Text */}
        <motion.h2
          className="text-xl font-semibold text-white mb-2"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {message}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-white/80 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Your AI Voice Assistant
        </motion.p>

        {/* Loading Dots */}
        <motion.div
          className="flex justify-center space-x-1 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white rounded-full"
              animate={{ 
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
