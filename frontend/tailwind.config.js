/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#4834d4',
          secondary: '#686de0',
        }
      },
    },
    plugins: [],
  }