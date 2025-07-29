import { Leva } from 'leva';
import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useMediaQuery } from 'react-responsive';
import { PerspectiveCamera } from '@react-three/drei';

import Cube from '../components/Cube.jsx';
import Rings from '../components/Rings.jsx';
import ReactLogo from '../components/ReactLogo.jsx';
import Button from '../components/Button.jsx';
import Target from '../components/Target.jsx';
import CanvasLoader from '../components/Loading.jsx';
import HeroCamera from '../components/HeroCamera.jsx';
import { calculateSizes } from '../constants/index.js';
import Robot from '../components/Robot.jsx';
import RobotAvatar from '../components/RobotAvatar.jsx';
import RobotDialog from '../components/RobotDialog.jsx';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Use media queries to determine screen size
  const isSmall = useMediaQuery({ maxWidth: 440 });
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });

  const sizes = calculateSizes(isSmall, isMobile, isTablet);

  // Trigger entrance animations
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Calculate robot position and scale based on screen size
  const getRobotProps = () => {
    if (isSmall) return { position: [0, -1, 0], scale: [0.8, 0.8, 0.8] }; // Center on mobile
    if (isMobile) return { position: [0, -0.5, 0], scale: [1, 1, 1] }; // Center on mobile
    if (isTablet) return { position: [8, 0, 0], scale: [1.4, 1.4, 1.4] }; // Move further right
    return { position: [10, 0.5, 0], scale: [1.8, 1.8, 1.8] }; // Move much further right
  };

  const robotProps = getRobotProps();

  const handleDialogToggle = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <section className="min-h-screen w-full flex flex-col relative overflow-hidden" id="home">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40 pointer-events-none z-10" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-orb floating-orb-1" />
        <div className="floating-orb floating-orb-2" />
        <div className="floating-orb floating-orb-3" />
      </div>

      {/* Hero Content - Fixed responsive spacing */}
      <div className={`w-full mx-auto flex flex-col justify-center min-h-screen px-4 sm:px-8 lg:px-16 relative z-20 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Introduction with enhanced styling - Better responsive spacing */}
        <div className="text-center space-y-3 sm:space-y-4 lg:space-y-6">
          <p className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-medium text-white font-generalsans animate-slide-in-left">
            Hi, I am <span className="text-shimmer font-bold">Ing Zhen</span> 
            <span className="waving-hand ml-2">👋</span>
          </p>
          
          <div className="hero_tag text-gray_gradient animate-slide-in-right">
            <span className="inline-block">Software</span>
            <span className="inline-block ml-2 sm:ml-4 text-blue-400">Engineer</span>
          </div>
          
          {/* Animated subtitle - Better responsive text */}
          <p className={`text-neutral-300 text-sm sm:text-base lg:text-lg font-light max-w-sm sm:max-w-lg lg:max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Crafting digital experiences with modern technologies and innovative solutions
          </p>
        </div>

        {/* Floating skill badges - Better responsive spacing */}
        <div className={`flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 lg:mt-12 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {['Software Development', 'Database Design', 'System Architecture', 'AI & ML', 'Cloud Computing'].map((skill, index) => (
            <span 
              key={skill}
              className={`skill-badge text-xs sm:text-sm ${index % 2 === 0 ? 'animate-slide-in-left' : 'animate-slide-in-right'}`}
              style={{ animationDelay: `${0.7 + index * 0.1}s` }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Enhanced 3D Canvas with Robot */}
      <div className="w-full h-full absolute inset-0 z-0">
        <Canvas className="w-full h-full">
          <Suspense fallback={<CanvasLoader />}>
            <Leva hidden />
            <PerspectiveCamera makeDefault position={[0, 0, 30]} />
            
            {/* Enhanced lighting setup for robot */}
            <ambientLight intensity={0.7} />
            <directionalLight 
              position={[10, 10, 10]} 
              intensity={1.2} 
              castShadow 
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <pointLight position={[-10, -10, -10]} color="#0066ff" intensity={0.5} />
            <spotLight 
              position={[5, 10, 5]} 
              angle={0.4} 
              penumbra={1} 
              intensity={1} 
              color="#ffffff" 
              castShadow
            />
            
            {/* Robot with HeroCamera for mouse interaction */}
            <HeroCamera isMobile={isMobile}>

            </HeroCamera>

            {/* Supporting 3D elements positioned around the robot */}
            <group>
              <Target position={[sizes.targetPosition[0] - 6, sizes.targetPosition[1] - 2, sizes.targetPosition[2] - 3]} />
              <ReactLogo position={[sizes.reactLogoPosition[0] - 4, sizes.reactLogoPosition[1] + 1, sizes.reactLogoPosition[2] - 2]} />
              <Rings position={[sizes.ringPosition[0] - 7, sizes.ringPosition[1] - 1, sizes.ringPosition[2] - 4]} />
              <Cube position={[sizes.cubePosition[0] + 5, sizes.cubePosition[1] + 1, sizes.cubePosition[2] - 2]} />  
            </group>
          </Suspense>
        </Canvas>
      </div>

      {/* Interactive CTA Section - Better positioning */}
      <div className={`absolute bottom-4 sm:bottom-7 left-0 right-0 w-full z-20 px-4 sm:px-8 transition-all duration-1000 delay-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          {/* Robot interaction hint */}
          <div className={`text-center text-neutral-400 text-xs sm:text-sm transition-all duration-1000 delay-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <p className="hover:text-blue-400 transition-colors duration-300">
              🤖 Move your mouse to interact with the robot
            </p>
          </div>
          
          {/* Enhanced CTA button */}
          <a href="#about" className="w-fit group">
            <Button 
              name="Get Started" 
              isBeam 
              containerClass="sm:w-fit w-full sm:min-w-96 magnetic-btn hover-glow glass-effect" 
            />
          </a>
        </div>
      </div>

      {/* Interactive Robot Avatar - Bottom Right */}
      <RobotAvatar 
        onDialogToggle={handleDialogToggle}
        isDialogOpen={isDialogOpen}
      />
W
      {/* Particle effects */}
      <div className="particles-container">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className={`particle particle-${(i % 6) + 1}`}
            style={{
              animationDelay: `${i * 2}s`,
              left: `${10 + i * 12}%`
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;