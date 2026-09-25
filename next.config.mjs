/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Admin uploads are served from MongoDB via /api/uploads/**; /images/** holds the client's live-site photos; Cloudinary holds the logo.
    localPatterns: [{ pathname: '/api/uploads/**' }, { pathname: '/images/**' }],
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },
}

export default nextConfig
