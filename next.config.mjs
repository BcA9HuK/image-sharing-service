/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Отключаем ESLint проверку при сборке на production
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Отключаем TypeScript проверку при сборке на production
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
