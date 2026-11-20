/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['General Sans', 'system-ui', 'sans-serif'],
        display: ['Bricolage Grotesque', 'General Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'Consolas', 'monospace'],
      },
      colors: {
        // The hand — a cobalt card table (see DESIGN.md)
        bg: '#2338C4',
        night: '#14110F', // card borders, hard shadows, the ticker band
        surface: {
          DEFAULT: '#1B2CA3',
          light: '#1A2890',
        },
        edge: '#5565E0',
        ink: {
          DEFAULT: '#FFF7E6',
          muted: '#CDD3FF',
        },
        amber: '#FFD23F', // accent: primary action, links, metrics
        sage: '#3DDC97', // pass
        clay: '#FF6B3D', // fail
      },
    },
  },
  plugins: [],
};
