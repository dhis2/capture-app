#!/usr/bin/env node
/*
Starts the app using environment variables from .env.cypress / .env.cypress.local
*/

const path = require('path');
const fs = require('fs');
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

const env = Object
    .keys(envFromCypressFiles)
    .reduce((acc, key) => {
        if (key.startsWith('REACT')) {
            acc[key] = envFromCypressFiles[key];
        } else if (key === 'dhis2BaseUrl') {
            acc.REACT_APP_DHIS2_BASE_URL = envFromCypressFiles[key];
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
