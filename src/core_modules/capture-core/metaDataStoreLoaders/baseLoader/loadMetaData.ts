import { getUserMetadataStorageController, USER_METADATA_STORES } from '../../storageControllers';
import { provideContext } from '../context';
import { loadMetaDataInternal } from './loadMetaDataInternal';
import type { QuerySingleResource } from '../../utils/api';

export const loadMetaData = async (onQueryApi: QuerySingleResource) => {
    await provideContext({
        onQueryApi,
        storageController: getUserMetadataStorageController(),
        storeNames: USER_METADATA_STORES,
    }, loadMetaDataInternal);
};
