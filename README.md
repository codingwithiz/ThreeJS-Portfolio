<div align="center">
  <br />
    <a href="https://github.com/codingwithiz/ThreeJS-Portfolio" target="_blank">
      <img src="https://github.com/user-attachments/assets/2afc2dc3-f840-4d98-9378-f34acd7df173" alt="Project Banner">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-React_JS-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react.js" />
    <img src="https://img.shields.io/badge/-Three_JS-black?style=for-the-badge&logoColor=white&logo=threedotjs&color=000000" alt="three.js" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-EmailJS-black?style=for-the-badge&logoColor=white&logo=emailjs&color=FF6B35" alt="emailjs" />
  </div>

  <h3 align="center">Interactive 3D Developer Portfolio</h3>

   <div align="center">
     A modern, interactive portfolio showcasing web development skills with stunning 3D animations and responsive design.
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

Built with React.js for handling the user interface, Three.js for rendering 3D elements, and styled with TailwindCSS, this interactive 3D portfolio showcases modern web development skills through immersive experiences. The portfolio features custom projects, interactive animations, and a seamless user experience designed to leave a lasting impression.

## 🙏 Credits & Acknowledgments

This portfolio was built following the excellent tutorial by **Adrian Hajdin** from [JavaScript Mastery](https://www.youtube.com/@javascriptmastery). The original tutorial provided the foundation for this project, which has been customized with personal projects and styling preferences.

- **Original Tutorial**: [Build a 3D Developer Portfolio](https://youtu.be/kt0FrkQgw8w)
- **Instructor**: Adrian Hajdin
- **Channel**: [JavaScript Mastery](https://www.youtube.com/@javascriptmastery)

Special thanks to the JavaScript Mastery community for the comprehensive learning resources and support!

## <a name="tech-stack">⚙️ Tech Stack</a>

- Node.js
- React.js
- Three.js
- React Three Fiber
- React Three Drei
- Email JS
- Vite
- Tailwind CSS

## <a name="features">🔋 Features</a>

👉 **Immersive Hero**: An eye-catching 3D hacker room that responds to mouse movements, surrounded by animated mini-models.

👉 **Interactive About Me**: A sleek bento grid layout featuring personal info, a 3D globe pinpointing location, tech stack icons, and a one-click email copy option.

👉 **Dynamic Project Showcase**: Browse through custom projects including Employee Connect Suite and Social Media Influencer Analysis, with live demos displayed inside a 3D computer model.

👉 **Engaging Experience Timeline**: Interactive career milestones with 3D animations that showcase professional growth and technical expertise.

👉 **Contact Integration**: Fully functional contact form powered by EmailJS for seamless communication.

👉 **Clean Footer**: A minimalist design featuring social media links for easy networking.

👉 **Fully Responsive**: Optimized layout ensuring a smooth experience across all devices, from desktop to mobile.

and many more, including code architecture and reusability

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/codingwithiz/ThreeJS-Portfolio.git
cd ThreeJS-Portfolio
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
<summary><code>index.css</code></summary>

```css
@import url('https://fonts.cdnfonts.com/css/general-sans');

@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  scroll-behavior: smooth;
}

body {
  background: #010103;
  font-family: 'General Sans', sans-serif;
}

@layer utilities {
  .c-space {
    @apply sm:px-10 px-5;
  }

  .head-text {
    @apply sm:text-4xl text-3xl font-semibold text-gray_gradient;
  }

  .nav-ul {
    @apply flex flex-col items-center gap-4 sm:flex-row md:gap-6 relative z-20;
  }

  .nav-li {
    @apply text-neutral-400 hover:text-white font-generalsans max-sm:hover:bg-black-500 max-sm:w-full max-sm:rounded-md py-2 max-sm:px-5;
  }

  .nav-li_a {
    @apply text-lg md:text-base hover:text-white transition-colors;
  }

  .nav-sidebar {
    @apply absolute left-0 right-0 bg-black-200 backdrop-blur-sm transition-all duration-300 ease-in-out overflow-hidden z-20 mx-auto sm:hidden block;
  }

  .text-gray_gradient {
    @apply bg-gradient-to-r from-[#BEC1CF] from-60% via-[#D5D8EA] via-60% to-[#D5D8EA] to-100% bg-clip-text text-transparent;
  }

  /* button component */
  .btn {
    @apply flex gap-4 items-center justify-center cursor-pointer p-3 rounded-md bg-black-300  transition-all active:scale-95 text-white mx-auto;
  }

  .btn-ping {
    @apply animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75;
  }

  .btn-ping_dot {
    @apply relative inline-flex rounded-full h-3 w-3 bg-green-500;
  }

  /* hero section */
  .hero_tag {
    @apply text-center xl:text-6xl md:text-5xl sm:text-4xl text-3xl font-generalsans font-black !leading-normal;
  }

  /* about section */
  .grid-container {
    @apply w-full h-full border border-black-300 bg-black-200 rounded-lg sm:p-7 p-4 flex flex-col gap-5;
  }

  .grid-headtext {
    @apply text-xl font-semibold mb-2 text-white font-generalsans;
  }

  .grid-subtext {
    @apply text-[#afb0b6] text-base font-generalsans;
  }

  .copy-container {
    @apply cursor-pointer flex justify-center items-center gap-2;
  }

  /* projects section  */
  .arrow-btn {
    @apply w-10 h-10 p-3 cursor-pointer active:scale-95 transition-all rounded-full arrow-gradient;
  }

  .tech-logo {
    @apply w-10 h-10 rounded-md p-2 bg-neutral-100 bg-opacity-10 backdrop-filter backdrop-blur-lg flex justify-center items-center;
  }

  /* clients section */
  .client-container {
    @apply grid md:grid-cols-2 grid-cols-1 gap-5 mt-12;
  }

  .client-review {
    @apply rounded-lg md:p-10 p-5 col-span-1 bg-black-300 bg-opacity-50;
  }

  .client-content {
    @apply flex lg:flex-row flex-col justify-between lg:items-center items-start gap-5 mt-7;
  }

  /*  work experience section */
  .work-container {
    @apply grid lg:grid-cols-3 grid-cols-1 gap-5 mt-12;
  }

  .work-canvas {
    @apply col-span-1 rounded-lg bg-black-200 border border-black-300;
  }

  .work-content {
    @apply col-span-2 rounded-lg bg-black-200 border border-black-300;
  }

  .work-content_container {
    @apply grid grid-cols-[auto_1fr] items-start gap-5  transition-all ease-in-out duration-500 cursor-pointer hover:bg-black-300 rounded-lg sm:px-5 px-2.5;
  }

  .work-content_logo {
    @apply rounded-3xl w-16 h-16 p-2 bg-black-600;
  }

  .work-content_bar {
    @apply flex-1 w-0.5 mt-4 h-full bg-black-300 group-hover:bg-black-500 group-last:hidden;
  }

  /* contact section */
  .contact-container {
    @apply max-w-xl relative z-10 sm:px-10 px-5 mt-12;
  }

  .field-label {
    @apply text-lg text-white-600;
  }

  .field-input {
    @apply w-full bg-black-300 px-5 py-2 min-h-14 rounded-lg placeholder:text-white-500 text-lg text-white-800 shadow-black-200 shadow-2xl focus:outline-none;
  }

  .field-btn {
    @apply bg-black-500 px-5 py-2 min-h-12 rounded-lg shadow-black-200 shadow-2xl flex justify-center items-center text-lg text-white gap-3;
  }

  .field-btn_arrow {
    @apply w-2.5 h-2.5 object-contain invert brightness-0;
  }

  /*  footer */
  .social-icon {
    @apply w-12 h-12 rounded-full flex justify-center items-center bg-black-300 border border-black-200;
  }
}

.waving-hand {
  animation-name: wave-animation;
  animation-duration: 2.5s;
  animation-iteration-count: infinite;
  transform-origin: 70% 70%;
  display: inline-block;
}

.arrow-gradient {
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.1) 10%,
    rgba(255, 255, 255, 0.000025) 50%,
    rgba(255, 255, 255, 0.000025) 50%,
    rgba(255, 255, 255, 0.025) 100%
  );
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

<details>
<summary><code>constants/index.js</code></summary>

```js
export const navLinks = [
  {
    id: 1,
    name: 'Home',
    href: '#home',
  },
  {
    id: 2,
    name: 'About',
    href: '#about',
  },
  {
    id: 3,
    name: 'Work',
    href: '#work',
  },
  {
    id: 4,
    name: 'Contact',
    href: '#contact',
  },
];

export const clientReviews = [
  {
    id: 1,
    name: 'Emily Johnson',
    position: 'Marketing Director at GreenLeaf',
    img: 'assets/review1.png',
    review:
      'Working with Adrian was a fantastic experience. He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched. Highly recommend him for any web dev projects.',
  },
  {
    id: 2,
    name: 'Mark Rogers',
    position: 'Founder of TechGear Shop',
    img: 'assets/review2.png',
    review:
      'Adrian’s expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site, and our online sales have significantly increased since the launch. He’s a true professional! Fantastic work.',
  },
  {
    id: 3,
    name: 'John Dohsas',
    position: 'Project Manager at UrbanTech ',
    img: 'assets/review3.png',
    review:
      'I can’t say enough good things about Adrian. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.',
  },
  {
    id: 4,
    name: 'Ether Smith',
    position: 'CEO of BrightStar Enterprises',
    img: 'assets/review4.png',
    review:
      'Adrian was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations. His skills in both frontend backend dev are top-notch.',
  },
];

export const myProjects = [
  {
    title: 'Podcastr - AI Podcast Platform',
    desc: 'Podcastr is a revolutionary Software-as-a-Service platform that transforms the way podcasts are created. With advanced AI-powered features like text-to-multiple-voices functionality, it allows creators to generate diverse voiceovers from a single text input.',
    subdesc:
      'Built as a unique Software-as-a-Service app with Next.js 14, Tailwind CSS, TypeScript, Framer Motion and Convex, Podcastr is designed for optimal performance and scalability.',
    href: 'https://www.youtube.com/watch?v=zfAb95tJvZQ',
    texture: '/textures/project/project1.mp4',
    logo: '/assets/project-logo1.png',
    logoStyle: {
      backgroundColor: '#2A1816',
      border: '0.2px solid #36201D',
      boxShadow: '0px 0px 60px 0px #AA3C304D',
    },
    spotlight: '/assets/spotlight1.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'Framer Motion',
        path: '/assets/framer.png',
      },
    ],
  },
  {
    title: 'LiveDoc - Real-Time Google Docs Clone',
    desc: 'LiveDoc is a powerful collaborative app that elevates the capabilities of real-time document editing. As an enhanced version of Google Docs, It supports millions of collaborators simultaneously, ensuring that every change is captured instantly and accurately.',
    subdesc:
      'With LiveDoc, users can experience the future of collaboration, where multiple contributors work together in real time without any lag, by using Next.js and Liveblocks newest features.',
    href: 'https://www.youtube.com/watch?v=y5vE8y_f_OM',
    texture: '/textures/project/project2.mp4',
    logo: '/assets/project-logo2.png',
    logoStyle: {
      backgroundColor: '#13202F',
      border: '0.2px solid #17293E',
      boxShadow: '0px 0px 60px 0px #2F6DB54D',
    },
    spotlight: '/assets/spotlight2.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'Framer Motion',
        path: '/assets/framer.png',
      },
    ],
  },
  {
    title: 'CarePulse - Health Management System',
    desc: 'An innovative healthcare platform designed to streamline essential medical processes. It simplifies patient registration, appointment scheduling, and medical record management, providing a seamless experience for both healthcare providers and patients.',
    subdesc:
      'With a focus on efficiency, CarePulse integrantes complex forms and SMS notifications, by using Next.js, Appwrite, Twillio and Sentry that enhance operational workflows.',
    href: 'https://www.youtube.com/watch?v=lEflo_sc82g',
    texture: '/textures/project/project3.mp4',
    logo: '/assets/project-logo3.png',
    logoStyle: {
      backgroundColor: '#60f5a1',
      background:
        'linear-gradient(0deg, #60F5A150, #60F5A150), linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(208, 213, 221, 0.8) 100%)',
      border: '0.2px solid rgba(208, 213, 221, 1)',
      boxShadow: '0px 0px 60px 0px rgba(35, 131, 96, 0.3)',
    },
    spotlight: '/assets/spotlight3.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'Framer Motion',
        path: '/assets/framer.png',
      },
    ],
  },
  {
    title: 'Horizon - Online Banking Platform',
    desc: 'Horizon is a comprehensive online banking platform that offers users a centralized finance management dashboard. It allows users to connect multiple bank accounts, monitor real-time transactions, and seamlessly transfer money to other users.',
    subdesc:
      'Built with Next.js 14 Appwrite, Dwolla and Plaid, Horizon ensures a smooth and secure banking experience, tailored to meet the needs of modern consumers.',
    href: 'https://www.youtube.com/watch?v=PuOVqP_cjkE',
    texture: '/textures/project/project4.mp4',
    logo: '/assets/project-logo4.png',
    logoStyle: {
      backgroundColor: '#0E1F38',
      border: '0.2px solid #0E2D58',
      boxShadow: '0px 0px 60px 0px #2F67B64D',
    },
    spotlight: '/assets/spotlight4.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'Framer Motion',
        path: '/assets/framer.png',
      },
    ],
  },
  {
    title: 'Imaginify - AI Photo Manipulation App',
    desc: 'Imaginify is a groundbreaking Software-as-a-Service application that empowers users to create stunning photo manipulations using AI technology. With features like AI-driven image editing, a payments system, and a credits-based model.',
    subdesc:
      'Built with Next.js 14, Cloudinary AI, Clerk, and Stripe, Imaginify combines cutting-edge technology with a user-centric approach. It can be turned into a side income or even a full-fledged business.',
    href: 'https://www.youtube.com/watch?v=Ahwoks_dawU',
    texture: '/textures/project/project5.mp4',
    logo: '/assets/project-logo5.png',
    logoStyle: {
      backgroundColor: '#1C1A43',
      border: '0.2px solid #252262',
      boxShadow: '0px 0px 60px 0px #635BFF4D',
    },
    spotlight: '/assets/spotlight5.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'Framer Motion',
        path: '/assets/framer.png',
      },
    ],
  },
];

export const calculateSizes = (isSmall, isMobile, isTablet) => {
  return {
    deskScale: isSmall ? 0.05 : isMobile ? 0.06 : 0.065,
    deskPosition: isMobile ? [0.5, -4.5, 0] : [0.25, -5.5, 0],
    cubePosition: isSmall ? [4, -5, 0] : isMobile ? [5, -5, 0] : isTablet ? [5, -5, 0] : [9, -5.5, 0],
    reactLogoPosition: isSmall ? [3, 4, 0] : isMobile ? [5, 4, 0] : isTablet ? [5, 4, 0] : [12, 3, 0],
    ringPosition: isSmall ? [-5, 7, 0] : isMobile ? [-10, 10, 0] : isTablet ? [-12, 10, 0] : [-24, 10, 0],
    targetPosition: isSmall ? [-5, -10, -10] : isMobile ? [-9, -10, -10] : isTablet ? [-11, -7, -10] : [-13, -13, -10],
  };
};

export const workExperiences = [
  {
    id: 1,
    name: 'Framer',
    pos: 'Lead Web Developer',
    duration: '2022 - Present',
    title:
      'Framer serves as my go-to tool for creating interactive prototypes. I use it to bring designs to  life, allowing stakeholders to experience the user flow and interactions before development.',
    icon: '/assets/framer.svg',
    animation: 'victory',
  },
  {
    id: 2,
    name: 'Figma',
    pos: 'Web Developer',
    duration: '2020 - 2022',
    title:
      'Figma is my collaborative design platform of choice. I utilize it to work seamlessly with team members and clients, facilitating real-time feedback and design iterations. Its cloud-based.',
    icon: '/assets/figma.svg',
    animation: 'clapping',
  },
  {
    id: 3,
    name: 'Notion',
    pos: 'Junior Web Developer',
    duration: '2019 - 2020',
    title:
      'Notion helps me keep my projects organized. I use it for project management, task tracking, and as a central hub for documentation, ensuring that everything from design notes to.',
    icon: '/assets/notion.svg',
    animation: 'salute',
  },
];
```

</details>

<details>
<summary><code>components/Cube.js</code></summary>

```js
/*
    Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef, useState } from 'react';
import { Float, useGLTF, useTexture } from '@react-three/drei';

const Cube = ({ ...props }) => {
  const { nodes } = useGLTF('models/cube.glb');

  const texture = useTexture('textures/cube.png');

  const cubeRef = useRef();
  const [hovered, setHovered] = useState(false);

  useGSAP(() => {
    gsap
      .timeline({
        repeat: -1,
        repeatDelay: 0.5,
      })
      .to(cubeRef.current.rotation, {
        y: hovered ? '+=2' : `+=${Math.PI * 2}`,
        x: hovered ? '+=2' : `-=${Math.PI * 2}`,
        duration: 2.5,
        stagger: {
          each: 0.15,
        },
      });
  });

  return (
    <Float floatIntensity={2}>
      <group position={[9, -4, 0]} rotation={[2.6, 0.8, -1.8]} scale={0.74} dispose={null} {...props}>
        <mesh
          ref={cubeRef}
          castShadow
          receiveShadow
          geometry={nodes.Cube.geometry}
          material={nodes.Cube.material}
          onPointerEnter={() => setHovered(true)}>
          <meshMatcapMaterial matcap={texture} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
};

useGLTF.preload('models/cube.glb');

export default Cube;
```

</details>

<details>
<summary><code>components/Ring.js</code></summary>

```js
import { useGSAP } from '@gsap/react';
import { Center, useTexture } from '@react-three/drei';
import gsap from 'gsap';
import { useCallback, useRef } from 'react';

const Rings = ({ position }) => {
  const refList = useRef([]);
  const getRef = useCallback((mesh) => {
    if (mesh && !refList.current.includes(mesh)) {
      refList.current.push(mesh);
    }
  }, []);

  const texture = useTexture('textures/rings.png');

  useGSAP(
    () => {
      if (refList.current.length === 0) return;

      refList.current.forEach((r) => {
        r.position.set(position[0], position[1], position[2]);
      });

      gsap
        .timeline({
          repeat: -1,
          repeatDelay: 0.5,
        })
        .to(
          refList.current.map((r) => r.rotation),
          {
            y: `+=${Math.PI * 2}`,
            x: `-=${Math.PI * 2}`,
            duration: 2.5,
            stagger: {
              each: 0.15,
            },
          },
        );
    },
    {
      dependencies: position,
    },
  );

  return (
    <Center>
      <group scale={0.5}>
        {Array.from({ length: 4 }, (_, index) => (
          <mesh key={index} ref={getRef}>
            <torusGeometry args={[(index + 1) * 0.5, 0.1]}></torusGeometry>
            <meshMatcapMaterial matcap={texture} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </Center>
  );
};

export default Rings;
```

</details>

<details>
<summary>About Earth Maps</summary>

```js
globeImageUrl = '//unpkg.com/three-globe/example/img/earth-night.jpg';
bumpImageUrl = '//unpkg.com/three-globe/example/img/earth-topology.png';
```

</details>

<details>
<summary><code>components/HackerRoom.jsx</code></summary>

```jsx
/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.0 hacker-room-new.glb -T 
Files: hacker-room-new.glb [34.62MB] > /Users/hsuwinlat/Desktop/jsm pj/threejscc-portfolio/public/models/hacker-room-new-transformed.glb [2.56MB] (93%)
*/

import { useGLTF, useTexture } from '@react-three/drei';

export function HackerRoom(props) {
  const { nodes, materials } = useGLTF('/models/hacker-room.glb');

  const monitortxt = useTexture('textures/desk/monitor.png');
  const screenTxt = useTexture('textures/desk/screen.png');

  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.screen_screens_0.geometry} material={materials.screens}>
        <meshMatcapMaterial map={screenTxt} />
      </mesh>
      <mesh geometry={nodes.screen_glass_glass_0.geometry} material={materials.glass} />
      <mesh geometry={nodes.table_table_mat_0_1.geometry} material={materials.table_mat} />
      <mesh geometry={nodes.table_table_mat_0_2.geometry} material={materials.computer_mat}>
        <meshMatcapMaterial map={monitortxt} />
      </mesh>
      <mesh geometry={nodes.table_table_mat_0_3.geometry} material={materials.server_mat} />
      <mesh geometry={nodes.table_table_mat_0_4.geometry} material={materials.vhsPlayer_mat} />
      <mesh geometry={nodes.table_table_mat_0_5.geometry} material={materials.stand_mat} />
      <mesh geometry={nodes.table_table_mat_0_6.geometry} material={materials.mat_mat} />
      <mesh geometry={nodes.table_table_mat_0_7.geometry} material={materials.arm_mat} />
      <mesh geometry={nodes.table_table_mat_0_8.geometry} material={materials.tv_mat}>
        <meshMatcapMaterial map={monitortxt} />
      </mesh>
      <mesh geometry={nodes.table_table_mat_0_9.geometry} material={materials.cables_mat} />
      <mesh geometry={nodes.table_table_mat_0_10.geometry} material={materials.props_mat} />
      <mesh geometry={nodes.table_table_mat_0_11.geometry} material={materials.ground_mat} />
      <mesh geometry={nodes.table_table_mat_0_12.geometry} material={materials.key_mat} />
    </group>
  );
}

useGLTF.preload('/models/hacker-room.glb');
```

</details>

## 🌟 Live Demo

Check out the live portfolio: [https://codingwithiz.github.io/ThreeJS-Portfolio](https://codingwithiz.github.io/ThreeJS-Portfolio)

## 📂 Project Structure

```
src/
├── components/          # Reusable 3D components
│   ├── Alert.jsx       # Alert notifications
│   ├── Button.jsx      # Custom button component
│   ├── Cube.jsx        # Interactive 3D cube
│   ├── DemoComputer.jsx # Project demo container
│   ├── Developer.jsx   # 3D developer model
│   ├── HackerRoom.jsx  # Main 3D scene
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
│   ├── Hero.jsx        # Hero section
│   ├── Navbar.jsx      # Navigation
│   └── Projects.jsx    # Projects showcase
├── constants/          # App constants
│   └── index.js        # Navigation, projects, experience data
├── hooks/              # Custom hooks
│   └── useAlert.js     # Alert hook
└── App.jsx             # Main app component
```

## 🎨 Customization

### Adding New Projects

Update the `myProjects` array in `src/constants/index.js`:

```js
{
  title: 'Your Project Name',
  desc: 'Project description...',
  subdesc: 'Technical details...',
  href: 'https://your-project-link.com',
  texture: '/textures/project/your-video.mp4',
  logo: '/assets/your-logo.png',
  logoStyle: {
    backgroundColor: '#yourcolor',
    // ... other styles
  },
  spotlight: '/assets/your-spotlight.png',
  tags: [
    // Your tech stack tags
  ],
}
```

### Updating Experience

Modify the `workExperiences` array in `src/constants/index.js` with your professional experience.

## 🔗 Links

Here is the list of all the resources used in the project video:

- [Hacker Room](https://sketchfab.com/3d-models/hacker-room-stylized-a0cfe6edf2dd494c8a95addf6bb13a10)
- [Computer](https://sketchfab.com/3d-models/3d-computer-sketchfab-weekly-11-mar23-d9931a9aba7c4ea1bc12b2a59dcef16e)
- [Target Model](https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/target-stand/model.gltf)
- [React Logo](https://sketchfab.com/3d-models/react-logo-76174ceeba96487f9863f974636f641e)
- [gltfjsx](https://gltf.pmnd.rs/)
- [ReadyPlayerMe](https://readyplayer.me/)
- [Mixamo](https://www.mixamo.com/)
- [FBX Animations ZIP](https://drive.google.com/file/d/1yQhrRvEQFEwxbjG2qelv_T-gAatXJ3N1/view?usp=sharing)

## 📦 Assets & Resources

Here is the list of all the resources used in the project:

- [Original Tutorial Assets](https://drive.google.com/file/d/1UiJyotDmF2_tBC-GeLpRZuFY_gx5e7iX/view?usp=sharing)

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

- **Portfolio**: [https://codingwithiz.github.io/ThreeJS-Portfolio](https://codingwithiz.github.io/ThreeJS-Portfolio)
- **GitHub**: [@codingwithiz](https://github.com/codingwithiz)
- **Email**: Contact through the portfolio contact form

---

⭐ If you found this project helpful, please give it a star on GitHub!
