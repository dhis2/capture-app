// @flow
import StorageController from 'capture-core-utils/storage/StorageController';

import chunk from '../../utils/chunk';
import optionSetsApiSpec from '../../api/apiSpecifications/optionSets.apiSpecification';
import getOptionSetsLoadSpecification from '../../apiToStore/loadSpecifications/getOptionSetsLoadSpecification';

const batchSize = 50;

type InputMeta = {
    id: string,
    version: string,
};

function getOptionSetsBatch(ids: Array<string>, store: string, storageController: StorageController) {
    optionSetsApiSpec.setFilter(`id:in:[${ids.toString()}]`);
    return getOptionSetsLoadSpecification(store, optionSetsApiSpec).load(storageController);
}

async function getIdsToLoad(
    optionSetsMeta: Array<InputMeta>,
    storeName: string,
    storageController: StorageController,
) {
    const idsToLoad = [];
    await optionSetsMeta.asyncForEach(async (meta) => {
        const storeOptionSet = await storageController
            .get(storeName, meta.id);

        if (!storeOptionSet || storeOptionSet.version !== meta.version) {
            idsToLoad.push(meta.id);
        }
    });
    return idsToLoad;
}

export default async function loadOptionSets(
    storageController: StorageController,
    store: string,
    optionSetsMeta: Array<InputMeta>,
) {
    const filteredOptionSetsMeta = optionSetsMeta.reduce((accFilteredOptionSetsMeta, optionSetMeta) => {
        if (!accFilteredOptionSetsMeta.find(om => om.id === optionSetMeta.id)) {
            accFilteredOptionSetsMeta.push(optionSetMeta);
        }
        return accFilteredOptionSetsMeta;
    }, []);
    const optionSetIds = await getIdsToLoad(filteredOptionSetsMeta, store, storageController);

    const batchedIds = chunk(optionSetIds, batchSize);
    await Promise.all(
        batchedIds.map(
            idsInBatch => getOptionSetsBatch(idsInBatch, store, storageController),
        ),
    );
}
