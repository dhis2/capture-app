// @flow
import { getUserStorageController } from '../../storageControllers';
import { userStores } from '../../storageControllers/stores';
import type { QuerySingleResource } from '../../utils/api';
import { provideContext } from '../context';
import { upkeepUserCaches } from '../maintenance';
import { loadMetaDataInternal } from './loadMetaDataInternal';

export const loadMetaData = async (onQueryApi: QuerySingleResource) => {
    await upkeepUserCaches();
    await provideContext({
        onQueryApi,
        storageController: getUserStorageController(),
        storeNames: userStores,
    }, loadMetaDataInternal);
};
