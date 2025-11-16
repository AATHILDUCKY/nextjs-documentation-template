/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1C3E66",
          light: "#275489",
          dark: "#122847"
        }
      },
      boxShadow: {
        "brand-soft": "0 18px 45px rgba(15,23,42,0.18)"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
