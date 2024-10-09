import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import env from "vite-plugin-env-compatible";

export default defineConfig({
  test: {
    coverage: {
      provider: "istanbul",
      reportsDirectory: "./tests/coverage",
    },
    setupFiles: ["vitest.setup.ts"],
  },
  plugins: [env()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
      "~": fileURLToPath(new URL("./src/modules/", import.meta.url)),
    },
  },
});
