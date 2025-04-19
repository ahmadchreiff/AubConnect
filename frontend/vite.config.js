import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add these configurations:
  base: '/', // Ensures assets are loaded from the root
  server: {
    historyApiFallback: true, // For dev server (optional)
  },
  build: {
    outDir: 'dist', // Explicit output directory
    emptyOutDir: true, // Clears the output directory on build
  },
});

