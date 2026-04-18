import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  async rewrites() {
    // In production set API_BASE_URL=https://textile-api.kole.be in your host env.
    // Falls back to the local dev backend when not defined.
    const apiBase = process.env.API_BASE_URL ?? 'http://localhost:4877';
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:4877/:path*`,
        //destination: `https://textile-api.kole.be/:path*`,
        ///destination: `${apiBase}/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
