/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0055FF', // Base Blue
          50: '#E6F0FF',
          100: '#CCE1FF',
          200: '#99C3FF',
          300: '#66A5FF',
          400: '#3387FF',
          500: '#0055FF', // Base Blue
          600: '#0044CC',
          700: '#003399',
          800: '#002266',
          900: '#001133',
        },
        secondary: {
          DEFAULT: '#1E1E1E', // Charcoal
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#BABABA',
          400: '#A3A3A3',
          500: '#8C8C8C',
          600: '#6B6B6B',
          700: '#4A4A4A',
          800: '#2E2E2E',
          900: '#1E1E1E', // Charcoal
        },
        accent: {
          DEFAULT: '#20C997', // Teal
          50: '#E6F9F4',
          100: '#CCF3E9',
          200: '#99E7D3',
          300: '#66DBBD',
          400: '#33CFA7',
          500: '#20C997', // Teal
          600: '#1AA17C',
          700: '#137961',
          800: '#0D5146',
          900: '#06292B',
        },
        neutral: {
          white: '#FFFFFF',
          light: '#F5F5F5',
          dark: '#333333',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'body': ['16px', { lineHeight: '1.5' }],
      },
      spacing: {
        '4': '4px',
        '8': '8px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
      },
      borderRadius: {
        'button': '8px',
        'card': '8px',
        'modal': '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in': 'slideIn 0.2s ease-in-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
        'modal-open': 'modalOpen 0.2s ease-in-out',
        'modal-close': 'modalClose 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        modalOpen: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        modalClose: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}