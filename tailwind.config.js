/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f2f8f2',
          100: '#e0f0e0',
          200: '#b8ddb8',
          300: '#82c082',
          400: '#4a9e4a',
          500: '#2d7d2d',
          600: '#1e6320',
          700: '#174f19',
          800: '#113d14',
          900: '#0b2d0e',
          950: '#071a08',
        },
        earth: {
          50:  '#faf6f1',
          100: '#f2e8d8',
          200: '#e3ccaa',
          300: '#d0a872',
          400: '#bf8845',
          500: '#a86e2a',
          600: '#8c581f',
          700: '#704419',
          800: '#553314',
          900: '#3d240e',
        },
        harvest: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        cream: '#fdfaf4',
        parchment: '#f5ede0',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Lato"', 'sans-serif'],
        accent: ['"Cinzel"', 'serif'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'elegant': '0 4px 24px rgba(23, 79, 25, 0.12), 0 1px 4px rgba(0,0,0,0.08)',
        'card': '0 2px 16px rgba(0,0,0,0.07), 0 8px 32px rgba(23,79,25,0.06)',
        'hero': '0 8px 48px rgba(0,0,0,0.32)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'fade-in': 'fadeIn 1s ease forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
}
