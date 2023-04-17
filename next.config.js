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
};

module.exports = nextConfig;
