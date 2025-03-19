const config = {
    moduleDirectories: ['core_modules', 'node_modules'],
    transform: {
        '^.+\\.m?[t|j]sx?$': require.resolve('./node_modules/@dhis2/cli-app-scripts/config/jest.transform.js'),
    },
    transformIgnorePatterns: ['/node_modules/(?!@dhis2/rule-engine/)'],
    moduleNameMapper: {
        '@dhis2/rule-engine(.*)': '<rootDir>/node_modules/@dhis2/rule-engine/rule-engine.mjs',
    },
};

module.exports = config;
