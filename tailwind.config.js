/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ['var(--font-montserrat)', 'sans-serif'],
        body: ['var(--font-nunito)', 'sans-serif'],
        interface: ['var(--font-poppins)', 'sans-serif'],
      },
      colors: {
        primary: {
          black: '#1C1C1E',
          white: '#FFFFFF',
          blue: '#005FAD',
        },
        secondary: {
          green: '#7ED957',
          'gray-medium': '#B3B3B3',
          'gray-dark': '#3C3C3C',
        },
        accent: {
          gold: '#FFD700',
          red: '#E63946',
        },
        bg: {
          'blue-light': '#E1F5FF',
          'gray-light': '#F5F5F5',
        },
      },
    },
  },
  plugins: [],
} 