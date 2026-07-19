import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "node:path";

// Builds ONE self-contained index.html (JS+CSS+data inlined) that opens
// directly in a browser — no server needed. Demo mode is forced on.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  define: { "import.meta.env.VITE_DEMO": JSON.stringify("true") },
});
