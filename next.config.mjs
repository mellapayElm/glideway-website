/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['vm-7fyqycj68zdl3bmrotcjhv5c.vusercontent.net'],
}

export default nextConfig
