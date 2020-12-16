// @flow
import { userStores } from '../../storageControllers/stores';
import { getUserStorageController } from '../../storageControllers';
import { provideContext } from '../context';
import { loadMetaDataInternal } from './loadMetaDataInternal';
import { upkeepUserCaches } from '../maintenance';
import type { QuerySingleResource } from '../../utils/api';

export const loadMetaData = async (onQueryApi: QuerySingleResource) => {
    await upkeepUserCaches();
    await provideContext({
        onQueryApi,
        storageController: getUserStorageController(),
        storeNames: userStores,
    }, loadMetaDataInternal);
};
