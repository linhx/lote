const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts}', './notes/*.{vue,js,ts}'],
  darkMode: false,
  corePlugins: {
  },
  theme: {
    extend: {
      fontFamily: {
        'sans': ["Open Sans", ...defaultTheme.fontFamily.sans],
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
