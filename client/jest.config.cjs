// // ✅ Correct: must be a string *key*, but valid regex *inside*
// module.exports = {
//   testEnvironment: "jsdom",
//   setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
//   moduleNameMapper: {
//     "\\.(css|less|scss|sass)$": "identity-obj-proxy", // ✅ FIXED
//   },
// };

module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(png|jpg|jpeg|gif|svg|webp)$": "<rootDir>/src/test/mocks/fileMock.js",
  },
};
