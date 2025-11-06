module.exports = {
  transform: { "^.+\\.js$": "babel-jest" },
  testEnvironment: "node",
  verbose: true,
  moduleFileExtensions: ["js", "json"],
  transformIgnorePatterns: [
    "/node_modules/(?!(express|helmet|cors|morgan|mongoose|supertest)/)",
  ],
  setupFiles: ["<rootDir>/jest.setup.cjs"],
  collectCoverage: true,
  coverageThreshold: { global: { lines: 80 } },
};
