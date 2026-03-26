import type { NextConfig } from "next";

/**
 * LAN dev troubleshooting (other PC “stuck”):
 * - No connection / long timeout → Windows Firewall on the host (see scripts/open-windows-dev-server-firewall.ps1).
 * - Page starts loading but never finishes → dev-only asset blocking; `allowedDevOrigins` below fixes typical private LAN hostnames.
 */
const nextConfig: NextConfig = {
  // Dev-only: allow browsers that open the site via LAN IP or *.local (mDNS) so /_next/* and HMR are not 403’d.
  // Entries are hostnames only (no scheme/port), per Next.js allowedDevOrigins.
  allowedDevOrigins: [
    "192.168.*.*",
    "10.*.*.*",
    "172.*.*.*",
    "*.local",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
