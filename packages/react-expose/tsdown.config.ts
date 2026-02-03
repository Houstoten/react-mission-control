import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  platform: "browser",
  target: "es2020",
  dts: true,
  clean: true,
  sourcemap: false,
  external: ["react", "react-dom"],
  minify: true,
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
    const { cp, readdir, copyFile, unlink } = await import("node:fs/promises");
    const { join } = await import("node:path");
    try {
      await cp("src/components/styles.css", "dist/styles.css");
    } catch (_error) {
      // File might not exist, that's okay
    }
    // Copy hashed .d.ts to stable names for package.json "types" field
    const files = await readdir("dist");
    for (const file of files) {
      if (/^index-.+\.d\.ts$/.test(file)) {
        await copyFile(join("dist", file), "dist/index.d.ts");
        await unlink(join("dist", file)); // Remove hashed version
      }
      if (/^index-.+\.d\.cts$/.test(file)) {
        await unlink(join("dist", file)); // Remove duplicate CTS types
      }
    }
  },
});
