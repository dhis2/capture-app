const {
    networkShim,
    chromeAllowXSiteCookies,
    cucumberPreprocessor,
} = require('@dhis2/cypress-plugins');

const getCypressEnvVariables = require('./getCypressEnvVariables');
const path = require('path');

module.exports = (on, config) => {
    networkShim(on);
    chromeAllowXSiteCookies(on);
    cucumberPreprocessor(on, config);
    on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
            launchOptions.extensions.push(path.join(__dirname, '/ignore-x-frame-headers'));

            launchOptions.args.push('--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure,SameSiteDefaultChecksMethodRigorously');
        }

        return launchOptions;
    });

    // Add additional plugins here
    config.env = getCypressEnvVariables(config);
    return config;
};
