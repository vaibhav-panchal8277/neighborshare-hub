/** @type {import('next').NextConfig} */
const supabaseHostnames = [
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  'https://uyalyjetzueqzmckvedt.supabase.co',
]
  .map((url) => {
    try {
      return new URL(url).hostname
    } catch {
      return null
    }
  })
  .filter((hostname, index, hostnames) => hostname && hostnames.indexOf(hostname) === index)

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      ...supabaseHostnames.map((hostname) => ({
        protocol: 'https',
        hostname,
        pathname: '/storage/v1/object/public/**',
      })),
    ],
  },
};

export default nextConfig;
