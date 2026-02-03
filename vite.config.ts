import preactRefresh from "@prefresh/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
  // prevent Vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
    jsxImportSource: "preact",
  },
  plugins: [tailwindcss(), preactRefresh()],
}));
