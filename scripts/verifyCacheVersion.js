#!/usr/bin/env node
/**
 * Validate the version and cacheVersion specified in package.json
 * The version and cacheVersion compose the actual storage version.
 */
const packageDesc = require('../package');

function verifyMajorCacheVersion(serverVersionAsString) {
    if (!serverVersionAsString) {
        throw Error('Version not specified');
    }

    const serverVersion = Number(serverVersionAsString);
    if (Number.isNaN(serverVersion) || !Number.isSafeInteger(serverVersion) || serverVersion <= 30) {
        throw Error('Invalid app version');
    }
}

function verifyMinorCacheVersion(appCacheVersionAsString) {
    if (!appCacheVersionAsString) {
        throw Error('Cache version not specified');
    }

    const appCacheVersion = Number(appCacheVersionAsString);
    if (Number.isNaN(appCacheVersion) || !Number.isSafeInteger(appCacheVersion) || appCacheVersion >= 1000) {
        throw Error('Invalid cache version');
    }
}

const serverVersion = packageDesc.serverVersion;
const cacheVersion = packageDesc.cacheVersion;
verifyMajorCacheVersion(serverVersion);
verifyMinorCacheVersion(cacheVersion);
