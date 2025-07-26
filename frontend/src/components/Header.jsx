import React from 'react';
import logo from '../logo.png';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const Header = ({ 
  darkMode, 
  toggleDarkMode, 
  language, 
  setLanguage, 
  aiProvider, 
  setAiProvider,
  languages,
  providers,
  selectedVoice,
  setSelectedVoice,
  availableVoices,
  voiceSettings,
  setVoiceSettings
}) => {
  return (
    <motion.header 
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.02 }}
        >
          <img
            src={logo}
            alt="VocaMate Logo"
            className="w-8 h-8 rounded-lg object-contain bg-white"
            style={{ background: 'white' }}
          />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            VocaMate
          </h1>
        </motion.div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:block">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden sm:block">
            <select
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {providers.map((provider) => (
                <option 
                  key={provider.id} 
                  value={provider.id}
                  disabled={!provider.available}
                >
                  {provider.name} {!provider.available && '(Unavailable)'}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden sm:block">
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              title="Select Voice"
            >
              {availableVoices.map((voice) => (
                <option key={voice.voiceId || voice.id} value={voice.voiceId || voice.id}>
                  {voice.displayName || voice.name} ({voice.locale || voice.language})
                </option>
              ))}
            </select>
          </div>

          <motion.button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>

      <div className="sm:hidden mt-3 flex items-center space-x-3">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        <select
          value={aiProvider}
          onChange={(e) => setAiProvider(e.target.value)}
          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {providers.map((provider) => (
            <option 
              key={provider.id} 
              value={provider.id}
              disabled={!provider.available}
            >
              {provider.name} {!provider.available && '(Unavailable)'}
            </option>
          ))}
        </select>

        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {availableVoices.map((voice) => (
            <option key={voice.voiceId || voice.id} value={voice.voiceId || voice.id}>
              {voice.displayName || voice.name}
            </option>
          ))}
        </select>
      </div>
    </motion.header>
  );
};

export default Header;
