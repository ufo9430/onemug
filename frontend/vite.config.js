import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: "client",
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "../dist/spa", // 빌드 결과물은 루트 기준으로 상위
  },
  plugins: [react()], // expressPlugin() 제거
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin() {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();
      // 오직 /api 경로에만 Express를 붙임
      // server.middlewares.use("/api", app);
    },
  };
}
