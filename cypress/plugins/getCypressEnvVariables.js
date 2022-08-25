/*
Retrieves Cypress environment variables from .env.cypress / .env.cypress.local
*/

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

module.exports = function getCypressEnvVariables(config) {
    const { fileServerFolder, env: inputCypressEnv } = config;

    const CONFIG_NAME_BASE = '.env.cypress';

    const dotenvFiles = [
        `${CONFIG_NAME_BASE}.local`,
        CONFIG_NAME_BASE,
    ];

    const cypressEnv = dotenvFiles
        .reduce((acc, file) => {
            const absolutePath = path.resolve(fileServerFolder, file);
            if (fs.existsSync(absolutePath)) {
                const parsed = dotenv.parse(fs.readFileSync(absolutePath, { encoding: 'utf8' }));
                return {
                    ...parsed,
                    ...acc,
                };
            }
            return acc;
        }, {});

    const applicableCypressEnv = Object
        .keys(cypressEnv)
        .reduce((acc, key) => {
            const prefix = 'CYPRESS_';
            if (key.toUpperCase().startsWith(prefix)) {
                const cypressKey = key.substring(prefix.length);
                acc[cypressKey] = cypressEnv[key];
            }
            return acc;
        }, {});

    return {
        ...applicableCypressEnv,
        ...inputCypressEnv,
    };
};
