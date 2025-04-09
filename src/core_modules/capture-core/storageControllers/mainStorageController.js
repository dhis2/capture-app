// @flow
import { StorageController } from 'capture-core-utils/storage/StorageController';
import { hashSHA256 } from 'capture-core-utils/hash';
import { mainStores } from './stores';
import type { ServerVersion, AdapterTypes } from './types';

const MAIN_STORAGE_KEY = 'dhis2ca';

const compute4DigitVersionString = (version: number) => ((version % 9000) + 1000).toString();

const computeMinorVersionPart = minor => compute4DigitVersionString(minor - 39);
const computePatchVersionPart = patch => compute4DigitVersionString(patch ?? 0);
const computeTagVersionPart = tag => (tag === 'SNAPSHOT' ? '0' : '1');

const computeServerCacheVersion = ({ minor, patch, tag }) =>
    computeMinorVersionPart(minor) +
    computePatchVersionPart(patch) +
    computeTagVersionPart(tag);

const computeAppCacheVersion = () => {
    const appCacheVersionAsString = process.env.REACT_APP_CACHE_VERSION;
    const appCacheVersion = Number(appCacheVersionAsString);
    return compute4DigitVersionString(appCacheVersion);
};

const getCacheVersion = serverVersion => computeServerCacheVersion(serverVersion) + computeAppCacheVersion();

const createStorageController = async ({
    baseUrl,
    adapterTypes,
    onCacheExpired,
    serverVersion,
}: {
    baseUrl: string,
    adapterTypes: Array<AdapterTypes>,
    onCacheExpired: Function,
    serverVersion: ServerVersion,
}) => new StorageController(
    `${MAIN_STORAGE_KEY}-${await hashSHA256(baseUrl)}`,
    getCacheVersion(serverVersion),
    {
        Adapters: adapterTypes,
        objectStores: Object.keys(mainStores).map(key => mainStores[key]),
        onCacheExpired,
    },
);

export const initMainController = async ({
    adapterTypes,
    onCacheExpired,
    serverVersion,
    baseUrl,
}: {
    adapterTypes: Array<AdapterTypes>,
    onCacheExpired: Function,
    serverVersion: ServerVersion,
    baseUrl: string,
}) => {
    const mainStorageController = await createStorageController({
        baseUrl,
        adapterTypes,
        onCacheExpired,
        serverVersion,
    });

    let upgradeTempData;
    await mainStorageController.open(
        storage => storage
            .get(mainStores.USER_CACHES, 'accessHistory')
            .then((data) => {
                upgradeTempData = data;
            }),
        (storage) => {
            if (!upgradeTempData) {
                return null;
            }
            return storage
                .set(mainStores.USER_CACHES, upgradeTempData);
        },
    );

    return mainStorageController;
};
