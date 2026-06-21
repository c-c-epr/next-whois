import setupPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  reactStrictMode: true,
  transpilePackages: ['whoiser'],

  i18n: {
    locales: ['en', 'zh', 'zh-tw', 'de', 'ru', 'ja', 'fr', 'ko'],
    defaultLocale: 'en',
  },

  ...(process.env.NEXT_BUILD_DIR
    ? { distDir: process.env.NEXT_BUILD_DIR }
    : {}),
};

const withPWA = setupPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  buildExcludes: [/manifest\.json$/, /_next\/data/, /_next\/static/],
  runtimeCaching: [
    {
      urlPattern: /^https?.*\.(css|js|woff2)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'assets-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        },
      },
    },
  ],
});

export default withPWA(nextConfig);