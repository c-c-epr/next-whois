/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  reactStrictMode: true,

  transpilePackages: ["whoiser"],

  i18n: {
    locales: ["en", "zh", "zh-tw", "de", "ru", "ja", "fr", "ko"],
    defaultLocale: "en",
  },

  ...(process.env.NEXT_BUILD_DIR
    ? { distDir: process.env.NEXT_BUILD_DIR }
    : {}),
};

export default nextConfig;
