# Art direction: The hand

The home page is a card table. Under a very large name sits a hand of seven cards: six projects and a
joker. Tokens live in `tailwind.config.js` and `:root` in `src/index.css`.

## The one idea
Each project is a playing card (`src/components/Hand.jsx`, data in `card` on each entry of
`src/content/systems.js`).
- Front: one number and a short caption. Back: the selling point and a link to `/work/:slug`.
- The seventh card is the joker. It opens the chat.
- Phone: a swipe deck with scroll snap. From 900 px: a fan that spreads into a 4 + 3 grid as the page
  scrolls (`--p` goes 0 to 1 on a scroll timeline). Browsers without scroll timelines, and reduced
  motion, keep the fan.
- On load the cards are dealt one at a time (skipped under reduced motion).

## Palette
| Token | Hex | Use |
|---|---|---|
| `bg` | `#2338C4` | the table (page) |
| `night` | `#14110F` | card borders, hard shadows, ticker band, code blocks, text on cards |
| `surface` | `#1B2CA3` | panels and inputs |
| `edge` | `#5565E0` | hairlines |
| `ink` | `#FFF7E6` | primary text |
| `ink-muted` | `#CDD3FF` | secondary text |
| `amber` | `#FFD23F` | primary button, links, metrics |
| `sage` | `#3DDC97` | pass / done |
| `clay` | `#FF6B3D` | fail / error (fills only, too weak for small text on the table) |

Card colours, one per project, set in `card.color`: `#FF6B3D` Maxis, `#FFD23F` IZ Finance, `#FFF7E6`
Crux, `#3DDC97` Bina, `#F7A8D8` flood, `#B9A5FF` NiagaMap. The joker is `night` with a cream border.
A project's case page takes its card colour.

## Type
- Display: Bricolage Grotesque 700 (the name, card numbers, headings).
- Body: General Sans (self-hosted variable, `public/fonts/`).
- Labels and data: JetBrains Mono 400/500, uppercase with wide tracking via `.label`.
- Minimum 12 px. Text on a card is always `night`, never a tint.

## Forms
- Cards: 2 px `night` border, 14 px radius, hard `5px 5px 0` shadow. No blur shadows, no gradients.
- Everything that is not a card stays flat on the table: hairline rules and rows.
- Tap targets are at least 44 px.
- A case page opens as its card: the header is the card (`.case-card`, colour from `--c`) and the clicked card
  morphs into it with a view transition. The page ends on the next card (`.next-card`).
- Wins are small cards that flip on tap (`.aw`): result on the front, story on the back, four colours in rotation.
- Experience is the score sheet (`.sheet`): one cream card, one dashed row per round.
- The pipeline and the chat ("the joker") are the two `night` surfaces.

## Motion
- Transform and opacity only, plus the scroll-driven `--p`.
- Card moves use a slight overshoot (`cubic-bezier(.34,1.56,.64,1)`); the flip is 550 ms.
- The results ticker is the only thing that moves while idle.
- Route change is one 150 ms fade.

## Rules
- A card front carries one number. If a project has no number worth a card, it goes in the archive line.
- Copy is first person and plain. Facts come from the repos, the résumé or the paper.
- The Maxis page shows the shape of the system only: no internal names, prompts, screenshots or data.
