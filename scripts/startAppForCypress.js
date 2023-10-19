#!/usr/bin/env node
/*
Starts the app using environment variables from .env.cypress / .env.cypress.local
*/

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { exec } = require('@dhis2/cli-helpers-engine');

const CONFIG_NAME_BASE = '.env.cypress';

const dotenvFiles = [
    `${CONFIG_NAME_BASE}.local`,
    CONFIG_NAME_BASE,
];

const envFromCypressFiles = dotenvFiles
    .reduce((acc, file) => {
        const absolutePath = path.resolve('.', file);
        if (fs.existsSync(absolutePath)) {
            const parsed = dotenv.parse(fs.readFileSync(absolutePath, { encoding: 'utf8' }));
            return {
                ...parsed,
                ...acc,
            };
        }
        return acc;
    }, {});

const allEnvVariables = {
    ...envFromCypressFiles,
    ...(process.env || {}),
};

const env = Object
    .keys(allEnvVariables)
    .reduce((acc, key) => {
        if (key.toUpperCase().startsWith('REACT_APP')) {
            const reactKey = key.substring(10);
            if (!['DHIS2_BASE_URL', 'DHIS2_API_VERSION'].includes(reactKey)) {
                acc[key] = allEnvVariables[key];
            }
        } else if (key.toUpperCase() === 'CYPRESS_DHIS2BASEURL') {
            acc.REACT_APP_DHIS2_BASE_URL = allEnvVariables[key];
        } else if (key.toUpperCase() === 'CYPRESS_DHIS2APIVERSION') {
            acc.REACT_APP_DHIS2_API_VERSION = allEnvVariables[key];
        } else if (key.toUpperCase() === 'NODE_OPTIONS') {
            acc[key] = allEnvVariables[key];
        }
        return acc;
    }, { BROWSER: 'none' });

exec({
    cmd: 'yarn',
    args: ['run', 'start'],
    cwd: '.',
    env,
    pipe: true,
});
