// @flow
import { userStores } from '../../storageControllers/stores';
import { getUserStorageController } from '../../storageControllers';
import { provideContext } from '../context';
import { loadMetaDataInternal } from './loadMetaDataInternal';
import { upkeepUserCaches } from '../maintenance';
import type { SingleResourceQuery } from '../../utils/api';

export const loadMetaData = async (onQueryApi: SingleResourceQuery) => {
    await upkeepUserCaches();
    await provideContext({
        onQueryApi,
        storageController: getUserStorageController(),
        storeNames: userStores,
    }, loadMetaDataInternal);
};
