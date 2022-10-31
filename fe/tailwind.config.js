const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts}', './notes/*.{vue,js,ts}'],
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
