import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Alias @/ → src/ (el mismo alias se declara en tsconfig.app.json, en "paths").
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
});
