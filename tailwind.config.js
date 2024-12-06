/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.{html,js,jsx,ts,tsx}", // Adjust based on your project structure
  ],
  theme: {
    extend: {},
  },
  plugins: [
    import('@tailwindcss/typography'),
  ],
};