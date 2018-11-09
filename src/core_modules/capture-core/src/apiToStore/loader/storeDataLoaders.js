// @flow
import getData from '../../api/fetcher/apiFetchers';

import StorageController from '../../storage/StorageController';
import getterTypes from '../../api/fetcher/getterTypes.const';
import type { Converter } from '../../api/fetcher/apiFetchers';

export async function loadStoreData(
    storageController: StorageController,
    objectStore: string,
    queryParams: ?Object,
    d2ModelName: string,
    d2ModelGetterType: $Values<typeof getterTypes>,
    converter: Converter,
) {
    const convertedData = await getData(d2ModelName, d2ModelGetterType, queryParams, converter);
    if (convertedData) {
        await storageController.setAll(objectStore, convertedData);
    }
    return convertedData;
}

export async function loadStoreDataIfNotExists(
    storageController: StorageController,
    objectStore: string,
    queryParams?: ?Object,
    d2ModelName: string,
    d2ModelGetterType: string,
    converter: Converter,
) {
    const keys = await storageController.getKeys(objectStore);
    const alreadyExists = keys && keys.length > 0;
    if (!alreadyExists) {
        await loadStoreData(storageController, objectStore, queryParams, d2ModelName, d2ModelGetterType, converter);
    }
}

