/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: '.next-launch',
  pageExtensions: ['tsx'],
  // Only export the launch page
  exportPathMap: async () => ({
    '/launching-soon': { page: '/launching-soon' },
  }),
  // Disable TypeScript checks for speed
  typescript: { ignoreBuildErrors: true },
  // Disable ESLint for speed  
  eslint: { ignoreDuringBuilds: true },
  webpack: (config) => {
    config.ignoreWarnings = [{ module: /node_modules/ }]
    return config
  }
}
export default nextConfig
