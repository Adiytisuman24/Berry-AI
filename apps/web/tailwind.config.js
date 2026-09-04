/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        berry: {
          50: "#fbf7ff",
          100: "#f4edff",
          200: "#ebddff",
          300: "#dcbeff",
          400: "#c492fe",
          500: "#aa62f9",
          600: "#9135ed",
          700: "#7b22d3",
          800: "#671fb0",
          900: "#541b8e",
          950: "#360863",
        },
        dark: {
          950: "#06070c",
          900: "#0b0d17",
          850: "#101323",
          800: "#171a30",
          700: "#222744",
          600: "#343b66",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "berry-glow": "radial-gradient(circle at 50% 0%, rgba(147, 51, 234, 0.15), transparent 70%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s infinite linear",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
