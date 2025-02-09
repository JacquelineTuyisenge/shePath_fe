/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        light: {
          background: '#ffffff', // Background color of the entire app
          text: '#000000', // Primary text (headings, body text, labels)
          primary: '#f97316', // Orange for button backgrounds, call-to-action, links
          secondary: '#f06c83', // Teal for h1, h2, subheadings or pink #008080
          accent: '#d97706', // Soft Gold for button hover, links, small highlights
          gray: '#f5f5f5', // Light Gray for subtle areas, card backgrounds, borders, lines
        },
        dark: {
          background: '#000000', // Background color of the entire app
          text: '#ffffff', // Primary text (headings, body text, labels)
          primary: '#f97316', // Orange for button backgrounds, call-to-action, links
          secondary: '#f06c83', // Teal for h1, h2, subheadings
          accent: '#d97706', // Soft Gold for button hover, links, small highlights
          gray: '#1a1a1a', // Dark Gray for subtle areas, card backgrounds, borders, lines
        },
      },      
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Setting Poppins as the default font
      },
      spacing: {
        128: '32rem', // Custom spacing if needed
      },
      fontSize: {
        xs: '0.75rem',  // Extra small text
        sm: '0.875rem', // Small text
        base: '1rem',   // Base text size
        lg: '1.125rem', // Larger text for subheadings
        xl: '1.25rem',  // Main headings
        '2xl': '1.5rem', // Large headings
        '3xl': '1.875rem', // Very large headings
        '4xl': '2.25rem', // Hero text or large titles
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  darkMode: 'class', // Enable dark mode using class
  plugins: [],
}
