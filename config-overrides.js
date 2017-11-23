/* eslint-disable */
const rewires = require('./config/rewire.config.js');
var fs = require('fs');


module.exports = {
    webpack: function (config, env) {
        config = rewires.webpack(config);               
        return config;
    },
    jest: function (config) {       
        config.transformIgnorePatterns = [
            "/node_modules/(?!d2-ui).+(js|jsx|mjs)$"
        ];

        config.moduleNameMapper = Object.assign({}, config.moduleNameMapper, {
            "^d2-tracker(.*)$": "<rootDir>/src/core_modules/d2-tracker/src$1"
        });
        
        return config;
    },
    // configFunction is the original react-scripts function that creates the
    // Webpack Dev Server config based on the settings for proxy/allowedHost.
    // react-scripts injects this into your function (so you can use it to
    // create the standard config to start from), and needs to receive back a
    // function that takes the same arguments as the original react-scripts
    // function so that it can be used as a replacement for the original one.
    devServer: function (configFunction) {
        return function(proxy, allowedHost) {
        let config = configFunction(proxy, allowedHost);
        config = rewires.devServer(config);
        // Edit config here - example: set your own certificates.
        //
        // const fs = require('fs');
        // config.https = {
        //   key: fs.readFileSync(process.env.REACT_HTTPS_KEY, 'utf8'),
        //   cert: fs.readFileSync(process.env.REACT_HTTPS_CERT, 'utf8'),
        //   ca: fs.readFileSync(process.env.REACT_HTTPS_CA, 'utf8'),
        //   passphrase: process.env.REACT_HTTPS_PASS
        // };
        
        return config;
        };
    }
}