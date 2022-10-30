const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: {
    content: ['./index.html', './src/**/*.{vue,js,ts}', './notes/*.{vue,js,ts}']
  },
  darkMode: false,
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'sans-serif', ...defaultTheme.fontFamily.sans],
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
