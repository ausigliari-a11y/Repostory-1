/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a192f', // Deep Navy Blue
          800: '#112240',
          700: '#233554',
        },
        slate: {
          light: '#8892b0',
          DEFAULT: '#a8b2d1',
          dark: '#495670',
        },
        gold: {
          400: '#e6c86e',
          500: '#d4af37', // Gold
          600: '#b4941f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
