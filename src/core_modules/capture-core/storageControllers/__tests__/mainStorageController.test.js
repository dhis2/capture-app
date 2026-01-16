import { IndexedDBAdapter, StorageController } from 'capture-core-utils/storage';
import crypto from 'crypto';
import { TextEncoder, TextDecoder } from 'util';
import { initMainController } from '../mainStorageController';

Object.assign(global, { TextDecoder, TextEncoder, crypto: crypto.webcrypto });

describe('init instance indexedDb', () => {
    const baseUrl = 'http://localhost:8080';

    let isSupportedSpy;
    let openSpy;
    beforeEach(() => {
        isSupportedSpy = jest.spyOn(IndexedDBAdapter, 'isSupported').mockImplementation(() => true);
        openSpy = jest.spyOn(StorageController.prototype, 'open').mockImplementation(async () => { });
    });

    afterEach(() => {
        isSupportedSpy.mockRestore();
        openSpy.mockRestore();
    });

    test('database name follow the naming pattern', async () => {
        const mainController = await initMainController({
            adapterTypes: [IndexedDBAdapter],
            onCacheExpired: () => {},
            serverVersion: { minor: 42, patch: 1 },
            baseUrl,
        });

        // the hash for the baseUrl (http://localhost:8080)
        const urlHash = 'a76d8c3e94eba61fc46b5cc05fc51e5f6df1d0f46d901d32e9c27bb251f155ae';
        const instanceDbName = `dhis2ca-${urlHash}`;

        expect(mainController.name).toEqual(instanceDbName);
    });

    test('database version is computed correctly', async () => {
        const appVersion = 10;
        const serverVersion = { minor: 42, patch: 1 };

        const originalCacheVersion = process.env.DHIS2_CACHE_VERSION;
        process.env.DHIS2_CACHE_VERSION = appVersion;

        const mainController = await initMainController({
            adapterTypes: [IndexedDBAdapter],
            onCacheExpired: () => {},
            serverVersion,
            baseUrl,
        });

        const databaseVersion = `100310011${appVersion + 1000}`;

        expect(mainController.version).toEqual(databaseVersion);

        // Restore cache version
        process.env.DHIS2_CACHE_VERSION = originalCacheVersion;
    });
});
