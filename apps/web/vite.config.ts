import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/Study_material/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) return 'vendor-react';
          if (id.includes('/@react-three/fiber/')) return 'vendor-r3f';
          if (id.includes('/@react-three/drei/')) return 'vendor-drei';
          if (id.includes('/three/')) return 'vendor-three';
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
}));
