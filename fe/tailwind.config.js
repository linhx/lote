const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: {
    content: ['./index.html', './src/**/*.{vue,js,ts}', './notes/*.{vue,js,ts}'],
    safelist: [ // classes of note component
      'w-full',
      'md:max-w-3xl',
      'mx-auto',
      'py-10',
      'font-bold',
      'text-sm',
      'text-xl',
      'text-3xl',
      'text-right',
      'text-orange-600',
      'text-gray-600',
      'mr-2',
      'border-0',
      'mt-5',
      'bg-gray-200',
      'px-1',
      'mx-1',
      'mt-4'
    ]
  },
  darkMode: false,
  corePlugins: {
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
