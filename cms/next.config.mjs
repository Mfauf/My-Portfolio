import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence the workspace-root warning caused by the sibling lockfile in ../
  turbopack: { root: fileURLToPath(new URL('.', import.meta.url)) },
  // 127.0.0.1 and localhost are different origins as far as Next's dev-server
  // CSRF check is concerned — allow both so it doesn't matter which one loads.
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
};

export default nextConfig;

// Gives `next dev` access to Cloudflare bindings/secrets, matching the
// Workers runtime this app actually deploys to.
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();
