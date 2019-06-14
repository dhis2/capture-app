const proxy = require('http-proxy-middleware');

function relayRequestHeaders(proxyReq, req) {
    Object.keys(req.headers).forEach(function (key) {
        proxyReq.setHeader(key, req.headers[key]);
    });
};

function relayResponseHeaders(proxyRes, req, res) {
    Object.keys(proxyRes.headers).forEach(function (key) {
            res.append(key, proxyRes.headers[key]);
        });
};

module.exports = function(app) {
    const context = [
        '/api/**',
        '/dhis-web-commons/**',
        '/dhis-web-core-resource/**',
        '/icons/*',
        '/css/**',
        '/images/**',
    ];
    app.use(proxy(context, {
        target: process.env.REACT_APP_DHIS2_BASE_URL,
        changeOrigin: true,
        auth: 'admin:district',
        onProxyReq: relayRequestHeaders,
        onProxyRes: relayResponseHeaders,
    }));
};