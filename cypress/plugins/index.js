const plugins = require('@dhis2/cli-utils-cypress/plugins');
const getCypressEnvVariables = require('./getCypressEnvVariables');

module.exports = (on, config) => {
    on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
            launchOptions.extensions.push(path.join(__dirname, '/ignore-x-frame-headers'));
        }

        return launchOptions;
    });

    plugins(on, config);

    // Add additional plugins here
    config.env = getCypressEnvVariables(config);
    return config;
};
