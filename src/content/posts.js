// Add a new post by appending an object here — no other code changes needed.
// `content` is plain Markdown (GitHub-flavored). Newest first.

export const posts = [
  {
    slug: 'kaggle-2nd-globally-in-two-months',
    title: 'How I climbed to 2nd globally on Kaggle in two months',
    date: '2026-04-12',
    excerpt:
      'Going from "what is a GNN?" to a global runner-up at UrbanFloodBench — the strategy, the model, and what I would tell my past self.',
    tags: ['Machine Learning', 'Kaggle', 'GNN'],
    content: `Two months before the UrbanFloodBench deadline, I had never trained a graph neural network. By the end, our team **SGD Lai Lai** sat 2nd globally out of 250+ teams from 20+ countries — losing first place on the private leaderboard by **0.0003**.

Here's how that happened, and what actually moved the needle.

## The problem

UrbanFloodBench asks you to forecast urban flood water levels — a coupled **1D–2D** problem where underground drainage networks and surface floodplains interact. Most teams treated the surface as an image (CNN) or the network as a sequence. We modelled the *whole city as one heterogeneous graph*.

## What worked

- **Edge-aware message passing.** We fed dynamic edge signals (flow, slope, capacity) into the propagation step instead of treating edges as binary connectivity. The model could finally "feel" where water wanted to go.
- **A two-hop receptive field.** Wide enough to capture upstream pressure, narrow enough to stay fast. Going deeper hurt.
- **Engineered temporal features.** Rainfall lags and rolling intensities did more for accuracy than any architecture change.

## What I'd tell my past self

1. **Spend your first week on the data, not the model.** Every leaderboard jump we made came from understanding the physics, not stacking layers.
2. **Compute discipline beats compute budget.** We trained intentionally — small, fast experiments with a clear hypothesis each time.
3. **Read the 1st-place write-up before the contest ends.** Top teams share generously. Learn in public.

The biggest lesson wasn't technical. It was that *rapid, deliberate upskilling* — picking one hard thing and going all-in for a fixed window — works far better than slow, comfortable learning.`,
  },
  {
    slug: 'automating-the-enterprise',
    title: 'Automating the enterprise: UiPath, OSGi and agentic AI',
    date: '2026-05-20',
    excerpt:
      'Three layers I lean on at Maxis to turn manual, brittle processes into systems that run themselves — and where each one earns its keep.',
    tags: ['Automation', 'RPA', 'Agentic AI'],
    content: `Enterprise automation isn't one tool — it's a stack. At Maxis I work across three layers, and each solves a different shape of problem.

## 1. UiPath — the hands

RPA is how you automate the *boring, deterministic* surface area: moving data between systems that were never meant to talk, clicking through legacy UIs, reconciling reports. It's unglamorous and enormously valuable. The trick is knowing when **not** to use it — if there's an API, use the API.

## 2. Java + OSGi — the backbone

When a process needs to be reliable, modular and long-lived, it belongs in real services. **OSGi** lets us ship features as independently deployable bundles — the same architecture under platforms like Joget — so we can update one capability without redeploying the world.

## 3. Agentic AI — the judgement

The newest layer. Where RPA follows a fixed script, an **agent** can reason over enterprise data, decide what to do next, and call tools to do it. The hard part isn't the model — it's the guardrails: scoping what the agent can touch, grounding it in trustworthy data, and keeping a human in the loop where it matters.

## The mental model

> RPA for the hands, services for the backbone, agents for the judgement.

Most "AI transformation" fails because teams reach for the flashiest layer first. Start with the boring wins, build a solid backbone, and let the agents handle the parts that genuinely need to think.`,
  },
];

export const getPost = (slug) => posts.find((p) => p.slug === slug);

export const readingTime = (content) => {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};
