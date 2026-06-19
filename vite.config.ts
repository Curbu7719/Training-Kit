import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// `base` is '/' in dev and '/Training-Kit/' for the production build so assets
// and routes resolve under the GitHub Pages project path
// (https://curbu7719.github.io/Training-Kit/).
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Training-Kit/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5174,
    strictPort: true, // fail if 5174 is occupied rather than silently picking another
  },
}));
