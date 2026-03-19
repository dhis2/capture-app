#!/usr/bin/env node
/**
 * Validate the cacheVersion specified in package.json
 * The cacheVersion is included in the composed storage version.
 */
const packageDesc = require('../package');

function verifyCacheVersion(appCacheVersionAsString) {
    if (!appCacheVersionAsString) {
        throw Error('Cache version not specified');
    }

    const appCacheVersion = Number(appCacheVersionAsString);
    if (Number.isNaN(appCacheVersion) || !Number.isSafeInteger(appCacheVersion)) {
        throw Error('Invalid cache version');
    }
}

const cacheVersion = packageDesc.cacheVersion;
verifyCacheVersion(cacheVersion);
