import WorkboxWebpackPlugin from 'workbox-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable Next.js image optimization for static export
  },
  output: 'export', // Static export mode
  webpack(config, { isServer }) {
    if (!isServer) {
      config.plugins.push(
        new WorkboxWebpackPlugin.GenerateSW({
          swDest: 'public/sw.js',
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
              },
            },
            {
              urlPattern: /\/$/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'home-cache',
                expiration: {
                  maxEntries: 5,   
                  maxAgeSeconds: 60 * 60 * 24, // 1 day
                },
              },
            },
          ],
        })
      );
    }

    return config;
  },
};

export default nextConfig;
