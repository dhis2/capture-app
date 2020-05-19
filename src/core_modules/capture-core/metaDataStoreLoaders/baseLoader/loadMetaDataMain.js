// @flow
import { userStores, mainStores } from '../../storageControllers/stores';
import { getUserStorageController, getMainStorageController } from '../../storageControllers';
import { provideContext } from '../context';
import { loadMetaDataInternal } from './loadMetaDataInternal';
import type { QueryApiFn } from '../loader.types';

export const loadMetaData = (onQueryApi: QueryApiFn) =>
    provideContext({
        onQueryApi,
        storageController: getUserStorageController(),
        parentStorageController: getMainStorageController(),
        storeNames: userStores,
        parentStoreNames: mainStores,
    }, loadMetaDataInternal);
