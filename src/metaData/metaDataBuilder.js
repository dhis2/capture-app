// @flow
import buildProgramCollection from 'd2-tracker/metaDataFactory/metaDataFactory';
import StorageContainer from 'd2-tracker/storage/StorageContainer';

import getStorageContainer from './metaDataStorageContainer';
import stores from './metaDataObjectStores.const';

function getD2Programs(storageContainer: StorageContainer): Promise<Array<Object>> {
    return storageContainer.getAll(stores.PROGRAMS);
}

function getD2OptionSets(storageContainer: StorageContainer): Promise<Array<Object>> {
    return storageContainer.getAll(stores.OPTION_SETS);
}

async function getBuilderPrerequisites() {
    const storageContainer = getStorageContainer();
    const d2ProgramsPromise = getD2Programs(storageContainer);
    const d2OptionSetsPromise = getD2OptionSets(storageContainer);
    const values = await Promise.all([d2ProgramsPromise, d2OptionSetsPromise]);
    return values;
}

export default async function buildMetaData(locale: string) {
    const [d2Programs, d2OptionSets] = await getBuilderPrerequisites();
    buildProgramCollection(d2Programs, d2OptionSets, locale);
}
