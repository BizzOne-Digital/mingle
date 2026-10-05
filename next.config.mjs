/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // "Services" was renamed "Offerings": keep old links and search results working.
  async redirects() {
    return [
      { source: '/services', destination: '/offerings', permanent: true },
      { source: '/services/:slug', destination: '/offerings/:slug', permanent: true },
      // Our Team and Blogs were removed from the public site; send old links somewhere useful instead of a 404.
      { source: '/team', destination: '/about', permanent: true },
      { source: '/blogs', destination: '/', permanent: true },
      { source: '/blogs/:slug', destination: '/', permanent: true },
    ]
  },
  images: {
    // Admin uploads are served from MongoDB via /api/uploads/**; /images/** holds the client's live-site photos; Cloudinary holds the logo.
    localPatterns: [{ pathname: '/api/uploads/**' }, { pathname: '/images/**' }],
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },
}

export default nextConfig
