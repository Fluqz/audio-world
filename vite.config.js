const { defineConfig } = require('vite')
const { resolve } = require('path')

module.exports = defineConfig({
  root: './src/client',
  base: '/',
  publicDir: '../../public',
  server: {
    port: 3000,
    proxy: {
      '/socket.io': {
        target: 'http://localhost:8080',
        ws: true
      }
    }
  },
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    sourcemap: true
  }
})
