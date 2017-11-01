/* eslint-disable */
const dev = require('./config/dev.config.js');
const DEV_ENV = 'development';

module.exports = {
    webpack: function (config, env) {
        if(env === DEV_ENV){
            config = dev.rewire(config);
        }       
        return config;
    },
    jest: function (config) {
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
        config = dev.rewireDevServer(config);
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