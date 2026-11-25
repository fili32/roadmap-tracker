import type { Config } from "jest";
import nextJest from "next/jest.js";

// Loads next.config.ts and .env files, and sets up the Next.js (SWC) transform.
const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // e2e/ holds the Playwright tests; they run with `npm run test:e2e`.
  testPathIgnorePatterns: ["<rootDir>/e2e/"],
};

// Exported this way so next/jest can load the (async) Next.js config.
export default createJestConfig(config);
