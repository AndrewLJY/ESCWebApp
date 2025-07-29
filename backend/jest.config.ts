import { Config } from "jest";

// jest.config.js
const config: Config = {
  testEnvironment: "node",
  // ... other Jest configurations
  collectCoverage: true,
  coverageReporters: ["text", "html"],
  roots: ["./testing"],
};

export default config;
