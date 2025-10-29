import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./apps/web/src/setupTests.ts"],
    include: [
      "apps/**/*.{test,spec}.{js,ts}"
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "**/tests/",
        "**/*.config.js"
      ],
      include: [
        "apps/**/*.{js,ts}",
        "../.copilot/**/*.md"
      ]
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  }
});
