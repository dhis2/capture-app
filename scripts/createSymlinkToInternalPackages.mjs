#!/usr/bin/env node
import { unlink, symlink } from 'fs/promises';

(() => {
    const targetRoot = '../.d2/shell/src/D2App/core_modules/';
    const symlinkRoot = './node_modules/';

    const createSymlink = async (packageName) => {
        const symlinkPath = symlinkRoot + packageName;

        try {
            await unlink(symlinkPath);
        } catch {
        // Silently ignore this error; the link might not be there. Any potential problems will surface when creating the symlink below.
        }

        await symlink(targetRoot + packageName, symlinkPath, 'dir');
    };

    const captureCoreUtilsPromise = createSymlink('capture-core-utils');
    const captureUIPromise = createSymlink('capture-ui');
    const captureCorePromise = createSymlink('capture-core');

    return Promise.all([captureCoreUtilsPromise, captureUIPromise, captureCorePromise]);
})();
