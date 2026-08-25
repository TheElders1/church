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
          50: '#F4FAF6',
          100: '#E2F3E8',
          200: '#C1E6CE',
          300: '#8DCEA5',
          400: '#51B879',
          500: '#30A65F',
          600: '#16984A',
          700: '#00993D',
          800: '#007031',
          900: '#004C24',
          950: '#002914',
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
        soft: '0 4px 24px -6px rgba(0, 76, 36, 0.14)',
      },
    },
  },
  plugins: [],
} satisfies Config
