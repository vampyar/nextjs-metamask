/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'https://assets.coingecko.com',
      'https://cryptologos.cc',
      'https://s2.coinmarketcap.com',
    ],
  },
  eslint: {
    dirs: ['.'], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  },
};

module.exports = nextConfig;
