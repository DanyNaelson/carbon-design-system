import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@yourorg/design-system',
    '@yourorg/store-engine',
    '@yourorg/ai-bridge',
    '@yourorg/mcp-adapter',
  ],
};

export default nextConfig;
