/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'standalone',

  // Work around SWC server-bundle bug that mangles template strings
  swcMinify: false,

  // Strip console.* in prod (removes the offending console.error lines)
  compiler: {
    removeConsole: isProd ? true : false,
  },

  // Make sure Radix/shadcn deps are transpiled in Next’s pipeline
  transpilePackages: [
    'lucide-react',
    '@radix-ui/react-progress',
    '@radix-ui/react-slot',
    '@radix-ui/react-label',
    '@radix-ui/react-select',
    '@radix-ui/react-dialog',
    '@radix-ui/react-popover',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-toast',
  ],

  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
}

module.exports = nextConfig
