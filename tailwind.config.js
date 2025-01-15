/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      lists:[
        'list-style-type: disc',
      ]
    },
  },
  plugins: [],
}