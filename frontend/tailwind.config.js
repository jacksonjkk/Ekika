/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#883600",
        "primary-container": "#a94c16",
        "background": "#fff8f1",
        "surface": "#fff8f1",
        "on-surface": "#1f1b13",
        "surface-variant": "#eae1d3",
        "on-surface-variant": "#54433c",
        "secondary": "#47673a",
        "secondary-container": "#c8edb5",
        "on-secondary-container": "#4d6d40",
        "tertiary": "#7e3e00",
        "tertiary-container": "#a25200",
        "surface-container-low": "#fcf2e4",
        "surface-container-high": "#f0e7d9",
        "surface-container-highest": "#eae1d3",
        "on-background": "#1f1b13",
      },
      fontFamily: {
        "headline": ["Epilogue", "sans-serif"],
        "body": ["Manrope", "sans-serif"],
      }
    },
  },
  plugins: [],
}
