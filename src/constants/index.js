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
    name: 'Mohd Amin bin Mohd Din',
    position: 'Head of Digital Platforms & Innovation at Maxis Berhad',
    img: 'assets/review1 (2).png',
    review:
      'Ing Zhen has been proactive in taking up work that he needs to learn and actively works with mentors and colleagues to get things done. He has picked up dev work for our third party contingent worker platform which is being used by nearly 1k workers at Maxis. His production solutions go live and he has done reasonably well for the MIN dashboard that is ready for demo. A hallmark of a strong team player and future asset to any organization.',
  },
  {
    id: 2,
    name: 'Brandon Tan Tin Soon',
    position: 'Managing Director at Academind Network',
    img: 'assets/review2 (2).png',
    review:
      'Ing Zhen was dependable, detail-oriented, and proactive in managing payroll, staff claims, and purchase orders for over 10 employees. He also helped coordinate multiple nationwide technical-based certification training programs, impacting more than 500 graduates. His strong work ethic and ability to manage multiple tasks remotely made him a key contributor to our operations. I highly recommend him for any opportunity that values responsibility, adaptability, and professionalism.',
  },
   {
    id: 3,
    name: 'Dr. Raja Jamilah binti Raja Yusof',
    position: 'Associate Professor at Universiti Malaya',
    img: 'assets/review3 (3).png',
    review:
      'Ing Zhen served as the System Integration Team Lead for his group\'s project, SmartGrow—an IoT-based web application developed to fetch real-time sensor data and send actuator commands for automated plant care. He was responsible for integrating the frontend user interface with Firebase through REST APIs, ensuring efficient communication between the web app and cloud-based IoT components. Throughout the course, Ing Zhen demonstrated strong technical skills, initiative, leadership as well as good communication skills serving as a dynamic team member of the project.',
  },
  {
    id: 4,
    name: 'Sarvagjnaa Divya',
    position: 'Head of Business Development at AIESEC in Universiti Malaya',
    img: 'assets/review4 (1).jpeg',
    review:
      'Ing Zhen\'s B2B skills are truly commendable. He possesses a deep understanding of business-to-business interactions and has a knack for forging meaningful partnerships and collaborations. His ability to connect with external stakeholders, negotiate effectively, and develop mutually beneficial relationships has been pivotal in advancing the goals and projects of our organization. Ing Zhen\'s dedication to creating win-win situations has consistently delivered positive results and expanded our reach.',
  },
];

export const myProjects = [
  {
    title: 'AmanahBlock - Blockchain Charitable Platform',
    desc: 'AmanahBlock is a decentralized charitable donation platform that combines blockchain technology, AI, and Shariah-compliant practices. Features multi-modal donations, milestone-driven disbursement, and AI-powered proposal screening for maximum transparency.',
    subdesc:
      'Built with React, Solidity smart contracts, and OpenAI integration. Supports crypto donations via Metamask, FPX for Malaysian banks, OCR-based zakat calculator, and DAO voting system for emergency fund allocation.',
    href: 'https://github.com/szeyu/AmanahBlock',
    texture: '/textures/project/amanahblock-project.mp4',
    logo: '/assets/amanahblock-logo.png',
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
        name: 'OpenAI',
        path: '/assets/openai.png',
      },
    ],
  },
  {
    title: 'SmartGrow - IoT Plant Monitoring & Care Automation System',
    desc: 'SmartGrow is an IoT web application that automates plant care with real-time sensor data and actuator logic. Designed for both hobbyists and professionals, it monitors environmental conditions and automates watering, lighting, and ventilation systems.',
    subdesc:
      'Built with React, Firebase, and Node.js integration with IoT sensors. Features real-time monitoring of soil moisture, temperature, and humidity with automated plant care based on plant-specific profiles and environmental thresholds.',
    href: 'https://smartgrow-kappa.vercel.app/',
    texture: '/textures/project/smartgrow-project.mp4',
    logo: '/assets/smartgrow-logo.svg',
    logoStyle: {
      backgroundColor: '#F0F9FF',
      border: '0.2px solid #0891B2',
      
      boxShadow: '0px 0px 60px 0px #06B6D44D',
      
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
        name: 'Firebase',
        path: 'assets/firebase-logo.png',
      },
      {
        id: 3,
        name: 'Node.js',
        path: '/assets/node-js.png',
      },
      {
        id: 4,
        name: 'IoT',
        path: '/assets/IoT-logo.jpg',
      },
    ],
  },
  {
    title: 'NiagaMap - AI-Driven GIS Location System',
    desc: 'NiagaMap is an intelligent geographical information system that leverages GenAI and rule-based modeling to generate dynamic business location suitability maps. The platform features interactive spatial analysis with real-time visualization and an AI-powered chatbot for natural language location queries and recommendations.',
    subdesc:
      'Built with Vite, JavaScript, and Node.js backend integration with ArcGIS mapping services, OpenAI conversational AI, and dockerized MSSQL database. Features comprehensive spatial analysis for foot traffic assessment, competitor density mapping, accessibility evaluation, and demographic insights for optimal business site selection.',
    href: 'https://github.com/codingwithiz/FYP_1',
    texture: '/textures/project/niagamap-project.mp4',
    logo: '/assets/niagamap-logo.svg',
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
        name: 'ArcGIS',
        path: 'assets/ArcGIS_logo.png',
      },
      {
        id: 3,
        name: 'OpenAI',
        path: '/assets/openai.png',
      },
      {
        id: 4,
        name: 'MS SQL',
        path: '/assets/ms-sql.png',
      },
    ],
  },
  {
    title: 'Employee Connect Suite - HR Platform',
    desc: 'Employee Connect Suite is a full-stack HR management system designed for entrepreneurs and SMEs. Features comprehensive employee management including leave applications, attendance tracking, payroll processing, and community collaboration tools for enhanced workplace productivity.',
    subdesc:
      'Built with React, Node.js, MongoDB, Microsoft Azure and TailwindCSS. Includes user authentication, automated leave management, real-time attendance tracking, salary processing with EPF/SOCSO integration, employee directory with advanced filtering, internal communication forums, and helpdesk for employee well-being initiatives.',
    href: 'https://github.com/PoisonDarterz/WIF2003_G8',
    texture: '/textures/project/ecs-project.mp4',
    logo: '/assets/ecs-logo.png',
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
        name: 'Node.js',
        path: '/assets/node-js.png',
      },
      {
        id: 3,
        name: 'MongoDB',
        path: '/assets/mongodb-logo.svg',
      },
      {
        id: 4,
        name: 'Azure',
        path: '/assets/azure-logo.png',
      },
    ],
  },
  {
    title: 'Social Media Influencer Analysis & Prediction Pipeline',
    desc: 'Social Media Influencer Analysis & Prediction Pipeline is a comprehensive ML-powered platform that analyzes social media influencer performance and predicts engagement trends. Features advanced data collection, network analysis, AI-driven predictions, and interactive visualizations for strategic influencer marketing decisions.',
    subdesc:
      'Built with Python, Streamlit, and scikit-learn with comprehensive ML libraries. Features automated data collection via APIs, network analysis using NetworkX, NLP sentiment analysis with TextBlob, predictive modeling with RandomForest algorithms, interactive visualizations with Plotly, and recommendation systems for optimal influencer selection.',
    href: 'https://github.com/codingwithiz/WIF3009-Project',
    texture: '/textures/project/sna-project.mp4',
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
        name: 'Python',
        path: '/assets/python-logo.png',
      },
      {
        id: 2,
        name: 'Streamlit',
        path: 'assets/streamlit-logo.png',
      },
      {
        id: 3,
        name: 'Sckit-learn',
        path: '/assets/sklearn-logo.png',
      },
      {
        id: 4,
        name: 'Plotly',
        path: '/assets/plotly-logo.svg',
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
    name: 'Maxis Berhad',
    pos: 'Innovation Software Intern',
    duration: 'Aug 2024 - Jan 2025',
    title: "Developed an internal HR platform in Joget for managing 1,300+ contingent workers, automating manual processes and saving RM370k+ annually. Engineered a national IoT dashboard in ThingsBoard to monitor 2,000+ routers via Zabbix API integration. Presented Dexter, Maxis's in-house AI chatbot, during AI & Analytics Symposium 2024.",
    icon: '/assets/Maxis_Communications_logo.svg',
    animation: 'victory',
  },
  {
    id: 2,
    name: 'LTL Global Telecom',
    pos: 'Freelance Web Developer',
    duration: 'May 2025 - June 2025',
    title: "Launched the official company website on Wix to boost online presence, with structured pages for About, Services, and Data Centres. Improved engagement with a 30% increase in site sessions and 10% growth in unique visitors during the first month.",
    icon: '/assets/globaltelecom_logo.svg',
    animation: 'clapping',
  },
  {
    id: 3,
    name: 'Academind Network',
    pos: 'Part-time Admin Assistant',
    duration: 'May 2021 - Present',
    title: "Managed 10+ employees for invoicing, claims, and purchase orders. Coordinated 5+ nationwide tech training programs reaching 500+ graduates. Oversaw talent outsourcing and placement with external clients, demonstrating strong organizational and communication skills.",
    icon: '/assets/academind_network_logo.svg',
    animation: 'salute',
  },
];
