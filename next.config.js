/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/280CharsArentEnough' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/280CharsArentEnough' : '',
  trailingSlash: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|mp4|webm|ogg)$/i,
      type: 'asset/resource'
    });
    return config;
  }
};

module.exports = nextConfig;