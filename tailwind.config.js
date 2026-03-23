/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}','./app/**/*.{js,ts,jsx,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: "#1E88E5",
        accent: "#00C9A7",
        bg: "#F5F9FF",
        dark: "#0F172A",
        card : '#FFFFFF', 
      },
    },
  },
  plugins: [],
};
