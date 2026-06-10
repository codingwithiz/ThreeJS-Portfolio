import process from 'node:process';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Expose the server-only key to the dev middleware (never bundled to the client)
  if (env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY) {
    process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
  }

  return {
    build: {
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('react-globe') || id.includes('three-globe')) return 'globe-vendor';
            if (id.includes('@react-three') || id.includes('three-stdlib')) return 'r3f-vendor';
            if (id.includes('/three/') || id.includes('\\three\\')) return 'three-vendor';
            if (id.includes('framer-motion')) return 'motion-vendor';
            if (id.includes('gsap')) return 'gsap-vendor';
            if (id.includes('hls.js')) return 'hls-vendor';
            return undefined;
          },
        },
      },
    },
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
