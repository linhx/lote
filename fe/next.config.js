const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  async redirects() {
    return [
      {
        source: '/today-i-learned/:slug',
        destination: '/note/:slug',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
