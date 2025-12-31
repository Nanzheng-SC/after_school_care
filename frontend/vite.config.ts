import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode: _mode }) => ({
  plugins: [],
  server: {
    allowedHosts: true,
    hmr: {
      path: '/ws',
    }
  },
}));
