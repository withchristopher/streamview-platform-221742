/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#63d64c",
        secondary: "#71767f",
        success: "#71767f",
        error: "#EF4444",
        background: "#FFFFFF",
        surface: "#f1f2f4",
        text: "#111827",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};
