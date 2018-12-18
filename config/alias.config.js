/* eslint-disable */
const path = require('path');
const fs = require('fs');

const alias = {};

function fileExists(filePath) {
    return fs.existsSync(filePath);
}

if (fileExists(path.resolve(__dirname, './../src/core_modules/capture-core/src'))) {
    alias['capture-core'] = path.resolve(__dirname, './../src/core_modules/capture-core/src');
    alias['capture-ui'] = path.resolve(__dirname, './../src/core_modules/capture-ui/src');
    alias['capture-core-utils'] = path.resolve(__dirname, './../src/core_modules/capture-core-utils/src');
}

module.exports = alias;
