/**
 * Renders a 1200×630 "Terra Nocturne" social share card (PNG) with Satori + resvg.
 * Satori lays out a flexbox tree → SVG (text baked to vector paths using the
 * provided fonts), then resvg rasterises that SVG → PNG. No system fonts needed.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const font = (p) => readFileSync(join(ROOT, 'node_modules', p));

const FONTS = [
  { name: 'Inter', data: font('@fontsource/inter/files/inter-latin-400-normal.woff'), weight: 400, style: 'normal' },
  { name: 'Inter', data: font('@fontsource/inter/files/inter-latin-600-normal.woff'), weight: 600, style: 'normal' },
  { name: 'Fraunces', data: font('@fontsource/fraunces/files/fraunces-latin-900-normal.woff'), weight: 900, style: 'normal' },
];

const C = { bg: '#14110E', ink: '#F4EDE2', muted: '#B7A893', amber: '#E3A857', edge: '#33291E' };

// Minimal hyperscript so we can build Satori's element tree without JSX.
function h(type, props = {}, ...children) {
  return { type, props: { ...props, children: children.length <= 1 ? children[0] : children } };
}

function card({ eyebrow, title, footer }) {
  return h(
    'div',
    {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '76px',
        backgroundColor: C.bg,
        color: C.ink,
        fontFamily: 'Inter',
        position: 'relative',
        overflow: 'hidden',
      },
    },
    // Decorative topographic rings (echo the hero's contour motif)
    h('div', { style: { position: 'absolute', top: '-300px', right: '-240px', width: '660px', height: '660px', borderRadius: '9999px', border: '2px solid rgba(227,168,87,0.16)', display: 'flex' } }),
    h('div', { style: { position: 'absolute', top: '-170px', right: '-110px', width: '430px', height: '430px', borderRadius: '9999px', border: '2px solid rgba(227,168,87,0.10)', display: 'flex' } }),
    // Inner edge frame
    h('div', { style: { position: 'absolute', top: '24px', right: '24px', bottom: '24px', left: '24px', borderRadius: '30px', border: `1px solid ${C.edge}`, display: 'flex' } }),
    // Eyebrow
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center' } },
      h('div', { style: { width: '16px', height: '16px', borderRadius: '9999px', backgroundColor: C.amber, marginRight: '18px', display: 'flex' } }),
      h('div', { style: { display: 'flex', fontSize: '24px', fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: C.amber } }, eyebrow),
    ),
    // Title
    h('div', { style: { display: 'flex', maxWidth: '1010px', fontFamily: 'Fraunces', fontWeight: 900, fontSize: '72px', lineHeight: 1.06, color: C.ink } }, title),
    // Footer
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column' } },
      h('div', { style: { display: 'flex', width: '84px', height: '6px', borderRadius: '9999px', backgroundColor: C.amber, marginBottom: '24px' } }),
      h('div', { style: { display: 'flex', fontSize: '27px', fontWeight: 400, color: C.muted } }, footer),
    ),
  );
}

export async function renderOgCard(opts) {
  const svg = await satori(card(opts), { width: 1200, height: 630, fonts: FONTS });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
