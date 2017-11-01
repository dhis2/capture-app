/* eslint-disable */
const customAlias = require('./devAlias.config');

const webpackConfig = { resolve: {
    alias: customAlias
} };

module.exports = webpackConfig;
