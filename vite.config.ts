import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Import the 'path' module

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'popup.html'),
        options: path.resolve(__dirname, 'options.html'),
        canvas: path.resolve(__dirname, 'src/canvas.tsx'), // Changed to point to TSX source
      },
      output: {
        // Configure output filenames (optional but recommended)
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
     },
     outDir: 'dist' // Specify the output directory
   }
   // base: './' // Removed - Let browser handle extension paths
 })
