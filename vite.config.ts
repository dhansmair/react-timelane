import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
// import vitePluginSass from "vite-plugin-sass";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // vitePluginSass(),
    dts({ include: ["lib"] }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
    },
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `
  //         @import "TimelineV3/layout/layout.scss";
  //       `,
  //     },
  //   },
  // },
});
