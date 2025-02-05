const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      "fs": false,
      "net": false,
      "tls": false,
      "child_process": false,
    };
    return config;
  },
};

export default nextConfig;
