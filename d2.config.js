/** @type {import('@dhis2/cli-app-scripts').D2Config} */
const config = {
    name: 'capture',
    title: 'Capture',
    type: 'app',
    direction: 'auto',
    id: '92b75fd0-34cc-451c-942f-3dd0f283bcbd',
    minDHIS2Version: '2.40',
    coreApp: true,

    entryPoints: {
        app: './src/index.tsx',
    },
    shortcuts: [
        {
            name: 'Search TEI',
            url: '#/search',
        },
    ],

    viteConfigExtensions: './vite.config.mts',
};

module.exports = config;
