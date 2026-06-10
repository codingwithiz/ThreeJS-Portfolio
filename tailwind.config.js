/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        generalsans: ['General Sans', 'sans-serif'],
        display: ['Fraunces', 'serif'],
      },
      colors: {
        // Legacy tokens (kept while sections are migrated to Terra Nocturne)
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

        // Terra Nocturne — warm organic dark (see DESIGN.md)
        bg: '#14110E',
        surface: {
          DEFAULT: '#211B14',
          light: '#2A2118',
        },
        edge: '#33291E',
        ink: {
          DEFAULT: '#F4EDE2',
          muted: '#B7A893',
        },
        amber: '#E3A857',
        accent: '#E3A857',
        sage: '#8FA67E',
        clay: '#C75D43',
      },
    },
  },
  plugins: [],
};
