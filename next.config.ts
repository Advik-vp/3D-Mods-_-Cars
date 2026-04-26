import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://sketchfab.com https://static.sketchfab.com",
              "frame-src 'self' https://sketchfab.com",
              "img-src 'self' data: blob: https: *",
              "media-src 'self' blob: https:",
              "connect-src 'self' ws://localhost:* wss://localhost:* https://sketchfab.com https://api.sketchfab.com https://fonts.googleapis.com https://fonts.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "worker-src 'self' blob:",
            ].join("; ")
          }
        ]
      }
    ];
  }
};

export default nextConfig;
