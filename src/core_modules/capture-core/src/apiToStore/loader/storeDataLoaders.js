// @flow
import StorageController from 'capture-core-utils/storage/StorageController';
import getData from '../../api/fetcher/apiFetchers';
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
    if (alreadyExists) {
        return null;
    }

    const loadedData =
        await loadStoreData(storageController, objectStore, queryParams, d2ModelName, d2ModelGetterType, converter);
    return loadedData;
}

