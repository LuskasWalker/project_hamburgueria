/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./script.js"],
  theme: {
    extend: {
      backgroundImage: {
        "home": "url('/assets/bg.png')"
      }
    },
  },
  plugins: [],
}
