import daisyui from 'daisyui';

export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
        colors: {
          'custom-yellow': '#fbe300',
        },
    //   backgroundColor: {
    //   'primary': '#3490dc',
    //   'accent': '#ffed4a',
    // }
    },
  },
  // Temporarily disable or modify the purge option
  // purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  plugins: [daisyui],
};
