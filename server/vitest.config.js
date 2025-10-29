import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: [
      "apps/**/*.{test,spec}.{js,ts}",
      "../docs/.copilot/__tests__/**/*.{test,spec}.{js,ts}"
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "**/tests/",
        "**/*.config.js",
        "../docs/.copilot/__tests__/"
      ],
      include: [
        "apps/**/*.{js,ts}",
        "../docs/.copilot/**/*.md"
      ]
    },
  },
});
