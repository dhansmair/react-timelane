import { resolve } from 'path'
// import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
// import viteTsconfigPaths from 'vite-tsconfig-paths';

// const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es']
    },
  },
    commonjsOptions: { include: [] },
  //   rollupOptions: {
  //     // make sure to externalize deps that shouldn't be bundled
  //     // into your library
  //     external: ['react'],
  //     output: {
  //       // Provide global variables to use in the UMD build
  //       // for externalized deps
  //       globals: {
  //         react: 'React',
  //       },
  //     },
  //   },
  // },
})