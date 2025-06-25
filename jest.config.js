const config = {
    moduleDirectories: ['core_modules', 'node_modules'],
    transform: {
        '^.+\\.m?[t|j]sx?$': require.resolve('./node_modules/@dhis2/cli-app-scripts/config/jest.transform.js'),
    },
    transformIgnorePatterns: ['/node_modules/(?!@dhis2/rule-engine/)'],
    moduleNameMapper: {
        '@dhis2/rule-engine(.*)': '<rootDir>/node_modules/@dhis2/rule-engine/rule-engine.mjs',
        '\\.(css|less)$': '<rootDir>/node_modules/@dhis2/cli-app-scripts/config/jest.identity.mock.js',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/node_modules/@dhis2/cli-app-scripts/config/jest.file.mock.js',
        '^styled-jsx/(css|macro)$': '<rootDir>/node_modules/@dhis2/cli-app-scripts/config/jest.styled-jsx-css.mock.js',
    },
    setupFilesAfterEnv: [require.resolve('regenerator-runtime/runtime')],
};

module.exports = config;
