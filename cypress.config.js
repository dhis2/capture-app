const { chromeAllowXSiteCookies } = require('@dhis2/cypress-plugins');
const { defineConfig } = require('cypress');
const getCypressEnvVariables = require('./cypress/support/getCypressEnvVariables');
const cucumberPreprocessor = require('./cypress/support/cucumberPreprocessor');

// Cypress 12 can't parse the version of Chrome for Testing ("Google Chrome for Testing <version>"),
// so it skips --proxy-bypass-list=<-loopback> and the browser never connects. Remove after upgrading Cypress.
const routeLoopbackThroughProxyForChromeForTesting = (browser, launchOptions) => {
    if (browser.name === 'chrome' && Number.isNaN(Number(browser.majorVersion))) {
        launchOptions.args.push('--proxy-bypass-list=<-loopback>');
    }
    return launchOptions;
};

async function setupNodeEvents(on, config) {
    await chromeAllowXSiteCookies((event, handler) => on(event, (browser, launchOptions) =>
        routeLoopbackThroughProxyForChromeForTesting(browser, handler(browser, launchOptions))));
    await cucumberPreprocessor(on, config);

    config.env = getCypressEnvVariables(config);
    return config;
}

module.exports = defineConfig({
    video: true,
    dhis2_datatest_prefix: 'dhis2-capture',
    chromeWebSecurityComment:
    'chromeWebSecurity should removed once https://github.com/cypress-io/cypress/issues/4220 is fixed',
    chromeWebSecurity: false,
    defaultCommandTimeout: 25000,
    projectId: '322xnh',
    experimentalFetchPolyfill: true,
    retries: {
        runMode: 3,
    },
    env: {
        dhis2DataTestPrefix: 'capture-app',
        networkMode: 'live',
    },
    e2e: {
        setupNodeEvents,
        baseUrl: 'http://localhost:3000',
        specPattern: 'cypress/e2e/**/*.feature',
    },
});
