import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResumeModal from './ResumeModal.jsx'; // Import the shared component

const RobotDialog = ({ isVisible, onClose, robotRef }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResume, setShowResume] = useState(false);

  // Navigation helper function
  const navigateToSection = (sectionId, delay = 300) => {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, delay);
  };

  // Enhanced navigation with section redirect
  const handleNavigateAndClose = (sectionId, message, delay = 2000) => {
    // Show navigation message first
    setCurrentStep(-1); // Special step for navigation messages
    setNavigationMessage(message);
    
    // Navigate to section
    navigateToSection(sectionId, 300);
    
    // Close dialog after showing the message
    setTimeout(() => {
      onClose();
      setCurrentStep(0); // Reset to main menu
    }, delay);
  };

  const [navigationMessage, setNavigationMessage] = useState("");

  const dialogSteps = [
    {
      message: "Hi there! 👋 I'm Ing Zhen's AI assistant. How can I help you today?",
      options: [
        { 
          text: "Tell me about Ing Zhen", 
          action: () => handleNavigateAndClose('about', "Let me take you to learn more about Ing Zhen! 🚀")
        },
        { text: "View Resume 📄", action: () => setShowResume(true) },
        { 
          text: "Work experience", 
          action: () => handleNavigateAndClose('experience', "Let me show you the professional journey! 💼")
        },
        { 
          text: "Show me projects", 
          action: () => handleNavigateAndClose('work', "Check out these amazing projects! 💻")
        },
        { 
          text: "Professional references", 
          action: () => handleNavigateAndClose('references', "Let me show you the professional references! 👥")
        },
        { 
          text: "Contact information", 
          action: () => handleNavigateAndClose('contact', "Let's get you connected! 📧")
        }
      ]
    },
    {
      message: "Ing Zhen is a passionate Software Engineer specializing in full-stack development, AI/ML, and cloud technologies. Currently pursuing Computer Science degree with hands-on experience at Maxis Berhad! 🚀",
      options: [
        { text: "View Resume 📄", action: () => setShowResume(true) },
        { 
          text: "See work experience", 
          action: () => handleNavigateAndClose('experience', "Taking you to the experience timeline! 💼")
        },
        { 
          text: "View projects", 
          action: () => handleNavigateAndClose('work', "Let's explore the project showcase! 🔍")
        },
        { 
          text: "Professional references", 
          action: () => handleNavigateAndClose('references', "Check out the professional references! 👥")
        },
        { 
          text: "Learn more details", 
          action: () => handleNavigateAndClose('about', "Diving deeper into the story! 📖")
        },
        { text: "Back to main menu", action: () => setCurrentStep(0) }
      ]
    },
    {
      message: "Check out these amazing projects: AmanahBlock (Blockchain Charity), SmartGrow (IoT Plant Care), NiagaMap (AI-GIS), and Employee Connect Suite (HR Platform)! 💻",
      options: [
        { text: "View Resume 📄", action: () => setShowResume(true) },
        { 
          text: "Explore projects in detail", 
          action: () => handleNavigateAndClose('work', "Let's dive into the project showcase! 🔍")
        },
        { 
          text: "See work experience", 
          action: () => handleNavigateAndClose('experience', "Check out the professional experience! 💼")
        },
        { 
          text: "Professional references", 
          action: () => handleNavigateAndClose('references', "View professional references! 👥")
        },
        { text: "Back to main menu", action: () => setCurrentStep(0) }
      ]
    },
    {
      message: "You can reach Ing Zhen at ingzhen2003@gmail.com or connect on LinkedIn. Ready to collaborate on exciting projects! 📧",
      options: [
        { text: "View Resume 📄", action: () => setShowResume(true) },
        { 
          text: "Go to contact form", 
          action: () => handleNavigateAndClose('contact', "Let's get you to the contact section! ✉️")
        },
        { 
          text: "Professional references", 
          action: () => handleNavigateAndClose('references', "Check out the references! 👥")
        },
        { text: "Back to main menu", action: () => setCurrentStep(0) }
      ]
    },
    {
      message: "Professional experience includes Innovation Software Intern at Maxis Berhad, Freelance Web Developer at LTL Global Telecom, and Admin Assistant at Academind Network! 💼",
      options: [
        { text: "View Full Resume 📄", action: () => setShowResume(true) },
        { 
          text: "See experience timeline", 
          action: () => handleNavigateAndClose('experience', "Taking you to the experience section! ⏰")
        },
        { 
          text: "View projects", 
          action: () => handleNavigateAndClose('work', "Let's check out the projects! 💻")
        },
        { 
          text: "Professional references", 
          action: () => handleNavigateAndClose('references', "See professional references! 👥")
        },
        { text: "Back to main menu", action: () => setCurrentStep(0) }
      ]
    },
    // New step specifically for projects
    {
      message: "These projects showcase technical skills across different domains: Blockchain development, IoT systems, AI/ML applications, and full-stack web development! 🚀",
      options: [
        { text: "View Resume 📄", action: () => setShowResume(true) },
        { 
          text: "Explore projects", 
          action: () => handleNavigateAndClose('work', "Let's explore these projects in detail! 🔍")
        },
        { 
          text: "See work experience", 
          action: () => handleNavigateAndClose('experience', "Check out the professional journey! 💼")
        },
        { 
          text: "Professional references", 
          action: () => handleNavigateAndClose('references', "View professional references! 👥")
        },
        { text: "Back to main menu", action: () => setCurrentStep(0) }
      ]
    },
    // New step specifically for experience
    {
      message: "Work experience spans software development, system architecture, and project management across telecommunications, HR tech, and education sectors! 🏢",
      options: [
        { text: "View Full Resume 📄", action: () => setShowResume(true) },
        { 
          text: "See experience details", 
          action: () => handleNavigateAndClose('experience', "Diving into the experience timeline! ⏰")
        },
        { 
          text: "View technical projects", 
          action: () => handleNavigateAndClose('work', "Let's see the technical projects! 💻")
        },
        { 
          text: "Professional references", 
          action: () => handleNavigateAndClose('references', "Check professional references! 👥")
        },
        { text: "Back to main menu", action: () => setCurrentStep(0) }
      ]
    },
    // New step specifically for references
    {
      message: "Professional references include recommendations from supervisors at Maxis Berhad, LTL Global Telecom, and academic mentors who can vouch for technical skills and work ethic! 👥",
      options: [
        { text: "View Full Resume 📄", action: () => setShowResume(true) },
        { 
          text: "See reference details", 
          action: () => handleNavigateAndClose('references', "Viewing detailed references! 📋")
        },
        { 
          text: "View work experience", 
          action: () => handleNavigateAndClose('experience', "Check out the work experience! 💼")
        },
        { 
          text: "View projects", 
          action: () => handleNavigateAndClose('work', "Let's see the technical projects! 💻")
        },
        { text: "Back to main menu", action: () => setCurrentStep(0) }
      ]
    }
  ];

  // Special navigation step
  const navigationStep = {
    message: navigationMessage,
    options: [] // No options during navigation
  };

  // Get current step data
  const currentStepData = currentStep === -1 ? navigationStep : dialogSteps[currentStep];

  return (
    <>
      <div className={`fixed bottom-20 right-4 sm:bottom-24 sm:right-8 z-40 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-md rounded-2xl border border-blue-400/30 shadow-2xl shadow-blue-400/20 p-6 max-w-sm">
          {/* Dialog content */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all duration-300 ${
                currentStep === -1 ? 'bg-green-500' : 'bg-blue-500'
              }`}>
                {currentStep === -1 ? '🚀' : '🤖'}
              </div>
              <p className="text-white text-sm leading-relaxed flex-1">
                {currentStepData.message}
              </p>
            </div>
            
            {/* Show options only if not in navigation mode */}
            {currentStep !== -1 && (
              <div className="space-y-2">
                {currentStepData.options.map((option, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={option.action}
                    className="w-full p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 rounded-lg text-white text-sm transition-all duration-200 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-400/20 text-left group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
                      {option.text}
                    </span>
                  </motion.button>
                ))}
              </div>
            )}
            
            {/* Loading animation during navigation */}
            {currentStep === -1 && (
              <div className="flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-6 h-6 bg-gray-600/50 hover:bg-gray-600/70 rounded-full flex items-center justify-center text-white text-xs transition-colors duration-200"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Use the shared ResumeModal component */}
      <ResumeModal 
        isVisible={showResume} 
        onClose={() => setShowResume(false)} 
      />
    </>
  );
};

export default RobotDialog;