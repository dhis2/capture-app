/* eslint-disable */
const customAlias = require('./alias.config');

const webpackConfig = { resolve: {
    alias: customAlias
} };

module.exports = webpackConfig;
