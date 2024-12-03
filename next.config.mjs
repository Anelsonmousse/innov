import withPWA from 'next-pwa';

const nextPWAConfig = {
  dest: 'public',
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add your Next.js configuration here
  // images: {
  //   domains: ['cdn.sanity.io'], // Add Sanity's image domain
  // },
};

export default withPWA({
  ...nextConfig,
  ...nextPWAConfig, // Merge PWA config with Next.js config
});