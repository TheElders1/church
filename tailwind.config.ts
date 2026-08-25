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
          50: '#F4F6FB',
          100: '#E3EBF7',
          200: '#C2D3F0',
          300: '#89ADE6',
          400: '#407FDD',
          500: '#105CC6',
          600: '#04429F',
          700: '#002D7A',
          800: '#00205C',
          900: '#001847',
          950: '#000C29',
        },
        gold: {
          50: '#FDF8ED',
          100: '#FAECD1',
          200: '#F3D39B',
          300: '#E9B563',
          400: '#DF9D3A',
          500: '#D68A1F',
          600: '#B66E16',
          700: '#935615',
          800: '#754315',
          900: '#5D3414',
        },
      },
      boxShadow: {
        soft: '0 4px 24px -6px rgba(0, 24, 71, 0.14)',
      },
    },
  },
  plugins: [],
} satisfies Config
