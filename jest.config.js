module.exports = {
    // testMatch: [
    //     "**/*[Tt]est.(js|ts)"
    // ],
    verbose: true,
    collectCoverage: true,
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    transform: {
        "^.+\.(ts|tsx)$": "ts-jest"
    },
    // setupFiles: [
    //     './characterSearchAndRegistration.ts'
    // ]
};
