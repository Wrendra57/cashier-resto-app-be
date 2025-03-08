module.exports = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    verbose: true,
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest"
    },
    maxConcurrency: 1,
    maxWorkers: 1,
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
