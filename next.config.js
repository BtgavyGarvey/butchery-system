/** @type {import('next').NextConfig} */

module.exports = {
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false, net:false };

    return config;
  },
  
};
// const nextConfig = {
   
// }

// module.exports = nextConfig
