/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aia: {
          red: '#D31145',    // 友邦红
          dark: '#8B0028',   // 深红
          gold: '#C5A065',   // 尊贵金
        }
      }
    },
  },
  plugins: [],
}