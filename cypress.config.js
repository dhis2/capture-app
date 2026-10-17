const { chromeAllowXSiteCookies } = require('@dhis2/cypress-plugins');
const { defineConfig } = require('cypress');
const getCypressEnvVariables = require('./cypress/support/getCypressEnvVariables');
const cucumberPreprocessor = require('./cypress/support/cucumberPreprocessor');

async function setupNodeEvents(on, config) {
    await chromeAllowXSiteCookies(on);
    await cucumberPreprocessor(on, config);

    config.env = getCypressEnvVariables(config);
    return config;
}

module.exports = defineConfig({
    video: true,
    dhis2_datatest_prefix: 'dhis2-capture',
    defaultCommandTimeout: 25000,
    projectId: '322xnh',
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
