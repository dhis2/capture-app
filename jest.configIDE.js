/*
This is a config file for the Visual Studio Code Jest Runner plugin. Could be usable for other IDE plugins as well.
*/
const config = require('./node_modules/@dhis2/cli-app-scripts/config/jest.config');

module.exports = {
    roots: ['./src'],
    ...config,
};
