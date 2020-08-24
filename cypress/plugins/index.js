const plugins = require('@dhis2/cli-utils-cypress/plugins');
const getCypressEnvVariables = require('./getCypressEnvVariables');

module.exports = (on, config) => {
    plugins(on, config);

    // Add additional plugins here
    config.env = getCypressEnvVariables(config);
    return config;
};
