import path from 'node:path';
import { defineConfig } from 'vite';

const viteConfig = defineConfig((configEnv) => {
    const { mode } = configEnv;
    return {
        clearScreen: mode !== 'development',
        resolve: {
            alias: {
                'capture-core': path.resolve(__dirname, 'src/core_modules/capture-core'),
                'capture-core/*': path.resolve(__dirname, 'src/core_modules/capture-core/*'),
                'capture-ui': path.resolve(__dirname, 'src/core_modules/capture-ui'),
                'capture-ui/*': path.resolve(__dirname, 'src/core_modules/capture-ui/*'),
                'capture-core-utils': path.resolve(__dirname, 'src/core_modules/capture-core-utils'),
                'capture-core-utils/*': path.resolve(__dirname, 'src/core_modules/capture-core-utils/*'),
                '@dhis2/rules-engine-javascript': path.resolve(__dirname, 'packages/rules-engine/src'),
            },
        },
        define: {
            global: 'window',
        },
        build: {
            sourcemap: false,
        },
        optimizeDeps: {
            include: [
                // Core React libraries
                'react',
                'react-dom',
                'react-router-dom',
                'history',
                'prop-types',

                // State management
                'redux',
                'react-redux',
                'redux-observable',
                'redux-batched-actions',
                'reselect',
                'rxjs',

                // Query and data fetching
                '@tanstack/react-query',
                '@tanstack/react-query-devtools',

                // DHIS2 libraries
                '@dhis2/ui',
                '@dhis2/app-runtime',
                '@dhis2/rule-engine',
                '@dhis2/d2-i18n',
                '@dhis2/d2-ui-rich-text',

                // Map libraries
                'leaflet',
                'leaflet-draw',
                'react-leaflet',
                'react-leaflet-draw',
                'react-leaflet-search-unpolyfilled',

                // Utilities
                'lodash',
                'uuid',
                'moment',
                'date-fns',
                'loglevel',
                'query-string',

                // UI and styling
                '@emotion/react',
                '@emotion/react/jsx-dev-runtime',
                '@emotion/css',
                'react-jss',
                '@popperjs/core',
                'react-popper',

                // Form and interaction
                'react-select',
                'react-virtualized',
                'react-virtualized-select',
                'react-dnd',
                'react-dnd-html5-backend',

                // Other libraries
                'react-html-parser-ultimate',
                'react-transform-tree',
                'd2-utilizr',
            ],
            esbuildOptions: {
                target: 'esnext',
            },
        },
        server: {
            fs: {
                cachedChecks: true,
                strict: false,
            },
            watch: {
                ignored: ['**/node_modules/**', '**/.d2/**'],
            },
        },
        css: {
            devSourcemap: false,
        },
    };
});

export default viteConfig;
