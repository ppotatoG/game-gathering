import path from 'path'

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack(config) {
    config.resolve.alias['@'] = path.join(__dirname, 'app')
    return config
  },
}

export default nextConfig
