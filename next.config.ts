import path from 'path';
import type { NextConfig } from 'next';
const isProd = process.env.NODE_ENV === 'production';
const internalHost = process.env.TAURI_DEV_HOST || 'localhost';

const nextConfig: NextConfig = {
  output: 'export',
  turbopack: {
    root: path.join(__dirname, '..'),
  },
  images: {
    unoptimized: true,
  },
  assetPrefix: isProd ? undefined : `http://${internalHost}:45545`,
};

export default nextConfig;
