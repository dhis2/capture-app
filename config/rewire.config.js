/* eslint-disable */
'use strict';

const HTMLWebpackPlugin = require('html-webpack-plugin');
const { compose } = require('react-app-rewired');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const customAlias = require('./alias.config');
const getCssMod = require('./cssMod.config');
const svgMod = require('./svgMod.config');

const isDevBuild = process.argv[1].indexOf('start.js') !== -1;

let auth;
let devConfig;

function getDhisConfigFromTextFile(fileContents) {
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
        return getDhisConfigFromTextFile(data);    
    }
    return null;    
}

function bypass(req, res, opt) {
    req.headers.Authorization = auth;
    console.log('[PROXY]' + req.url);
}

function getDhisConfig() {
    
    if(devConfig){
        return devConfig;
    }

    if(!isDevBuild){
        devConfig = {};
        return devConfig;
    }

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
                authorization: 'Basic YWRtaW46ZGlzdHJpY3Q=', // admin:district YWRtaW46ZGlzdHJpY3Q= portal:aaBB11!! cG9ydGFsOmFhQkIxMSEh
            };
        }
    }
    
    devConfig = dhisConfig;
    return devConfig;
}

function rewirePlugins(config) {
    const dhisConfig = getDhisConfig();
    const updatedPlugins = config.plugins.map(plugin => {
        if(plugin instanceof webpack.DefinePlugin){
            plugin.definitions = Object.assign({}, plugin.definitions, {
                DHIS_CONFIG: JSON.stringify(dhisConfig),
                "appPackage.CACHE_VERSION": JSON.stringify(process.env.npm_package_cacheVersion),
                "process.env.REACT_APP_TRACKER_CAPTURE_APP_PATH": JSON.stringify(process.env.NODE_ENV === "production" ? '../dhis-web-tracker-capture' : 'http://localhost:8080/dhis/dhis-web-tracker-capture')
            });          
        }
        return plugin;
    });    
    
    const scriptPrefix = (isDevBuild ? dhisConfig.baseUrl : '..');
    updatedPlugins.push(new HTMLWebpackPlugin({
        template: './public/index.html',
        vendorScripts: [
            //`${scriptPrefix}/dhis-web-core-resource/dhis/dhis2-util-1554e6a5ab.js`,
            //`${scriptPrefix}/dhis-web-core-resource/dhis/dhis2-storage-memory-992eeb1c0e.js`,
        ]
        .map(script => {            
            return (`<script src="${script}"></script>`);
        })
    })); 
   
    config.plugins = updatedPlugins;
    return config;
}

function rewireAliases(config) {
    config.resolve.alias = Object.assign({}, config.resolve.alias, customAlias);        
    return config;
}

function rewireModules(config){
    // TODO: Temporary, probably isn't needed whenever create-react-app is updated to v2
    const cssMod = getCssMod(isDevBuild);
    config.module.rules[1].oneOf.splice(0, 0, cssMod);
    config.module.rules[1].oneOf.splice(0, 0, svgMod);
    return config;
}

function rewireDevTool(config){
    config.devtool = 'source-map';
    return config;
}

function rewire(config) {
    const rewires = compose(
        rewireAliases,
        rewirePlugins,
        rewireModules,
        rewireDevTool
    );
    return rewires(config);
}

function rewireDevServerProxy(config) {
    const dhisConfig = getDhisConfig();
    auth = dhisConfig.authorization;

    config.proxy = [
        {  
            context: [
                '/api/**',
                '/dhis-web-commons/**',
                '/dhis-web-core-resource/**',
                '/icons/**',
                '/css/**',
                '/images/**',
            ],
            target: dhisConfig.baseUrl,
            changeOrigin: true,
            bypass,
        }   
    ];
    return config;
}

function rewireDevServer(config) {
    const rewires = compose(
        rewireDevServerProxy
    );
    return rewires(config);
}

module.exports = {
    webpack: rewire,
    devServer: rewireDevServer
};
