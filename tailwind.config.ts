import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6ED',
          200: '#F3EBDA',
        },
        plum: {
          50: '#F7F1F7',
          100: '#EBDCEB',
          200: '#D3B3D4',
          300: '#B686B9',
          400: '#93589C',
          500: '#733D80',
          600: '#5A2E66',
          700: '#472552',
          800: '#391D42',
          900: '#2B1633',
          950: '#1A0E1F',
        },
        gold: {
          50: '#FDF8ED',
          100: '#FAEECB',
          200: '#F3DA97',
          300: '#EAC162',
          400: '#DFA738',
          500: '#C68A24',
          600: '#A26C1C',
          700: '#7E521C',
          800: '#69441D',
          900: '#59391D',
        },
      },
      boxShadow: {
        soft: '0 4px 24px -6px rgba(43, 22, 51, 0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config
