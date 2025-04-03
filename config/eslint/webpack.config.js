/* eslint-disable */
const customAlias = require('./alias');

const webpackConfig = { resolve: {
    alias: customAlias,
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
} };

module.exports = webpackConfig;