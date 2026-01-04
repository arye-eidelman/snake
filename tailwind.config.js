/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '16': 'repeat(16, minmax(0, 1fr))',
        '25': 'repeat(25, minmax(0, 1fr))',
        '40': 'repeat(40, minmax(0, 1fr))',
        '50': 'repeat(50, minmax(0, 1fr))',
        '75': 'repeat(25, minmax(0, 1fr))',
        '100': 'repeat(100, minmax(0, 1fr))'
      },
      screens: {
        'portrait': {'raw': '(orientation: portrait)'},
        'lanscape': {'raw': '(orientation: lanscape)'}
      }
    },
  },
  plugins: [],
}
