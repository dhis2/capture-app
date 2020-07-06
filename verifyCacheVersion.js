#!/usr/bin/env node
/**
 * Validate the version and cacheVersion specified in package.json
 * The version and cacheVersion compose the actual storage version.
 */
const packageDesc = require('./package.json');

function verifyMajorCacheVersion(appVersion) {
    if (!appVersion) {
        console.log('Version not specified');
        process.exit(1);
    }

    const appMajorVersion = Number(appVersion.split('.')[0]);
    if (Number.isNaN(appMajorVersion) || !Number.isSafeInteger(appMajorVersion) || appMajorVersion <= 30) {
        console.log('Invalid app version');
        process.exit(1);
    }
}

function verifyMinorCacheVersion(appCacheVersionAsString) {
    if (!appCacheVersionAsString) {
        console.log('Cache version not specified');
        process.exit(1);
    }

    const appCacheVersion = Number(appCacheVersionAsString);
    if (Number.isNaN(appCacheVersion) || !Number.isSafeInteger(appCacheVersion) || appCacheVersion >= 1000) {
        console.log('Invalid cache version');
        process.exit(1);
    }
}

const appVersion = packageDesc.version;
const cacheVersion = packageDesc.cacheVersion;
verifyMajorCacheVersion(appVersion);
verifyMinorCacheVersion(cacheVersion);
