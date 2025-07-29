<div align="center">
  <br />
    <a href="https://github.com/ingzhenhao/threejs-portfolio" target="_blank">
      <img src="https://github.com/user-attachments/assets/2afc2dc3-f840-4d98-9378-f34acd7df173" alt="Project Banner">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-React_JS-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react.js" />
    <img src="https://img.shields.io/badge/-Three_JS-black?style=for-the-badge&logoColor=white&logo=threedotjs&color=000000" alt="three.js" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-EmailJS-black?style=for-the-badge&logoColor=white&logo=emailjs&color=FF6B35" alt="emailjs" />
  </div>

  <h3 align="center">Ing Zhen's Interactive 3D Portfolio</h3>

   <div align="center">
     A modern, interactive portfolio showcasing software engineering skills with stunning 3D animations, responsive design, and an AI-powered robot assistant.
    </div>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🕸️ [Snippets (Code to Copy)](#snippets)
6. 🔗 [Links](#links)
7. 📦 [Assets](#assets)
8. 🚀 [More](#more)

## 🤖 Introduction

Built with React.js for handling the user interface, Three.js for rendering 3D elements, and styled with TailwindCSS, this interactive 3D portfolio showcases modern software engineering skills through immersive experiences. The portfolio features custom projects, interactive animations, an AI-powered robot assistant, and a seamless user experience designed to leave a lasting impression.

**"Debugging the world one line of code at a time"** - This portfolio represents Ing Zhen's journey as a Software Engineer specializing in Software Development, Database Design, System Architecture, AI & ML, and Cloud Computing.

## 🙏 Credits & Acknowledgments

This portfolio was built following the excellent tutorial by **Adrian Hajdin** from [JavaScript Mastery](https://www.youtube.com/@javascriptmastery). The original tutorial provided the foundation for this project, which has been extensively customized with personal projects, unique styling, and additional features like the AI robot assistant.

- **Original Tutorial**: [Build a 3D Developer Portfolio](https://youtu.be/kt0FrkQgw8w)
- **Instructor**: Adrian Hajdin
- **Channel**: [JavaScript Mastery](https://www.youtube.com/@javascriptmastery)

Special thanks to the JavaScript Mastery community for the comprehensive learning resources and support!

## <a name="tech-stack">⚙️ Tech Stack</a>

- **Frontend**: React.js, Three.js, React Three Fiber
- **Styling**: Tailwind CSS
- **3D Libraries**: React Three Drei
- **Animations**: Framer Motion, GSAP
- **Email Service**: EmailJS
- **Build Tool**: Vite
- **Deployment**: GitHub Pages

## <a name="features">🔋 Features</a>

👉 **Immersive Hero Section**: Eye-catching 3D scene with interactive elements that respond to mouse movements, featuring animated floating orbs and particle effects.

👉 **AI Robot Assistant**: Interactive 3D robot avatar positioned in the bottom-right corner with:

- Self-contained dialog management
- Floating animation that follows scroll
- Mouse-responsive interactions
- Multi-step conversation flow
- Smooth entrance animations

👉 **Interactive About Me**: A sleek bento grid layout featuring personal info, a 3D globe pinpointing location, tech stack icons, and a one-click email copy option.

👉 **Dynamic Project Showcase**: Browse through custom projects with live demos displayed inside a 3D computer model, featuring smooth transitions and interactive elements.

👉 **Engaging Experience Timeline**: Interactive career milestones with 3D animations that showcase professional growth and technical expertise.

👉 **Professional Skills Display**: Floating skill badges showcasing expertise in:

- Software Development
- Database Design
- System Architecture
- AI & ML
- Cloud Computing

👉 **Contact Integration**: Fully functional contact form powered by EmailJS for seamless communication.

👉 **Enhanced Visual Effects**:

- Gradient overlays and backdrop blur effects
- Animated floating orbs and particles
- Professional lighting setup for 3D elements
- Smooth hover transitions and micro-interactions

👉 **Clean Footer**: A minimalist design featuring social media links for easy networking.

👉 **Fully Responsive**: Optimized layout ensuring a smooth experience across all devices, from desktop to mobile, with responsive robot positioning and adaptive 3D element scaling.

and many more, including advanced code architecture, component reusability, and performance optimizations.

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/ingzhenhao/threejs-portfolio.git
cd threejs-portfolio
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
VITE_APP_EMAILJS_USERID=your_emailjs_user_id
VITE_APP_EMAILJS_TEMPLATEID=your_emailjs_template_id
VITE_APP_EMAILJS_RECEIVERID=your_emailjs_service_id
```

Replace the placeholder values with your actual EmailJS credentials. You can obtain these credentials by signing up on the [EmailJS website](https://www.emailjs.com/).

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the project.

## <a name="snippets">🕸️ Snippets</a>

<details>
<summary><code>components/RobotAvatar.jsx</code> - Interactive Robot Assistant</summary>

```jsx
const RobotAvatar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const containerRef = useRef();

  return (
    <>
      <div
        ref={containerRef}
        className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-20 cursor-pointer transform transition-all duration-600 ${
          isHovered ? 'scale-110' : 'scale-100'
        } animate-slide-in-bottom`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={handleDialogToggle}>
        {/* 3D Robot Canvas */}
        <Canvas className="w-full h-full">
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0.5, 4]} fov={75} />
            <ambientLight intensity={1} />
            <directionalLight position={[2, 2, 2]} intensity={1.2} />
            <InteractiveRobotAvatar
              mousePosition={mousePosition}
              isHovered={isHovered}
              isDialogOpen={isDialogOpen}
              onLoad={() => setIsLoaded(true)}
            />
          </Suspense>
        </Canvas>
      </div>

      <RobotDialog isVisible={isDialogOpen} onClose={handleDialogClose} />
    </>
  );
};
```

</details>

<details>
<summary><code>sections/Hero.jsx</code> - Hero Section with Skills</summary>

```jsx
<div className="text-center space-y-3 sm:space-y-4 lg:space-y-6">
  <p className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-medium text-white font-generalsans text-center animate-slide-in-left">
    Hi, I am <span className="text-shimmer font-bold">Ing Zhen</span>
    <span className="waving-hand">👋</span>
  </p>

  <div className="hero_tag text-gray_gradient animate-slide-in-right text-center">
    <span className="inline-block">Software</span>
    <span className="inline-block ml-2 sm:ml-4 text-blue-400">Engineer</span>
  </div>

  <p className="text-neutral-300 text-sm sm:text-base lg:text-lg font-light max-w-sm sm:max-w-lg lg:max-w-2xl mx-auto leading-relaxed text-center">
    Debugging the world one line of code at a time
  </p>
</div>;

{
  /* Skills Badges */
}
<div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 lg:mt-12">
  {['Software Development', 'Database Design', 'System Architecture', 'AI & ML', 'Cloud Computing'].map(
    (skill, index) => (
      <span
        key={skill}
        className={`skill-badge text-xs sm:text-sm ${index % 2 === 0 ? 'animate-slide-in-left' : 'animate-slide-in-right'}`}
        style={{ animationDelay: `${0.7 + index * 0.1}s` }}>
        {skill}
      </span>
    ),
  )}
</div>;
```

</details>

<details>
<summary><code>tailwind.config.js</code></summary>

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        generalsans: ['General Sans', 'sans-serif'],
      },
      colors: {
        black: {
          DEFAULT: '#000',
          100: '#010103',
          200: '#0E0E10',
          300: '#1C1C21',
          500: '#3A3A49',
          600: '#1A1A1A',
        },
        white: {
          DEFAULT: '#FFFFFF',
          800: '#E4E4E6',
          700: '#D6D9E9',
          600: '#AFB0B6',
          500: '#62646C',
        },
      },
      backgroundImage: {
        terminal: "url('/assets/terminal.png')",
      },
    },
  },
  plugins: [],
};
```

</details>

<details>
<summary><code>index.css</code> - Custom Animations</summary>

```css
@import url('https://fonts.cdnfonts.com/css/general-sans');

.waving-hand {
  animation-name: wave-animation;
  animation-duration: 2.5s;
  animation-iteration-count: infinite;
  transform-origin: 70% 70%;
  display: inline-block;
}

.skill-badge {
  @apply px-3 py-1 bg-black-300 border border-blue-400/30 rounded-full text-blue-400 hover:bg-blue-400/10 transition-all duration-300;
}

.text-shimmer {
  background: linear-gradient(45deg, #ffffff, #60a5fa, #ffffff);
  background-size: 200% 200%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes wave-animation {
  0% {
    transform: rotate(0deg);
  }
  15% {
    transform: rotate(14deg);
  }
  30% {
    transform: rotate(-8deg);
  }
  40% {
    transform: rotate(14deg);
  }
  50% {
    transform: rotate(-4deg);
  }
  60% {
    transform: rotate(10deg);
  }
  70% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
```

</details>

## 🌟 Live Demo

Check out the live portfolio: [https://ingzhenhao.github.io/threejs-portfolio](https://ingzhenhao.github.io/threejs-portfolio)

## 📂 Project Structure

```
src/
├── components/          # Reusable 3D components
│   ├── Robot.jsx       # 3D Robot model
│   ├── RobotAvatar.jsx # Interactive robot assistant
│   ├── RobotDialog.jsx # Robot conversation interface
│   ├── Button.jsx      # Custom button component
│   ├── Cube.jsx        # Interactive 3D cube
│   ├── HeroCamera.jsx  # Camera controls
│   ├── Loading.jsx     # Loading spinner
│   ├── ReactLogo.jsx   # Animated React logo
│   ├── Rings.jsx       # Animated rings
│   └── Target.jsx      # Target element
├── sections/           # Page sections
│   ├── About.jsx       # About section
│   ├── Contact.jsx     # Contact form
│   ├── Experience.jsx  # Work experience
│   ├── Footer.jsx      # Footer
│   ├── Hero.jsx        # Hero section with robot
│   ├── Navbar.jsx      # Navigation
│   └── Projects.jsx    # Projects showcase
├── constants/          # App constants
│   └── index.js        # Navigation, projects, experience data
├── hooks/              # Custom hooks
│   └── useAlert.js     # Alert hook
└── App.jsx             # Main app component
```

## 🎨 Unique Features

### Interactive Robot Assistant

- **Self-Contained**: Manages its own dialog state independently
- **Scroll-Fixed**: Stays in position during page scrolling
- **Mouse Responsive**: Reacts to mouse movements with dynamic rotations
- **Conversation Flow**: Multi-step dialog system with navigation
- **Smooth Animations**: Floating, hover, and entrance animations

### Advanced Visual Effects

- **Gradient Overlays**: Multiple layered gradients for depth
- **Particle System**: Animated floating particles
- **Professional Lighting**: Three.js lighting setup for realistic 3D rendering
- **Responsive Scaling**: Adaptive sizing across all device types

## 🚀 Performance Optimizations

- **DPR Limiting**: Pixel ratio limits for better performance
- **Suspense Loading**: Proper loading states for 3D components
- **Optimized Animations**: Reduced animation ranges for smooth performance
- **Responsive Media Queries**: Device-specific optimizations

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

- **Portfolio**: [https://github.com/codingwithiz/ThreeJS-Portfolio/](https://github.com/codingwithiz/ThreeJS-Portfolio/)
- **GitHub**: [@codingwithiz](https://github.com/codingwithiz)
- **Email**: Contact through the portfolio contact form

---

⭐ If you found this project helpful, please give it a star on GitHub!

**Built with ❤️ by Ing Zhen - Software Engineer**
