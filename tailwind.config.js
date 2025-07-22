/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#10B981',
          '50': '#ECFDF5',
          '100': '#D1FAE5',
          '200': '#A7F3D0',
          '300': '#6EE7B7',
          '400': '#34D399',
          '500': '#10B981',
          '600': '#059669',
          '700': '#047857',
          '800': '#065F46',
          '900': '#064E3B',
        },
        background: '#F9FAFB',
        card: '#FFFFFF',
        text: {
          DEFAULT: '#1F2937',
          light: '#6B7280',
        },
        'primary-foreground': '#FFFFFF',
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#1F2937',
        },
      },
    },
  },
  plugins: [],
} 