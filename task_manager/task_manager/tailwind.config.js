/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'], // Ensure this includes your file paths
  theme: {
    extend: {
      colors: {
        light: {
          background: '#ffffff',
          text: '#000000',
          primary: '#f97316', // Orange
        },
        dark: {
          background: '#000000',
          text: '#ffffff',
          primary: '#f97316', // Orange
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
