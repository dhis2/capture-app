// @flow
import { upkeepUserCaches } from '../maintenance';
import { provideContext } from '../context';
import type { QuerySingleResource } from '../../utils/api';
import { userStores } from '../../storageControllers/stores';
import { getUserStorageController } from '../../storageControllers';
import { loadMetaDataInternal } from './loadMetaDataInternal';

export const loadMetaData = async (onQueryApi: QuerySingleResource) => {
    await upkeepUserCaches();
    await provideContext({
        onQueryApi,
        storageController: getUserStorageController(),
        storeNames: userStores,
    }, loadMetaDataInternal);
};
