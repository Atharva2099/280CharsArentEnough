/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/280CharsArentEnough' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/280CharsArentEnough' : '',
  trailingSlash: true,
}

module.exports = nextConfig