/* eslint-disable */
'use strict';

const { compose } = require('react-app-rewired');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const customAlias = require('./devAlias.config');
let auth;

function getDhisConfig(fileContents) {
    let convertedConfig = {};    
    let lines = fileContents.split(/\r?\n/);

    lines.forEach((function(line) {
        var lineTrimmed = line.trim();
        if (lineTrimmed) {
            let splitIndex = line.indexOf(" ");
            if (splitIndex >= 0) {
                let id = line.substring(0, splitIndex);
                let value = line.substring(splitIndex).trim();
                if (value && id) {
                    id = id.toUpperCase();
                    if (id === "BASEURL") {
                        convertedConfig.baseUrl = value;                        
                    }
                    else if (id === "AUTHORIZATION") {
                        if (value.match(/^basic/i)) {
                            let valueParts = value.split(" ");
                            if (valueParts.length === 2) {
                                let newValue = valueParts[0] + " " + new Buffer(valueParts[1]).toString('base64');
                                convertedConfig.authorization = newValue;
                            }                                                         
                        } else {
                            convertedConfig.authorization = value;
                        }
                    }
                }
            }
        }        
    }));

    return convertedConfig;
}  

function fileExists(filePath) {
    return fs.existsSync(filePath);
}

function getFileContents(filePath) {
    if(fs.existsSync(filePath)) {
        var data = fs.readFileSync(filePath, 'utf8');    
        return getDhisConfig(data);    
    }
    return null;    
}

function getDhisConfig() {
    let dhisConfig;
    
    const dhisAppDevConfigPath = process.env.DHIS2_HOME && `${process.env.DHIS2_HOME}/appDev.config`;
    try {
        dhisConfig = getFileContents(dhisAppDevConfigPath);
    } catch (error) {
        console.log('\nWARNING! Failed to load DHIS appDevConfig:' + e.message);
    }

    if(!dhisConfig) {
        const dhisConfigPath = process.env.DHIS2_HOME && `${process.env.DHIS2_HOME}/config`;
        try {
            dhisConfig = require(dhisConfigPath);
        } catch (e) {
            // Failed to load config file - use default config
            console.log('\nWARNING! Failed to load DHIS config:' + e.message);
            dhisConfig = {
                baseUrl: 'http://localhost:8080/',
                authorization: 'Basic YWRtaW46ZGlzdHJpY3Q=', // admin:district
            };
        }
    }
    
    return dhisConfig;
}

function rewireDefinePlugin(config) {
    const dhisConfig = getDhisConfig();
    const updatedPlugins = config.plugins.map(plugin => {
        if(plugin instanceof webpack.DefinePlugin){
            plugin.definitions = Object.assign({}, plugin.definitions, {
                DHIS_CONFIG: JSON.stringify(dhisConfig)
            });
        }
        return plugin;
    });
    
    config.plugins = updatedPlugins;
    return config;
}

function rewireDevServerProxy(config) {
    const dhisConfig = getDhisConfig();
    auth = dhisConfig.authorization;

    config.proxy = [
        { path: '/dhis-web-commons/**', target: dhisConfig.baseUrl, bypass: bypass },
        { path: '/api/*', target: dhisConfig.baseUrl, bypass: bypass },
        { path: '/icons/**', target: dhisConfig.baseUrl, bypass: bypass },
    ];
    return config;
}

function bypass(req, res, opt) {
    req.headers.Authorization = auth;
    console.log('[PROXY]' + req.url);
}

function rewireAliases(config) {
    config.resolve.alias = Object.assign({}, config.resolve.alias, customAlias);        
    return config;
}

function rewire(config) {
    const rewires = compose(
        rewireAliases,
        rewireDefinePlugin
    );
    return rewires(config);
}

function rewireDevServer(config) {
    const rewires = compose(
        rewireDevServerProxy
    );
    return rewires(config);
}

module.exports = {
    rewire: rewire,
    rewireDevServer: rewireDevServer
};
