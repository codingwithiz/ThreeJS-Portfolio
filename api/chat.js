import { Buffer } from 'node:buffer';
import process from 'node:process';
import OpenAI from 'openai';

import {
  education,
  honors,
  leadershipExperience,
  myProjects,
  profile,
  skills,
  technicalExperience,
} from '../src/constants/index.js';
import { systems } from '../src/content/systems.js';

// Built from the same data the site renders, so the assistant cannot drift from the page.
const SYSTEM = `You are the assistant on Ing Zhen's portfolio website.
Answer questions about Ing Zhen (Lee Ing Zhen) plainly and concisely — usually 2–4 sentences unless asked for detail.
Strict scope: you ONLY answer questions ABOUT Ing Zhen — his work, skills, projects, experience, education,
awards, and how to reach him. You are NOT a general assistant: do not write code, essays, math, translations,
or perform any task, even if it is framed as something "Ing Zhen would do". If asked anything off-topic or any
general task, decline in one short sentence and offer to answer a question about Ing Zhen instead.
Never invent facts beyond what is given below. Maxis internals beyond what is written here are confidential: say so.

WHO: ${profile.fullName} ("IZ") — ${profile.title} (${profile.focus}) at Maxis, ${profile.location}.
${profile.summary}

EXPERIENCE:
${technicalExperience.map((e) => `- ${e.role}, ${e.company} (${e.duration}): ${e.points.join(' ')}`).join('\n')}

SYSTEMS (each has a case study on this site; give its path when you mention one):
${systems.map((s) => `- ${s.title} (${s.kicker}): ${s.summary} [${s.metric}] Built with ${s.stack.join(', ')}. Case study: /work/${s.slug}`).join('\n')}

OTHER PROJECTS:
${myProjects
  .filter((p) => !/^(NiagaMap|Bina|IZ Finance)/.test(p.title))
  .map((p) => `- ${p.title}: ${p.desc} ${p.subdesc} [${p.impact}]`)
  .join('\n')}

AWARDS:
${honors.map((h) => `- ${h.title} (${h.issuer}, ${h.date}): ${h.blurb}`).join('\n')}

LEADERSHIP:
${leadershipExperience.map((l) => `- ${l.role}, ${l.org} (${l.duration}): ${l.points.join(' ')}`).join('\n')}

EDUCATION: ${education.map((e) => `${e.credential}, ${e.school} (${e.duration})${e.detail ? ` — ${e.detail}` : ''}`).join('; ')}.

SKILLS: ${skills.map((g) => `${g.category}: ${g.items.map((i) => i.name).join(', ')}`).join('; ')}.

CONTACT: email ${profile.email}; LinkedIn ${profile.socials.linkedin}; GitHub ${profile.socials.github}.
He is open to ${profile.openTo}. Suggest the contact form on this site or his résumé when relevant.`;

async function readBody(req) {
  if (req.body) return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end('Method not allowed');
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.statusCode = 500;
    return res.end('Missing OPENAI_API_KEY');
  }

  try {
    const { messages = [] } = await readBody(req);
    const trimmed = messages
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && m.content)
      .slice(-10)
      .map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }));

    const client = new OpenAI({ apiKey });
    const stream = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      stream: true,
      temperature: 0.5,
      max_tokens: 500,
      messages: [{ role: 'system', content: SYSTEM }, ...trimmed],
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) res.write(delta);
    }
    res.end();
  } catch (err) {
    console.error('chat error', err);
    if (!res.headersSent) res.statusCode = 500;
    res.end("Sorry, I had trouble answering just now — please try again or email ingzhen2003@gmail.com.");
  }
}
