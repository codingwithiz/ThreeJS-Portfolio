import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import Robot from './Robot.jsx';
import RobotDialog from './RobotDialog.jsx';

// Loading fallback component
const RobotLoader = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
  </div>
);

const RobotAvatar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const containerRef = useRef();

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      setMousePosition({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleDialogToggle = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      {/* Robot Avatar Container */}
      <div
        ref={containerRef}
        className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-20 cursor-pointer transform transition-all duration-600 ${
          isHovered ? 'scale-110' : 'scale-100'
        } animate-slide-in-bottom`}
        style={{
          animation: 'slideInBottom 0.6s ease-out 1s both',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={handleDialogToggle}
      >
        {/* Enhanced glow effect */}
        <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
          isHovered ? 'shadow-2xl shadow-blue-400/40' : 'shadow-lg shadow-blue-400/25'
        }`} />
        
        {/* Enhanced pulse animation */}
        <div className="absolute inset-0 rounded-full bg-blue-400/10 animate-ping" />
        <div className="absolute inset-0 rounded-full bg-blue-400/5 animate-pulse" />
        
        {/* Larger Robot container */}
        <div className={`relative w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-md rounded-full border-2 border-blue-400/30 overflow-hidden transform transition-transform duration-200 ${
          isHovered ? 'scale-105 border-blue-400/50' : 'scale-100'
        }`}>
          {/* Canvas for 3D Robot - Optimized and Properly Centered */}
          <Canvas 
            className="w-full h-full"
            dpr={[1, 1.5]} // Limit pixel ratio for better performance
            performance={{ min: 0.5 }} // Performance optimization
          >
            <Suspense fallback={null}>
              {/* Adjusted camera for better framing - closer and angled slightly down */}
              <PerspectiveCamera makeDefault position={[0, 0.5, 4]} fov={75} />
              
              {/* Simplified lighting for better performance */}
              <ambientLight intensity={1} />
              <directionalLight position={[2, 2, 2]} intensity={1.2} />
              <pointLight position={[-1, -1, -1]} color="#0066ff" intensity={0.6} />
              
              <InteractiveRobotAvatar 
                mousePosition={mousePosition}
                isHovered={isHovered}
                isDialogOpen={isDialogOpen}
                onLoad={() => setIsLoaded(true)}
              />
            </Suspense>
          </Canvas>
          
          {/* Loading overlay */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                <span className="text-xs text-blue-400">Loading...</span>
              </div>
            </div>
          )}
          
          {/* Enhanced notification dot */}
          {!isDialogOpen && (
            <div className="absolute top-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse shadow-lg shadow-green-400/30" />
          )}
          
          {/* Enhanced hover text */}
          {isHovered && !isDialogOpen && (
            <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-200 border border-blue-400/30 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>
              Click to chat!
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes slideInBottom {
            0% {
              opacity: 0;
              transform: translateY(50px) rotate(-180deg) scale(0);
            }
            100% {
              opacity: 1;
              transform: translateY(0) rotate(0deg) scale(1);
            }
          }
        `}</style>
      </div>

      {/* Robot Dialog - Managed by RobotAvatar */}
      <RobotDialog 
        isVisible={isDialogOpen}
        onClose={handleDialogClose}
      />
    </>
  );
};

// Enhanced Interactive Robot component for the avatar - Better positioned to fill circle
const InteractiveRobotAvatar = ({ mousePosition, isHovered, isDialogOpen, onLoad }) => {
  const robotRef = useRef();
  const [loaded, setLoaded] = useState(false);

  useFrame((state) => {
    if (robotRef.current) {
      // Gentle floating animation centered around the new position
      const floatingOffset = Math.sin(state.clock.elapsedTime * 1.5) * 0.06; // Reduced range
      robotRef.current.position.y = -0.2 + floatingOffset; // Moved down to fill bottom gap
      
      // Enhanced mouse-based rotation with more dramatic effects
      if (isHovered && mousePosition) {
        robotRef.current.rotation.y = mousePosition.x * Math.PI * 0.5;
        robotRef.current.rotation.x = mousePosition.y * 0.3;
        robotRef.current.rotation.z = mousePosition.x * 0.15;
      } else {
        // Enhanced idle animation - keeping robot centered
        robotRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.3;
        robotRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
        robotRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      }
      
      // Excited animation when dialog is open - controlled movement
      if (isDialogOpen) {
        robotRef.current.rotation.y += Math.sin(state.clock.elapsedTime * 4) * 0.2;
        // Additional floating animation when dialog is open
        robotRef.current.position.y += Math.sin(state.clock.elapsedTime * 6) * 0.03;
      }

      // Trigger onLoad callback
      if (!loaded) {
        setLoaded(true);
        if (onLoad) onLoad();
      }
    }
  });

  return (
    <group 
      ref={robotRef} 
      position={[0, -0.2, 0]} // Moved down to better fill the circle space
      scale={[1.1, 1.1, 1.1]} // Slightly increased scale to fill more space
    >
      <Robot />
    </group>
  );
};

export default RobotAvatar;