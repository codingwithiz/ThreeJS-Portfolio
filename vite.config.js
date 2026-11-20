import process from 'node:process';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

import { n as liveChecks } from './scripts/check-live.mjs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Expose the server-only key to the dev middleware (never bundled to the client)
  if (env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY) {
    process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
  }

  return {
    // the build receipt on the home page prints how many checks passed for this build
    define: { __LIVE_CHECKS__: liveChecks },
    plugins: [
      react(),
      {
        // Serve the /api/chat serverless function during `npm run dev`
        // (Vite doesn't run /api functions on its own — this bridges to the same handler Vercel uses)
        name: 'dev-api-chat',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res) => {
            try {
              const mod = await server.ssrLoadModule('/api/chat.js');
              await mod.default(req, res);
            } catch (e) {
              console.error('dev /api/chat error', e);
              if (!res.headersSent) res.statusCode = 500;
              res.end('chat error');
            }
          });
        },
      },
    ],
  };
});
