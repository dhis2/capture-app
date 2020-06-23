// @flow
import { userStores } from '../../storageControllers/stores';
import { getUserStorageController } from '../../storageControllers';
import { provideContext } from '../context';
import { loadMetaDataInternal } from './loadMetaDataInternal';
import { upkeepUserCaches } from '../maintenance';
import type { QueryApiFn } from '../loader.types';

export const loadMetaData = async (onQueryApi: QueryApiFn) => {
    await upkeepUserCaches();
    await provideContext({
        onQueryApi,
        storageController: getUserStorageController(),
        storeNames: userStores,
    }, loadMetaDataInternal);
};
