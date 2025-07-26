import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';

const ErrorBoundary = ({ 
  error, 
  onRetry, 
  isNetworkError = false,
  darkMode = false 
}) => {
  return (
    <motion.div
      className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <motion.div
          className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isNetworkError 
              ? 'bg-orange-100 dark:bg-orange-900/20' 
              : 'bg-red-100 dark:bg-red-900/20'
          }`}
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {isNetworkError ? (
            <WifiOff className={`w-8 h-8 ${
              darkMode ? 'text-orange-400' : 'text-orange-600'
            }`} />
          ) : (
            <AlertTriangle className={`w-8 h-8 ${
              darkMode ? 'text-red-400' : 'text-red-600'
            }`} />
          )}
        </motion.div>

        {/* Error Title */}
        <motion.h2
          className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {isNetworkError ? 'Connection Problem' : 'Something went wrong'}
        </motion.h2>

        {/* Error Message */}
        <motion.p
          className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isNetworkError 
            ? 'Unable to connect to the VocaMate server. Please check your internet connection and try again.'
            : error || 'An unexpected error occurred. Please try again or refresh the page.'
          }
        </motion.p>

        {/* Retry Button */}
        <motion.button
          onClick={onRetry}
          className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isNetworkError
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-primary-500 hover:bg-primary-600 text-white'
          } shadow-lg hover:shadow-xl`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {isNetworkError ? 'Retry Connection' : 'Try Again'}
        </motion.button>

        {/* Additional Help */}
        <motion.div
          className="mt-6 text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {isNetworkError ? (
            <div>
              <p>If the problem persists:</p>
              <ul className="mt-2 text-left inline-block">
                <li>• Check your internet connection</li>
                <li>• Verify the backend server is running</li>
                <li>• Try refreshing the page</li>
              </ul>
            </div>
          ) : (
            <p>
              If this keeps happening, try refreshing the page or contact support.
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ErrorBoundary;
