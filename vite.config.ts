import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Import the 'path' module

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // Adjust these paths if your HTML files are located elsewhere (e.g., inside src/)
        popup: path.resolve(__dirname, 'popup.html'),
        options: path.resolve(__dirname, 'options.html'),
        // If you have a main canvas page as a separate HTML file, add it here:
        // main: path.resolve(__dirname, 'canvas.html'),
      },
      output: {
        // Configure output filenames (optional but recommended)
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    },
    outDir: 'dist' // Specify the output directory
  },
  base: './' // Use relative paths for assets in the build output
})