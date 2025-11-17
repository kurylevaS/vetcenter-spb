/** @type {import('next').NextConfig} */
const moduleExports = {
  reactStrictMode: false,
  images: {
    unoptimized: Boolean(Number(process.env.UNOPTIMIZED_IMAGES)),
    deviceSizes: [767, 980, 1156, 1400, 1920],
    formats: ['image/webp'],
    domains: ['via.placeholder.com', 'api.vetcenterspb.ru'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
module.exports = moduleExports;

// Injected content via Sentry wizard below
