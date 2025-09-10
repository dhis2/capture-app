import path from 'path';
import { defineConfig } from 'vite';

const viteConfig = defineConfig(async configEnv => {
    const { mode } = configEnv;
    return {
        // In dev environments, don't clear the terminal after files update
        clearScreen: mode !== 'development',
        resolve: {
            alias: {
                'capture-core': path.resolve(__dirname, 'src/core_modules/capture-core'),
                'capture-ui': path.resolve(__dirname, 'src/core_modules/capture-ui'),
                'capture-core-utils': path.resolve(__dirname, 'src/core_modules/capture-core-utils'),
                '@dhis2/rules-engine-javascript': path.resolve(__dirname, 'packages/rules-engine/src'),
            },
        },
        define: {
            global: 'window',
        },
    };
});

export default viteConfig;
