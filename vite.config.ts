import { defineConfig } from 'vite';
import path from 'path';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    // Atempt to fix by resolving the aliases
    // resolve: {
    //     alias: [
    //         { find: 'capture-core', replacement: path.resolve(__dirname, 'src/core_modules/capture-core') } ,
    //         { find: 'capture-ui', replacement: path.resolve(__dirname, 'src/core_modules/capture-ui') }
    //         { find: 'capture-core-utils', replacement: path.resolve(__dirname, 'src/core_modules/capture-core-utils') }
    //         { find: '@dhis2/rules-engine-javascript', replacement: path.resolve(__dirname, 'packages/rules-engine/src') }
    //     ],
    // },

    // Atempt to fix by adding build rollupOptions
    // build: {
    //     rollupOptions: {
    //         external: ['capture-core-utils', 'capture-core', 'capture-ui', '@dhis2/rules-engine-javascript'],
    //     },
    // },

    // Atempt to fix by using a plugin that should use the paths defined in tsconfig.json
    // plugins: [viteTsconfigPaths()],
});
