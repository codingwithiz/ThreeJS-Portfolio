// The six systems with a /work/<slug> case page. Order here is display order.
// `card` is the header of the case page (pages/Work.jsx): one number, its caption and the colour.
// `pipeline` drives the runnable diagram (components/Pipeline.jsx); `body` is Markdown.
// Plain data only — scripts/prerender.mjs and api/chat.js import this file from Node.

export const systems = [
  {
    slug: 'maxis-agents',
    title: 'Document agents and a bot control tower',
    kicker: 'Maxis · 2026 · production',
    summary:
      'Five specialised agents on AWS Lambda, orchestrated by a master agent on Step Functions, read the documents on a case and update Salesforce. Plus a control tower that runs 20+ bots without anyone starting them.',
    metric: '~30 → ~5 min per case',
    card: {
      name: 'Maxis agents',
      big: '30→5',
      cap: 'minutes per case',
      color: '#ff6b3d',
      usp: 'Five specialised agents on AWS Lambda, run by a master agent on Step Functions. They convert, classify, validate, extract and compare the documents on a case, then update Salesforce.',
    },
    stack: ['Amazon Bedrock (Claude)', 'AWS Step Functions', 'AWS Lambda', 'Salesforce', 'UiPath'],
    links: [],
    numbers: [
      { value: '~30 → ~5 min', label: 'handling time per case' },
      { value: '30–40', label: 'cases a day through each system' },
      { value: '20+', label: 'bots the control tower runs on its own' },
      { value: '$120K–180K', label: 'estimated licence cost avoided a year' },
    ],
    pipeline: {
      input: 'A case with documents attached',
      stages: [
        { name: 'Convert', detail: 'Each document becomes images the model can read.' },
        { name: 'Classify', detail: 'Works out what each document is.' },
        { name: 'Validate', detail: 'Checks each document before anything is read from it.' },
        { name: 'Extract', detail: 'Pulls out the fields the case needs.' },
        { name: 'Compare', detail: 'Cross-checks the fields across documents and analyses the result.' },
      ],
      output: 'Case updated in Salesforce',
      metric: '~30 min → ~5 min',
    },
    body: `## The problem

A case arrives with documents attached. Someone has to work out what each document is, check it, pull out the fields, compare them across documents and then update Salesforce. By hand that took about 30 minutes a case.

## What I built

Two production systems on Amazon Bedrock (Claude). Each one is five specialised agents and a master agent, instead of one large prompt.

- **Specialised agents.** Each is an AWS Lambda function with one job.
- **Master agent.** An AWS Step Functions state machine that orchestrates them and carries the case from one agent to the next.

Together the agents work like an OCR engine that checks its own reading:

1. Convert each document to images.
2. Classify what each document is.
3. Validate it before anything is read from it.
4. Extract the fields the case needs.
5. Compare the fields across documents and analyse the result.

The system is integrated with Salesforce, so the outcome lands on the case with its reasoning attached. If a check fails, the case goes to a person to handle manually.

## Result

- About 30 minutes a case, down to about 5.
- 30 to 40 cases a day through each system.
- The first of the two won Maxis's AI First Innovation Award for Q2 2026.

## The control tower

The same idea applied to the bots themselves. Maxis runs attended UiPath bots, which normally need a person to start them. The control tower schedules 20+ of them from AWS Lambda through a single desktop agent, so they run on their own. That gives unattended-level scheduling without unattended licences: an estimated $120K to $180K a year.

## What this page leaves out

Prompts, document types, internal names and data belong to Maxis. The diagram shows the shape of the system and nothing inside it.`,
  },
  {
    slug: 'iz-finance',
    title: 'IZ Finance',
    kicker: 'Own product · live',
    summary:
      'A Malaysian money app where payments log themselves. One API and one database behind six ways in: web, Android, iPhone Shortcuts, Telegram, email and share links.',
    metric: '420 unit tests · 47 phone checks',
    card: {
      name: 'IZ Finance',
      big: '0 taps',
      cap: 'to log a payment',
      color: '#ffd23f',
      usp: 'Apple Pay taps, TNG and MAE notifications and bank SMS log themselves. Every capture arrives with Undo and Fix. Bills split by receipt, to the sen.',
    },
    stack: ['Next.js 16', 'TypeScript', 'Supabase (Postgres, RLS)', 'Capacitor', 'Kotlin', 'OpenAI'],
    links: [
      { name: 'Live', href: 'https://iz-finance.app' },
      { name: 'GitHub', href: 'https://github.com/codingwithiz/IZ-Finance-App' },
    ],
    numbers: [
      { value: '6', label: 'ways in, one API and one database' },
      { value: '420', label: 'unit tests' },
      { value: '47', label: 'phone checks at 375 px, in EN and BM' },
      { value: '52', label: 'database migrations, applied on merge' },
    ],
    pipeline: {
      input: 'A payment notification on your phone',
      stages: [
        { name: 'Filter', detail: 'On the phone: only payment apps you ticked. Card numbers are masked.' },
        { name: 'Verify', detail: 'Per-device code checked against its hash. Rate limit and size cap.' },
        { name: 'Parse', detail: 'Amount from the text; merchant and category from the model.' },
        { name: 'Dedupe', detail: 'Same transaction ID or same screenshot is skipped.' },
        { name: 'Log', detail: 'Entry saved, alert sent with Undo and Fix.' },
      ],
      output: 'Logged RM12.50 → Meals',
      metric: '0 taps to log a payment',
    },
    body: `## Why

Budget apps fail when logging is a chore. IZ Finance removes the chore. On Android it reads payment notifications and bank SMS. On iPhone a Shortcut logs every Apple Pay tap. Anyone can message the Telegram bot or forward an email receipt.

*Pokai* is Malaysian slang for broke. The app is my protocol against it.

## How it is built

Every automatic source ends at the same ingest endpoint, so parsing, de-duplication and alerts behave the same wherever the payment came from. The website and the Android app run the same Next.js code; the Android build is a static export in a Capacitor shell with a native service for reading notifications.

- Filtering happens on the phone. Chats, one-time passwords and promotions never leave it.
- Row-Level Security is on every table, and the service key exists only on the server.
- Bills split by receipt down to the sen, with service charge, SST and rounding shared in proportion.

## How I keep it working

420 unit tests cover parsing, payroll, tax, splits and receipt maths. 47 Playwright checks run at 375 px in English and Bahasa Malaysia for overflow, a 12 px text floor and 44 px tap targets. Every merge to main deploys and applies its migrations.`,
  },
  {
    slug: 'crux',
    title: 'Crux',
    kicker: 'Open source · live',
    summary:
      'Start from a news story or your own thought. An AI coach helps you find your view, or a sparring partner attacks it, in conversation. Then the studio turns what you worked out into a carousel.',
    metric: 'Citation faithfulness 1.00',
    card: {
      name: 'Crux',
      big: '100%',
      cap: 'of quotes checked against the source',
      color: '#fff7e6',
      usp: 'Pick a news story or write your own thought. An AI coach or sparring partner pushes on it in conversation. The studio turns your take into a carousel.',
    },
    stack: ['Next.js', 'TypeScript', 'AI SDK', 'Supabase (Postgres, pgvector)'],
    links: [
      { name: 'Live', href: 'https://crux-content-engine.vercel.app' },
      { name: 'GitHub', href: 'https://github.com/codingwithiz/crux' },
    ],
    numbers: [
      { value: '1.00', label: 'citation faithfulness on a 10-item golden set' },
      { value: '10 / 10', label: 'golden items scored, 0 failures' },
      { value: '3', label: 'adversarial sources in the set' },
    ],
    pipeline: {
      input: 'A news link, or your own thought',
      stages: [
        { name: 'Break it down', detail: 'What happened, what is new, where people disagree, the sceptic’s case.' },
        { name: 'Verify quotes', detail: 'String match against the source. No model gets a say.' },
        { name: 'Talk it through', detail: 'Coach helps you find a view. Spar attacks the one you have.' },
        { name: 'Save your take', detail: 'Logged with your confidence, to score later.' },
        { name: 'Carousel', detail: 'A 1080×1350 deck in your voice, exported as PNG or PDF.' },
      ],
      output: 'A carousel with verified quotes',
      metric: 'Faithfulness 1.00',
    },
    body: `## The bet

Most AI writing tools write your opinion for you. Crux does the opposite. The model reads the source, argues with you and designs the carousel, but it does not write the opinion, because that is the only part that was ever yours.

## How it works

1. **Break it down.** Paste a link, pick a story, or start from your own thought. Crux lays out what happened, what is new, where people disagree and the sceptic’s case.
2. **Talk it through.** Coach helps you find a view. Spar attacks the one you have. Both refuse to hand you a conclusion.
3. **Save your take.** It goes into a track record with your confidence, so you can score it later.
4. **Get the carousel.** The studio builds a 1080×1350 deck in your voice, with twelve editorial styles and ten narrative formats, exported as PNG, ZIP or a LinkedIn-ready PDF.

## Stopping invented quotes with code

A prompt that says "do not invent quotes" is a request. Crux takes every quote the synthesiser produced and checks by string match that it appears in the fetched page. Quotes that do not match are shown as unverified instead of being dropped quietly. With no source at all, citations are removed.

## Measured

An eval harness runs ten golden items through the real pipeline, three of them adversarial: one dense with numbers, one deliberately hedged, one pure marketing. An LLM judge scores the writing. Citation faithfulness is deterministic and sits at 1.00. Judge scores move by about 0.3 between identical runs, so I treat small changes there as noise.

## The engineering

- Every model call goes through one function, with Zod-checked output and classified failures. There is no agent framework.
- A guard counts 60 model calls per user per hour before any work starts.
- Every model call records tokens, price, latency, attempts and an error code.
- The client asks for a tier (speed, balanced or deep) and never names a model.
- Fetching a link re-validates every redirect hop against SSRF.
- CI runs against a mocked model.`,
  },
  {
    slug: 'bina',
    title: 'Bina',
    kicker: 'Gemma 4 Good Hackathon · with Jing Yen',
    summary:
      'Experts build an AI app on the web without code. Anyone runs it on a phone, fully offline, and passes it from phone to phone with no internet.',
    metric: '2.6 GB model, on device',
    card: {
      name: 'Bina',
      big: '10 KB',
      cap: 'recipe becomes an offline AI app',
      color: '#3ddc97',
      usp: 'Experts write a recipe on the web, no code. Farmers and village midwives run it as an AI app on their own phone, fully offline, and pass it on by QR or Bluetooth.',
    },
    stack: ['Kotlin Multiplatform', 'Jetpack Compose', 'Gemma 4 (LiteRT-LM)', 'BLE'],
    links: [
      { name: 'Demo', href: 'https://youtu.be/OqAnPUDUv-E' },
      { name: 'GitHub', href: 'https://github.com/jing-yen/bina-v2' },
    ],
    numbers: [
      { value: '2.6 GB', label: 'Gemma 4 model running on the phone' },
      { value: '1–10 KB', label: 'a typical recipe' },
      { value: '0', label: 'network calls needed to run or share a recipe' },
    ],
    pipeline: {
      input: 'What an expert knows',
      stages: [
        { name: 'Recipe', detail: 'Written on the web in Recipe Studio: screens, prompts, safety rails.' },
        { name: 'Render', detail: 'The runtime draws the recipe as a Compose app.' },
        { name: 'Infer', detail: 'Gemma 4 answers on the device.' },
        { name: 'Share', detail: 'BLE and QR pass the recipe to the next phone.' },
      ],
      output: 'An offline app on the next phone',
      metric: 'No internet at any step',
    },
    body: `## What it is

Bina is an offline-first platform for communities with poor connectivity. It has two sides.

- **Architects** are the experts: NGOs, clinicians, agronomists. They write a recipe on the web in Recipe Studio, without code. A recipe is a small YAML file, usually 1 to 10 KB, that defines screens, prompts and safety rails.
- **Builders** are the people who need the help, such as smallholder farmers and village midwives. Their phone turns the recipe into a working app, backed by a Gemma 4 model that runs on the device, with voice input and local languages.

The model assembles screens the expert already wrote. It does not freestyle.

## My part

I co-built Bina with Jing Yen (NUS) for the Gemma 4 Good Hackathon by Google DeepMind. I built the Android and Kotlin Multiplatform app that runs the recipes on a 2.6 GB on-device model, the BLE and QR mesh that moves a recipe between devices with no internet, and the recipe controls and testing.

## The example

Farm Buddy: photograph a leaf for a diagnosis, ask about fertiliser, work out profit, find the nearest agricultural shop. A second recipe, Triage Ibu Hamil, does triage for pregnant mothers.`,
  },
  {
    slug: 'urbanfloodbench',
    title: 'UrbanFloodBench',
    kicker: 'Kaggle · 2nd of 264 teams · with Jing Yen',
    summary:
      'A graph neural network that forecasts urban flooding across drainage pipes and streets together. Second of 264 teams, and a co-authored paper.',
    metric: '2nd of 264 teams',
    card: {
      name: 'Flood bench',
      big: '2nd',
      cap: 'of 264 teams',
      color: '#f7a8d8',
      usp: 'One graph for drainage pipes and streets together. Our score went from 0.3275 to 0.0157, and the work is in a co-authored paper.',
    },
    stack: ['Python', 'PyTorch', 'Graph neural networks'],
    links: [{ name: 'Paper', href: 'https://doi.org/10.1016/j.envsoft.2026.107154' }],
    numbers: [
      { value: '2nd', label: 'of 264 teams on Kaggle' },
      { value: '0.0157', label: 'private score (first place: 0.0120)' },
      { value: '3,799', label: 'submissions across the competition' },
      { value: 'Vol. 206', label: 'Environmental Modelling & Software, Nov 2026' },
    ],
    pipeline: {
      input: 'Rainfall and a drainage graph',
      stages: [
        { name: 'Graph', detail: 'Pipes are 1D nodes, streets are 2D nodes, in one graph.' },
        { name: 'Message passing', detail: 'Edge-aware, two hops: flow, slope and capacity travel along edges.' },
        { name: 'Recurrent step', detail: 'Separate GRUs for the 1D and 2D nodes.' },
        { name: 'Roll forward', detail: 'Each forecast feeds the next step.' },
      ],
      output: 'Water levels over time',
      metric: '2nd of 264',
    },
    body: `## The problem

Forecast urban flood water levels where underground drainage and surface flooding affect each other. Most teams treated the surface as an image or the network as a sequence. We modelled the whole city as one graph.

## What worked

- Edge-aware message passing. Flow, slope and capacity went into the propagation step, instead of edges being simple connections.
- A two-hop receptive field. Wide enough to see upstream pressure, narrow enough to stay fast. Going deeper hurt.
- Rainfall lags and rolling intensities did more for accuracy than any architecture change.

## Result

Our team, SGD Lai Lai, finished 2nd of 264 with a private score of 0.0157. First place scored 0.0120 and third 0.0159. Our first submission scored 0.3275, because rainfall was being read from the wrong column. I am a co-author of the UrbanFloodBench paper in *Environmental Modelling & Software*, Vol. 206.

Two months before the deadline I had never trained a graph neural network. [The longer story is on the blog](/blog/kaggle-2nd-globally-in-two-months).`,
  },
  {
    slug: 'niagamap',
    title: 'NiagaMap',
    kicker: 'Final-year project · APAC 2026 Grand Winner',
    summary:
      'Describe a business in plain language and get a map of where to open it. A chatbot turns the goal into a multi-criteria suitability analysis on ArcGIS.',
    metric: 'APAC 2026 Grand Winner',
    card: {
      name: 'NiagaMap',
      big: '1',
      cap: 'sentence in, a ranked map out',
      color: '#b9a5ff',
      usp: 'Describe a business in a sentence. GPT-4o sets the criteria and weights, every hexagon is scored, and the top sites come with reasons.',
    },
    stack: ['React', 'Node.js', 'Express', 'GPT-4o', 'ArcGIS', 'Supabase', 'Firebase'],
    links: [
      { name: 'Live', href: 'https://niagamap.vercel.app' },
      { name: 'GitHub', href: 'https://github.com/codingwithiz/NiagaMap' },
    ],
    numbers: [
      { value: 'Grand Winner', label: 'APAC 2026, Software Engineering' },
      { value: 'Silver', label: 'IFEST 2025' },
    ],
    pipeline: {
      input: 'A business goal in plain language',
      stages: [
        { name: 'Understand', detail: 'The model turns the goal into criteria and weights.' },
        { name: 'Grid', detail: 'The area is divided into ArcGIS hexagons.' },
        { name: 'Score', detail: 'Demand, competition, accessibility, zoning and risk, per hexagon.' },
        { name: 'Explain', detail: 'The chatbot says why the top sites won.' },
      ],
      output: 'A suitability map',
      metric: 'Grand Winner, APAC 2026',
    },
    body: `## What it does

Choosing a shop location usually needs a GIS analyst. NiagaMap lets the owner describe the business in a sentence. The model turns that into rules, the rules run as a multi-criteria suitability analysis over a hexagonal grid in ArcGIS, and the result is a map with the reasons attached.

## My part

NiagaMap was a final-year project with a teammate, who built the rule-based GIS scoring engine. I built the GenAI side: turning the sentence into a category and weights, the chatbot, the hexagon map that redraws with each analysis, and favourites, sign-in, settings and notifications.

We tested it with 30 unit, 13 integration and 11 system test cases.

## Result

Grand Winner for Software Engineering at APAC 2026, and Silver at IFEST 2025.`,
  },
];

export const getSystem =(slug) => systems.find((s) => s.slug === slug);
