import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  publicDir: '../../common/public/',
  plugins: [
    react(),
    tsconfigPaths()
  ],
  build: {
    // Disables the preload.
    modulePreload: false,
  },
});
