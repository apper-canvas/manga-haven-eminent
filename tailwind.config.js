/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF1744',
        secondary: '#1A1A1A', 
        accent: '#00E676',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Bebas Neue', 'Impact', 'sans-serif'],
        display: ['Bebas Neue', 'Impact', 'sans-serif']
      },
      backgroundImage: {
        'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}