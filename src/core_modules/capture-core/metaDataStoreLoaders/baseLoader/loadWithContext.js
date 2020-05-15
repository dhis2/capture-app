// @flow
import { userStores, mainStores } from '../../storageControllers/stores';
import { getUserStorageController, getMainStorageController } from '../../storageControllers';
import { provideContext } from '../context';
import { loadMetaData } from './metaDataLoader';
import type { QueryApiFn } from '../loader.types';

export const loadWithContext = (onQueryApi: QueryApiFn) =>
    provideContext({
        onQueryApi,
        storageController: getUserStorageController(),
        parentStorageController: getMainStorageController(),
        storeNames: userStores,
        parentStoreNames: mainStores,
    }, loadMetaData);
