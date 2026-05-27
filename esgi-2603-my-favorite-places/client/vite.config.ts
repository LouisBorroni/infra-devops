import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const apiTarget = process.env.API_URL;
const proxyConfig = { "/api": { target: apiTarget, changeOrigin: true } };

export default defineConfig({
  plugins: [react()],
  server: { proxy: proxyConfig },
  preview: { proxy: proxyConfig },
});
