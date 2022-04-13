const { resolve } = require("path");
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { CSSManifestPlugin } from "vite-manifest-css";
import copy from "rollup-plugin-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), CSSManifestPlugin()],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./node_modules/"),
    },
  },
  build: {
    manifest: true,
    outDir: "static",
    rollupOptions: {
      plugins: [
        copy({
          targets: [
            // https://github.com/vitejs/vite/issues/1618#issuecomment-764579557
            {
              src: "./node_modules/@fortawesome/fontawesome-free/webfonts/**/*",
              dest: "static/webfonts",
            },
            {
              src: "./node_modules/@fontsource/lato/files/**/*",
              dest: "static/webfonts",
            },
            {
              src: "./node_modules/@fontsource/raleway/files/**/*",
              dest: "static/webfonts",
            },
          ],
          hook: "writeBundle",
        }),
      ],
      input: {
        index: resolve(__dirname, "assets/js/index.js"),
        settings: resolve(__dirname, "assets/js/settings.js"),
        challenges: resolve(__dirname, "assets/js/challenges.js"),
        scoreboard: resolve(__dirname, "assets/js/scoreboard.js"),
        teams_public: resolve(__dirname, "assets/js/teams/public.js"),
        teams_private: resolve(__dirname, "assets/js/teams/private.js"),
        users_public: resolve(__dirname, "assets/js/users/public.js"),
        users_private: resolve(__dirname, "assets/js/users/private.js"),
        main: resolve(__dirname, "assets/scss/main.scss"),
      },
    },
  },
});
