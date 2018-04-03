// @flow
import getData from '../../api/fetcher/apiFetchers';

import StorageContainer from '../../storage/StorageContainer';
import getterTypes from '../../api/fetcher/getterTypes.const';
import type { Converter } from '../../api/fetcher/apiFetchers';

export async function loadStoreData(
    storageContainer: StorageContainer,
    objectStore: string,
    queryParams: ?Object,
    d2ModelName: string,
    d2ModelGetterType: $Values<typeof getterTypes>,
    converter: Converter,
) {
    const convertedData = await getData(d2ModelName, d2ModelGetterType, queryParams, converter);
    if (convertedData) {
        await storageContainer.setAll(objectStore, convertedData);
    }
    return convertedData;
}

export async function loadStoreDataIfNotExists(
    storageContainer: StorageContainer,
    objectStore: string,
    queryParams?: ?Object,
    d2ModelName: string,
    d2ModelGetterType: string,
    converter: Converter,
) {
    const keys = await storageContainer.getKeys(objectStore);
    const alreadyExists = keys && keys.length > 0;
    if (!alreadyExists) {
        await loadStoreData(storageContainer, objectStore, queryParams, d2ModelName, d2ModelGetterType, converter);
    }
}

