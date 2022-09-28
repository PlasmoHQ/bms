/**
 * @type {import('@jest/types').Config.InitialOptions}
 */

const config = {
  clearMocks: true,
  testTimeout: 60000 * 5, // Test can run for 5 minutes
  moduleFileExtensions: ["js", "ts"],
  extensionsToTreatAsEsm: [".ts"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true
      }
    ]
  },
  verbose: true,
  moduleNameMapper: {
    "^~(.*)$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  modulePaths: ["<rootDir>"]
}
export default config
