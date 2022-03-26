module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/test/.*\\.(test|spec))\\.(tsx?|jsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  modulePathIgnorePatterns: ["build", "dist"],
  moduleNameMapper: {
    "^/(.*)": "<rootDir>/src/main/$1",
    "^constants/(.*)": "<rootDir>/src/main/constants/$1",
    "^ducks/(.*)": "<rootDir>/src/main/ducks/$1",
    "^renderers/(.*)": "<rootDir>/src/main/renderers/$1",
    "^stores/(.*)": "<rootDir>/src/main/stores/$1",
    "^types/(.*)": "<rootDir>/src/main/types/$1",
    "^utils/(.*)": "<rootDir>/src/main/utils/$1",
  },
  setupFiles: ["jest-canvas-mock"],
};
