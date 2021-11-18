const config = {
    name: 'capture',
    title: 'Capture',
    type: 'app',
    pwa: {
        enabled: true,
    },
    coreApp: true,

    entryPoints: {
        app: './src/index',
    },
};

module.exports = config;
