import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RobotDialog = ({ isVisible, onClose, robotRef }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const messages = [
    "👋 Hi there! I'm Ing Zhen's AI assistant!",
    "🚀 Want to explore some cool projects?",
    "💡 I can help you navigate through the portfolio!",
    "🎯 Click on any section to learn more about Ing Zhen's work!",
    "🤖 Move your mouse around me - I love to dance!"
  ];

  useEffect(() => {
    if (isVisible) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, currentMessage]);

  const nextMessage = () => {
    setCurrentMessage((prev) => (prev + 1) % messages.length);
  };

  const prevMessage = () => {
    setCurrentMessage((prev) => (prev - 1 + messages.length) % messages.length);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-44 sm:bottom-52 right-4 sm:right-8 z-30 max-w-xs sm:max-w-sm" // Changed from 'absolute' to 'fixed'
      >
        {/* Enhanced Speech bubble */}
        <div className="relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-md border border-blue-400/30 rounded-2xl p-4 shadow-2xl">
          {/* Tail of speech bubble - adjusted for new position */}
          <div className="absolute -bottom-2 right-12 w-4 h-4 bg-gradient-to-br from-gray-900/95 to-black/95 rotate-45 border-r border-b border-blue-400/30"></div>
          
          {/* Enhanced close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 hover:bg-red-500/20 rounded-full"
          >
            ✕
          </button>

          {/* Message content */}
          <div className="pr-8">
            {isTyping ? (
              <div className="flex items-center space-x-1">
                <div className="text-blue-400 text-sm">Typing</div>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            ) : (
              <motion.p
                key={currentMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-white text-sm leading-relaxed"
              >
                {messages[currentMessage]}
              </motion.p>
            )}
          </div>

          {/* Enhanced navigation buttons */}
          {!isTyping && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={prevMessage}
                className="px-3 py-2 text-xs bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-200 hover:scale-105 border border-blue-400/20"
              >
                ← Prev
              </button>
              
              <div className="flex space-x-1">
                {messages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMessage(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 hover:scale-110 ${
                      index === currentMessage ? 'bg-blue-400 shadow-lg shadow-blue-400/30' : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextMessage}
                className="px-3 py-2 text-xs bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-200 hover:scale-105 border border-blue-400/20"
              >
                Next →
              </button>
            </div>
          )}

          {/* Progress indicator */}
          <div className="mt-3 text-center">
            <span className="text-xs text-gray-400">
              {currentMessage + 1} of {messages.length}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RobotDialog;