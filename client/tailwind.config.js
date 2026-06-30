/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef0fe',
          500: '#4f46e5',
          600: '#4338ca',
          700: '#3730a3',
        },
        sidebar: '#0f1729',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06)',
        pop: '0 12px 32px rgba(16,24,40,.14)',
      },
    },
  },
  plugins: [],
};
