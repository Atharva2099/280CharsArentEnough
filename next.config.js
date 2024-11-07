/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  basePath: '/280CharsArentEnough',
  assetPrefix: '/280CharsArentEnough',
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|mp4|webm|ogg)$/i,
      type: 'asset/resource'
    });
    return config;
  }
}

module.exports = nextConfig
