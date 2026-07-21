/** @type {import("next").NextConfig} */
const nextConfig = {
  // Prioritize public/ static files over app router
  async rewrites() {
    return [
      {
        source: "/launching-soon/:path*",
        destination: "/launching-soon/:path*",
      },
    ];
  },
  // Skip middleware for launch page
  async headers() {
    return [
      {
        source: "/launching-soon/:path*",
        headers: [{ key: "x-middleware-next", value: "0" }],
      },
    ];
  },
  webpack: (config) => {
    config.ignoreWarnings = [{ module: /node_modules/ }];
    return config;
  },
};
export default nextConfig;
