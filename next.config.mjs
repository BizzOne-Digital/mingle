/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Admin uploads are served from MongoDB via /api/uploads/**; the two remote hosts hold the logo and temporary imagery.
    localPatterns: [{ pathname: '/api/uploads/**' }],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}

export default nextConfig
