import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  platform: "browser",
  target: "es2020",
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom"],
  minify: process.env.NODE_ENV === "production",
  treeshake: true,
  banner: {
    js: '"use client"',
  },
  // Handle CSS imports
  moduleTypes: {
    ".css": "css",
  },
  outDir: "dist",
  // Copy CSS files to dist
  onSuccess: async () => {
    const { cp } = await import("node:fs/promises");
    try {
      await cp("src/components/styles.css", "dist/styles.css");
    } catch (_error) {
      // File might not exist, that's okay
    }
  },
});
