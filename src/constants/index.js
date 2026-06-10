export const profile = {
  name: 'Ing Zhen',
  fullName: 'Lee Ing Zhen',
  initials: 'IZ',
  title: 'Software Engineer',
  focus: 'AI · RPA',
  expertise: ['RPA', 'Software Development', 'Agentic AI'],
  openTo: 'Software Engineering & AI Engineering roles',
  tagline: 'I build intelligent automation systems.',
  summary:
    'Software Engineer (AI & RPA) at Maxis and First-Class Honours Computer Science graduate — open to Software Engineering and AI Engineering roles. I build enterprise automation with UiPath, Java/OSGi services and agentic AI, turning messy real-world complexity into systems that ship and win.',
  location: 'Kuala Lumpur, Malaysia',
  email: 'ingzhen2003@gmail.com',
  resume: '/assets/iz_resume.pdf',
  available: true,
  socials: {
    github: 'https://github.com/codingwithiz',
    linkedin: 'https://www.linkedin.com/in/ingzhenlee',
    instagram: 'https://www.instagram.com/ingzhennn',
  },
};

export const navLinks = [
  { id: 1, name: 'About', href: '#about' },
  { id: 2, name: 'Experience', href: '#experience' },
  { id: 3, name: 'Work', href: '#work' },
  { id: 4, name: 'Awards', href: '#awards' },
  { id: 5, name: 'Contact', href: '#contact' },
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
    order: 3,
    desc: 'AmanahBlock is a decentralized charitable donation platform that combines blockchain technology, AI, and Shariah-compliant practices. Features multi-modal donations, milestone-driven disbursement, and AI-powered proposal screening for maximum transparency.',
    subdesc:
      'Built with React, Solidity smart contracts, and OpenAI integration. Supports crypto donations via Metamask, FPX for Malaysian banks, OCR-based zakat calculator, and DAO voting system for emergency fund allocation.',
    href: 'https://github.com/szeyu/AmanahBlock',
    github: 'https://github.com/szeyu/AmanahBlock',
    demo: '',
    impact: 'UMHackathon 2025 — 1st Runner-Up (RM5,000)',
    award: '1st Runner-Up',
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
        path: '/assets/tech/react.svg',
      },
      {
        id: 2,
        name: 'Solidity',
        path: '/assets/tech/solidity.svg',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/tech/typescript.svg',
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
    order: 5,
    desc: 'SmartGrow is an IoT web application that automates plant care with real-time sensor data and actuator logic. Designed for both hobbyists and professionals, it monitors environmental conditions and automates watering, lighting, and ventilation systems.',
    subdesc:
      'Built with React, Firebase, and Node.js integration with IoT sensors. Features real-time monitoring of soil moisture, temperature, and humidity with automated plant care based on plant-specific profiles and environmental thresholds.',
    href: 'https://smartgrow-kappa.vercel.app/',
    github: '',
    demo: 'https://smartgrow-kappa.vercel.app/',
    impact: 'Real-time IoT plant monitoring & care automation',
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
        path: '/assets/tech/react.svg',
      },
      {
        id: 2,
        name: 'Firebase',
        path: '/assets/tech/firebase.svg',
      },
      {
        id: 3,
        name: 'Node.js',
        path: '/assets/tech/nodejs.svg',
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
    order: 2,
    desc: 'NiagaMap is an intelligent geographical information system that leverages GenAI and rule-based modeling to generate dynamic business location suitability maps. The platform features interactive spatial analysis with real-time visualization and an AI-powered chatbot for natural language location queries and recommendations.',
    subdesc:
      'Built with Vite, JavaScript, and Node.js backend integration with ArcGIS mapping services, OpenAI conversational AI, and dockerized MSSQL database. Features comprehensive spatial analysis for foot traffic assessment, competitor density mapping, accessibility evaluation, and demographic insights for optimal business site selection.',
    href: 'https://github.com/codingwithiz/FYP_1',
    github: 'https://github.com/codingwithiz/NiagaMap',
    demo: '',
    impact: 'APAC 2026 Grand Winner — Software Engineering',
    award: 'Grand Winner',
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
        path: '/assets/tech/react.svg',
      },
      {
        id: 2,
        name: 'ArcGIS',
        path: '/assets/tech/arcgis.svg',
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
      { id: 5, name: 'GenAI' },
    ],
  },
  {
    title: 'Bina — Offline AI App Builder',
    order: 1,
    desc: 'A no-code builder that turns domain expertise into fully offline mobile apps, powered by an on-device Gemma model. Experts author YAML "recipes" that generate screens, prompts, safety rails and translations.',
    subdesc:
      'Built with Kotlin, TypeScript, React and Google LiteRT-LM (Gemma) — running entirely offline, spreading peer-to-peer via QR + Bluetooth mesh, across 30+ languages. "Offline AI for the communities that need it most."',
    href: 'https://github.com/jing-yen/bina-v2',
    github: 'https://github.com/jing-yen/bina-v2',
    demo: '',
    impact: 'Gemma4Good · Google DeepMind (results pending)',
    texture: '/textures/project/bina-project.mp4',
    logo: '/assets/bina-logo.png',
    logoStyle: {
      backgroundColor: '#0e1f24',
      border: '0.2px solid #1c3a3a',
      boxShadow: '0px 0px 60px 0px #8FA67E4D',
    },
    tags: [
      { id: 1, name: 'TypeScript', path: '/assets/tech/typescript.svg' },
      { id: 2, name: 'Kotlin', path: '/assets/tech/kotlin.svg' },
      { id: 3, name: 'React', path: '/assets/tech/react.svg' },
      { id: 4, name: 'Gemma', path: '/assets/tech/gemma.svg' },
    ],
  },
  {
    title: 'Employee Connect Suite - HR Platform',
    order: 7,
    desc: 'Employee Connect Suite is a full-stack HR management system designed for entrepreneurs and SMEs. Features comprehensive employee management including leave applications, attendance tracking, payroll processing, and community collaboration tools for enhanced workplace productivity.',
    subdesc:
      'Built with React, Node.js, MongoDB, Microsoft Azure and TailwindCSS. Includes user authentication, automated leave management, real-time attendance tracking, salary processing with EPF/SOCSO integration, employee directory with advanced filtering, internal communication forums, and helpdesk for employee well-being initiatives.',
    href: 'https://github.com/PoisonDarterz/WIF2003_G8',
    github: 'https://github.com/PoisonDarterz/WIF2003_G8',
    demo: '',
    impact: 'Full-stack HR platform — leave, payroll & attendance',
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
        path: '/assets/tech/react.svg',
      },
      {
        id: 2,
        name: 'Node.js',
        path: '/assets/tech/nodejs.svg',
      },
      {
        id: 3,
        name: 'MongoDB',
        path: '/assets/tech/mongodb.svg',
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
    order: 8,
    desc: 'Social Media Influencer Analysis & Prediction Pipeline is a comprehensive ML-powered platform that analyzes social media influencer performance and predicts engagement trends. Features advanced data collection, network analysis, AI-driven predictions, and interactive visualizations for strategic influencer marketing decisions.',
    subdesc:
      'Built with Python, Streamlit, and scikit-learn with comprehensive ML libraries. Features automated data collection via APIs, network analysis using NetworkX, NLP sentiment analysis with TextBlob, predictive modeling with RandomForest algorithms, interactive visualizations with Plotly, and recommendation systems for optimal influencer selection.',
    href: 'https://github.com/codingwithiz/WIF3009-Project',
    github: 'https://github.com/codingwithiz/WIF3009-Project',
    demo: '',
    impact: 'ML pipeline for influencer analytics & prediction',
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
        path: '/assets/tech/python.svg',
      },
      {
        id: 2,
        name: 'Streamlit',
        path: '/assets/tech/streamlit.svg',
      },
      {
        id: 3,
        name: 'scikit-learn',
        path: '/assets/tech/scikitlearn.svg',
      },
      {
        id: 4,
        name: 'Plotly',
        path: '/assets/tech/plotly.svg',
      },
    ],
  },
  {
    title: 'IZ Finance — Personal Finance App',
    order: 4,
    desc: 'A Malaysia-first personal budgeting and net-worth tracker. Log expenses in plain language through a Telegram bot, auto-sort them into a 40/20/40 budget, and receive AI-generated monthly reports.',
    subdesc:
      'Built with React, TypeScript, Supabase (Postgres + RLS) and the OpenAI API — featuring receipt OCR via OpenAI Vision, multi-currency, workspace sharing, and an "Anti-Pokai" financial-health score.',
    href: 'https://iz-finance.app/',
    github: 'https://github.com/codingwithiz/IZ-Finance-App',
    demo: 'https://iz-finance.app/',
    impact: 'Live personal-finance tracker (React · TS · Supabase)',
    texture: '/textures/project/iz-finance-project.mp4',
    logoStyle: {
      backgroundColor: '#10241b',
      border: '0.2px solid #1c3a2c',
      boxShadow: '0px 0px 60px 0px #8FA67E4D',
    },
    tags: [
      { id: 1, name: 'TypeScript', path: '/assets/tech/typescript.svg' },
      { id: 2, name: 'React', path: '/assets/tech/react.svg' },
      { id: 3, name: 'PostgreSQL', path: '/assets/tech/postgresql.svg' },
      { id: 4, name: 'OpenAI', path: '/assets/openai.png' },
    ],
  },
  {
    title: 'AkarSwarm — TNG Digital FinHack 2026',
    order: 6,
    desc: 'A zero-infrastructure financial-inclusion platform for unbanked Malaysians ("Unify & Uplift") — turning neighbourhood kedai runcit into "Human ATM" anchor nodes for instant cash digitization, with low-bandwidth WhatsApp eKYC onboarding.',
    subdesc:
      'Orchestrated by an agentic system — an Amazon Bedrock supervisor agent coordinating tools across a multi-cloud environment (AWS + Alibaba Cloud PAI-EAS running Qwen 2.5). An "Akar AI" assistant drives 1-click micro-savings, a "Cash Velocity Score" underwrites pay-when-you-earn micro-loans, and real-time SageMaker AML guards the mesh.',
    href: 'https://github.com/AsynchronousNotAvailable/TngHack',
    github: 'https://github.com/AsynchronousNotAvailable/TngHack',
    demo: '',
    impact: 'TNG Digital FinHack 2026 — agentic, multi-cloud fintech',
    texture: '/textures/project/akarswarm-project.mp4',
    logo: '/assets/akarswarm-logo.png',
    logoStyle: {
      backgroundColor: '#241a10',
      border: '0.2px solid #3a2c1c',
      boxShadow: '0px 0px 60px 0px #E3A8574D',
    },
    tags: [
      { id: 1, name: 'Agentic AI' },
      { id: 2, name: 'Multi-cloud' },
      { id: 3, name: 'Amazon Bedrock' },
      { id: 4, name: 'Alibaba Cloud' },
      { id: 5, name: 'Python', path: '/assets/tech/python.svg' },
    ],
  },
];

export const calculateSizes = (isSmall, isMobile, isTablet) => {
  return {
    deskScale: isSmall ? 0.05 : isMobile ? 0.06 : 0.065,
    deskPosition: isMobile ? [0.5, -4.5, 0] : [0.25, -5.5, 0],
    cubePosition: isSmall ? [4, -5, 0] : isMobile ? [5, -5, 0] : isTablet ? [5, -5, 0] : [9, -5.5, 0],
    reactLogoPosition: isSmall ? [3, 4, 0] : isMobile ? [5, 4, 0] : isTablet ? [5, 4, 0] : [8, 4, 0],
    ringPosition: isSmall ? [-5, 7, 0] : isMobile ? [-10, 10, 0] : isTablet ? [-12, 10, 0] : [-15, 10, 0],
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

// ── Technical experience ─────────────────────────────────────────────
export const technicalExperience = [
  {
    company: 'Maxis',
    role: 'Software Engineer · AI & RPA',
    duration: 'May 2026 — Present',
    location: 'Kuala Lumpur, MY',
    icon: '/assets/Maxis_Communications_logo.svg',
    animation: 'victory',
    points: [
      'Automate enterprise processes end-to-end with UiPath RPA, retiring manual workflows across business units.',
      'Build and maintain Java services on a modular OSGi architecture powering mission-critical internal platforms.',
      'Engineer agentic AI systems that reason and act over enterprise data to augment day-to-day operations.',
    ],
  },
  {
    company: 'Maxis',
    role: 'Innovation Software Intern',
    duration: 'Aug 2024 — Jan 2025',
    location: 'Kuala Lumpur, MY',
    icon: '/assets/Maxis_Communications_logo.svg',
    animation: 'clapping',
    points: [
      'Built an HR platform on Joget (OSGi-based) migrating ~1,342 contingent workers from Workday — saving ~RM370k/year.',
      'Engineered a real-time IoT dashboard monitoring 2,000+ routers nationwide in ThingsBoard via the Zabbix API.',
      'Maintained the national MIN dashboard & a Smart Hydroponics IoT system; presented "Dexter", Maxis’s in-house GenAI assistant, at the AI & Analytics Symposium 2024.',
    ],
  },
  {
    company: 'LTL Global Telecom',
    role: 'Freelance Web Developer',
    duration: 'May 2025 — Jun 2025',
    location: 'Remote',
    icon: '/assets/globaltelecom_logo.svg',
    animation: 'salute',
    points: [
      'Launched the official company website (Wix) with structured About, Services and Data Centre pages.',
      'Grew engagement by +30% sessions and +10% unique visitors in the first month.',
    ],
  },
];

// ── Leadership experience ────────────────────────────────────────────
export const leadershipExperience = [
  {
    org: 'AIESEC in Universiti Malaya',
    role: 'Local Committee President',
    duration: 'Feb 2024 — Feb 2025',
    featured: true,
    points: [
      'Led a 70-member entity across all operations; won the Top Gun Award (Best Local Entity) out of 12 in Malaysia.',
      'Ran Global Volunteer & Global Talent exchange programmes and hosted MyLDS (170+ delegates nationwide).',
      'Represented AIESEC Malaysia at the Asia Pacific Summit (Nepal) & ASEAN Rotary Youth Peacebuilders Conference.',
    ],
  },
  {
    org: 'AIESEC in Universiti Malaya',
    role: 'Director of Sales · Incoming Global Talent',
    duration: 'Feb 2023 — Feb 2024',
    points: [
      'Signed 2 MoAs with local SMEs & a GLC and secured 5 partnership job positions; nominated Best iGTa (Striving for Excellence).',
    ],
  },
  {
    org: 'International Council of Malaysian Scholars',
    role: 'External Outreach & Publicity Associate',
    duration: 'Feb 2024 — Jan 2025',
    points: ['Led publicity initiatives and forged partnerships with external organisations (HEYA, MASA).'],
  },
  {
    org: 'PEKOM · UM Computer Society',
    role: 'UMHackathon Competition Committee',
    duration: 'Dec 2022 — Jul 2023',
    points: ['Designed competition tracks & judging and drove sponsorship and promotion for UMHackathon.'],
  },
  {
    org: 'Malacca Matriculation College',
    role: 'PAL Leader President & National Council Exec',
    duration: '2021 — 2022',
    points: ['Led peer-assisted learning; the college earned the nation’s No.1 Best Academic award and the most CGPA-4.0 students.'],
  },
];

// ── Education ────────────────────────────────────────────────────────
export const education = [
  {
    school: 'University of Malaya',
    credential: 'B.CS. (Hons) Software Engineering',
    detail: 'First-Class Honours',
    duration: 'Oct 2022 — Feb 2026',
  },
  {
    school: 'Malacca Matriculation College',
    credential: 'Matriculation · Physical Science',
    duration: 'Aug 2021 — Jun 2022',
  },
  {
    school: 'Catholic High School (CHSPJ)',
    credential: 'Sijil Pelajaran Malaysia (SPM)',
    duration: '2016 — 2020',
  },
];

// ── Certifications ───────────────────────────────────────────────────
export const certifications = [
  { name: 'AWS AI Practitioner Challenge', issuer: 'Udacity', date: 'Apr 2026' },
  { name: 'AWS Cloud Practitioner Essentials', issuer: 'Amazon Web Services', date: 'Oct 2025' },
  { name: 'Use Generative AI as Your Thought Partner', issuer: 'Coursera', date: 'Oct 2024' },
  { name: 'Autodesk Revit Architecture Certified User', issuer: 'Autodesk', date: 'Sep 2023' },
  { name: 'Microsoft Learn AI Skills Challenge', issuer: 'Microsoft', date: 'Aug 2023' },
  { name: 'CCNA: Introduction to Networks', issuer: 'Cisco', date: 'Jul 2023' },
  { name: 'Cloud Engineering', issuer: 'Google Cloud', date: 'Jul 2023' },
];

// ── Honors & awards ──────────────────────────────────────────────────
export const honors = [
  {
    title: 'APAC 2026 — Grand Winner, Software Engineering',
    issuer: 'Faculty of Computer Science & IT, Universiti Malaya',
    date: 'Mar 2026',
    prize: 'Top 15 FYP',
    featured: true,
    image: '/assets/awards/apac.jpg',
    blurb:
      'Grand Winner for the Software Engineering department for "Dynamic Rule-Based GIS Modeling for Business Location Suitability" (NiagaMap) — using GenAI to turn natural-language business goals into GIS rules.',
  },
  {
    title: 'UrbanFloodBench — 2nd Place Globally',
    issuer: 'Kaggle · NUS & University of Sydney',
    date: 'Mar 2026',
    prize: 'SGD 2,500',
    featured: true,
    image: '/assets/awards/urbanfloodbench.jpg',
    blurb:
      '2nd of 250+ teams from 20+ countries. Co-built an Edge-Aware Spatiotemporal GNN for 1D–2D urban flood forecasting; invited to co-author a contest paper.',
  },
  {
    title: 'EY Young Technology Professional Challenge 2025 — National Champion',
    issuer: 'EY Malaysia × SAP',
    date: 'Dec 2025',
    prize: 'RM 12,000',
    featured: true,
    image: '/assets/awards/ey.jpg',
    blurb:
      'National Champion out of 139 teams. Built "LajuLink", a logistics ecosystem on SAP BTP connecting merchants, drivers and customers.',
  },
  {
    title: 'UMHackathon 2025 — 1st Runner-Up',
    issuer: 'UM Hackathon',
    date: 'Apr 2025',
    prize: 'RM 5,000',
    featured: true,
    image: '/assets/awards/umhackathon.jpg',
    blurb:
      '2nd of 90+ teams for AmanahBlock, a Shariah-compliant blockchain donation platform with AI screening and milestone-based disbursement.',
  },
  {
    title: 'UG iFEST 2025 — Silver Award',
    issuer: 'Universiti Malaya',
    date: 'Jun 2025',
    blurb: 'Silver among 949 participants, judged by 300+ industry judges (Science & Technology FYP showcase).',
  },
  {
    title: 'Maxis Tech Scholar 2023',
    issuer: 'Maxis Broadband Sdn. Bhd.',
    date: 'Dec 2023',
    prize: '16 of 1,200',
    blurb: 'One of 16 scholarship holders selected from 1,200 applicants as a talent pipeline for future leaders.',
  },
  {
    title: 'Varsity Hackathon (VHack) 2024 — Top 10',
    issuer: 'USM Computer Science Society',
    date: 'Apr 2024',
    blurb: 'Top 10 of 300+ teams at a major Malaysian student hackathon.',
  },
  {
    title: 'Huawei Sales Elite Challenge 2024 — Finalist',
    issuer: 'Huawei Malaysia',
    date: 'Apr 2024',
    blurb: 'Finalist in a nationwide technical & consumer-product sales-pitch competition.',
  },
  {
    title: 'TalentCorp "Walk with Me" Masterclass — Cohort 1',
    issuer: 'TalentCorp Malaysia',
    date: 'Nov 2023',
    blurb: 'Selected for an executive masterclass accelerating top talent into future leaders.',
  },
  {
    title: 'Malaysian Public Policy Competition 2023 — Semi-Finalist',
    issuer: 'International Council of Malaysian Scholars',
    date: 'Aug 2023',
    blurb: 'Top 20 of 40+ international teams on AI in the Malaysian workforce.',
  },
];

// ── Skills (categorised) ─────────────────────────────────────────────
export const skills = [
  {
    category: 'Languages',
    items: [
      { name: 'Python', icon: '/assets/tech/python.svg' },
      { name: 'Java', icon: '/assets/tech/java.svg' },
      { name: 'TypeScript', icon: '/assets/tech/typescript.svg' },
      { name: 'JavaScript', icon: '/assets/tech/javascript.svg' },
      { name: 'SQL' },
      { name: 'Solidity', icon: '/assets/tech/solidity.svg' },
    ],
  },
  {
    category: 'AI, ML & Automation',
    items: [
      { name: 'PyTorch', icon: '/assets/tech/pytorch.svg' },
      { name: 'scikit-learn', icon: '/assets/tech/scikitlearn.svg' },
      { name: 'Hugging Face', icon: '/assets/tech/huggingface.svg' },
      { name: 'OpenAI', icon: '/assets/openai.png' },
      { name: 'Gemma', icon: '/assets/tech/gemma.svg' },
      { name: 'Agentic AI' },
      { name: 'UiPath (RPA)', icon: '/assets/tech/uipath.svg' },
      { name: 'pandas', icon: '/assets/tech/pandas.svg' },
      { name: 'NetworkX' },
      { name: 'Streamlit', icon: '/assets/tech/streamlit.svg' },
    ],
  },
  {
    category: 'Frontend',
    items: [
      { name: 'React', icon: '/assets/tech/react.svg' },
      { name: 'Tailwind CSS', icon: '/assets/tech/tailwindcss.svg' },
      { name: 'Three.js', icon: '/assets/tech/threejs.svg' },
      { name: 'HTML5', icon: '/assets/tech/html5.svg' },
      { name: 'CSS3', icon: '/assets/tech/css3.svg' },
    ],
  },
  {
    category: 'Backend & Data',
    items: [
      { name: 'Node.js', icon: '/assets/tech/nodejs.svg' },
      { name: 'Java / OSGi' },
      { name: 'REST APIs' },
      { name: 'Firebase', icon: '/assets/tech/firebase.svg' },
      { name: 'MongoDB', icon: '/assets/tech/mongodb.svg' },
      { name: 'MS SQL', icon: '/assets/tech/mssql.svg' },
    ],
  },
  {
    category: 'Cloud & DevOps',
    items: [
      { name: 'AWS' },
      { name: 'Azure', icon: '/assets/tech/azure.svg' },
      { name: 'Google Cloud', icon: '/assets/tech/googlecloud.svg' },
      { name: 'Docker', icon: '/assets/tech/docker.svg' },
      { name: 'Git', icon: '/assets/tech/git.svg' },
    ],
  },
  {
    category: 'Tools & Platforms',
    items: [
      { name: 'ArcGIS', icon: '/assets/tech/arcgis.svg' },
      { name: 'SAP BTP', icon: '/assets/tech/sap.svg' },
      { name: 'ThingsBoard' },
      { name: 'Figma', icon: '/assets/figma.svg' },
      { name: 'Plotly', icon: '/assets/tech/plotly.svg' },
    ],
  },
];
