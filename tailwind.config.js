/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        "background": "#1d1d1d",
        "darkBackground": "#121212",
      },
    },
  },
  plugins: [require('tailwindcss-motion')],
};
