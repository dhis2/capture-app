// @flow
import StorageController from 'capture-core-utils/storage/StorageController';
import chunk from '../../utils/chunk';

import optionSetsApiSpec from '../../api/apiSpecifications/optionSets.apiSpecification';
import getOptionSetsLoadSpecification from '../../apiToStore/loadSpecifications/getOptionSetsLoadSpecification';

const batchSize = 50;

function getOptionSetsBatch(ids: Array<string>, store: string, storageController: StorageController) {
    optionSetsApiSpec.setFilter(`id:in:[${ids.toString()}]`);
    return getOptionSetsLoadSpecification(store, optionSetsApiSpec).load(storageController);
}

export default async function getOptionSets(ids: Array<string>, store: string, storageController: StorageController) {
    const filteredIds = ids.reduce((accFilteredIds, id) => {
        if (!accFilteredIds.includes(id)) {
            accFilteredIds.push(id);
        }
        return accFilteredIds;
    }, []);

    const batchedIds = chunk(filteredIds, batchSize);
    await Promise.all(
        batchedIds.map(
            idsInBatch => getOptionSetsBatch(idsInBatch, store, storageController),
        ),
    );
}
