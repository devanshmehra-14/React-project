/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1A1A2E',
        cyan: '#00D4FF',
        teal: '#0F6E56',
        offwhite: '#F5F5F0',
        danger: '#E24B4A',
      },
    },
  },
  plugins: [],
};
