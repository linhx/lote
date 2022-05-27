const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts}'],
  darkMode: false,
  corePlugins: {
    // preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'sans-serif', ...defaultTheme.fontFamily.sans],
      }
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
