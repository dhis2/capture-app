/* eslint-disable */
const customAlias = require('./alias');

const webpackConfig = { resolve: {
    alias: customAlias
} };

module.exports = webpackConfig;