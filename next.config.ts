import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://textile-api.kole.be/:path*',
       //destination: 'http://localhost:4877/:path*',
      },
    ];
  },
};

export default withNextIntl(nextConfig);
