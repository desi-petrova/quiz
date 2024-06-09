import daisyui from 'daisyui';

export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
        colors: {
          'custom-yellow': '#fbe300',
        },
        backgroundOpacity: {
          '55': '0.55',
          '65': '0.65',
          '75': '0.75',
          '85': '0.85',
         }
    },
  },
  // Temporarily disable or modify the purge option
  // purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  plugins: [daisyui],
};
