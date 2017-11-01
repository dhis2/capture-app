/* eslint-disable */
const path = require('path');
const fs = require('fs');

const alias = {};

function fileExists(filePath) {
    return fs.existsSync(filePath);
}

if (fileExists(path.resolve(__dirname, './../src/core_modules/d2-tracker/src'))) {
    alias['d2-tracker'] = path.resolve(__dirname, './../src/core_modules/d2-tracker/src');
}

module.exports = alias;
