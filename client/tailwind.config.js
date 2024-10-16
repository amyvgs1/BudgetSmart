/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Roboto_Mono: ["Roboto Mono", "mono"],
        Outfit : ["Outfit", "Mono"]
      }
    },
  },
  plugins: [],
}

