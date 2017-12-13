// @flow
import buildProgramCollection from 'd2-tracker/metaDataFactory/metaDataFactory';

import getStorageContainer from './metaDataStorageContainer';
import stores from './metaDataObjectStores.const';

async function getD2Programs(): Promise<Array<Object>> {
    const storageContainer = getStorageContainer();
    const d2Programs = await storageContainer.getAll(stores.PROGRAMS);
    return d2Programs;
}

export default async function buildMetaData(locale: string) {
    const d2Programs = await getD2Programs();
    buildProgramCollection(d2Programs, locale);
}
