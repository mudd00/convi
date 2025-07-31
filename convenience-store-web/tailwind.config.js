/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 한국 편의점 브랜드 컬러
        primary: {
          DEFAULT: '#00A651', // GS25 그린
          50: '#E8F5E8',
          100: '#C3E6C3',
          200: '#9DD69D',
          300: '#77C677',
          400: '#51B651',
          500: '#00A651',
          600: '#008541',
          700: '#006431',
          800: '#004321',
          900: '#002211'
        },
        secondary: {
          DEFAULT: '#7B68EE', // CU 퍼플
          50: '#F0EEFF',
          100: '#D4C7FF',
          200: '#B8A0FF',
          300: '#9C79FF',
          400: '#8052FF',
          500: '#7B68EE',
          600: '#6247CC',
          700: '#4926AA',
          800: '#300588',
          900: '#170066'
        },
        accent: {
          DEFAULT: '#FF6B35', // 세븐일레븐 오렌지
          50: '#FFF2ED',
          100: '#FFD6C7',
          200: '#FFBAA1',
          300: '#FF9E7B',
          400: '#FF8255',
          500: '#FF6B35',
          600: '#E5522A',
          700: '#CC391F',
          800: '#B22014',
          900: '#990709'
        },
        // 기능별 컬러
        discount: '#FF4444',
        'new-product': '#FF8C00',
        'sold-out': '#999999',
        premium: '#FFD700'
      },
      fontFamily: {
        sans: [
          'Noto Sans KR',
          'Malgun Gothic',
          '맑은 고딕',
          'Apple SD Gothic Neo',
          'sans-serif'
        ]
      }
    },
  },
  plugins: [],
}