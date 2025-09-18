import { StorageController } from 'capture-core-utils/storage/StorageController';
import { hashSHA256 } from 'capture-core-utils/hash';
import { ACCESS_HISTORY_KEYS, MAIN_STORES } from './constants';
import type { Input } from './mainStorageController.types';

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
}) => new StorageController(
    `${MAIN_STORAGE_KEY}-${await hashSHA256(baseUrl)}`,
    getCacheVersion(serverVersion),
    {
        Adapters: adapterTypes,
        objectStores: Object.keys(MAIN_STORES).map(key => MAIN_STORES[key]),
        onCacheExpired,
    },
);

export const initMainController = async ({
    adapterTypes,
    onCacheExpired,
    serverVersion,
    baseUrl,
}: Input) => {
    const mainStorageController = await createStorageController({
        baseUrl,
        adapterTypes,
        onCacheExpired,
        serverVersion,
    });
    const upgradeTempData: any = {};
    await mainStorageController.open({
        onBeforeUpgrade: async ({ get }) => {
            upgradeTempData.accessHistoryMetadata =
                await get(MAIN_STORES.USER_CACHES, ACCESS_HISTORY_KEYS.ACCESS_HISTORY_KEY_METADATA);
            upgradeTempData.accessHistoryData =
                await get(MAIN_STORES.USER_CACHES, ACCESS_HISTORY_KEYS.ACCESS_HISTORY_KEY_DATA);
        },
        onAfterUpgrade: async ({ set }) => {
            upgradeTempData.accessHistoryMetadata &&
                await set(MAIN_STORES.USER_CACHES, upgradeTempData.accessHistoryMetadata);
            upgradeTempData.accessHistoryData && 
                await set(MAIN_STORES.USER_CACHES, upgradeTempData.accessHistoryData);
        },
    });

    return mainStorageController;
};
