import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@constants': path.resolve(
        __dirname,
        'src/assets/styles/constants.scss',
      ),
    },
  },
})
