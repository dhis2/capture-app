const preprocessor = require('@badeball/cypress-cucumber-preprocessor');
const webpack = require('@cypress/webpack-preprocessor');

module.exports = async function cucumberPreprocessor(on, config) {
    // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
    await preprocessor.addCucumberPreprocessorPlugin(on, config);

    on(
        'file:preprocessor',
        webpack({
            webpackOptions: {
                resolve: {
                    extensions: ['.ts', '.js'],
                },
                module: {
                    rules: [
                        {
                            test: /\.feature$/,
                            use: [
                                {
                                    loader: '@badeball/cypress-cucumber-preprocessor/dist/bundler-utils/webpack',
                                    options: config,
                                },
                            ],
                        },
                    ],
                },
            },
        }),
    );
};
