// @flow
import chunk from '../../utils/chunk';

import optionSetsApiSpec from '../../api/apiSpecifications/optionSets.apiSpecification';
import getOptionSetsLoadSpecification from '../../apiToStore/loadSpecifications/getOptionSetsLoadSpecification';

import StorageContainer from '../../storage/StorageContainer';

const batchSize = 50;

function getOptionSetsBatch(ids: Array<string>, store: string, storageContainer: StorageContainer) {
    optionSetsApiSpec.setFilter(`id:in:[${ids.toString()}]`);
    return getOptionSetsLoadSpecification(store, optionSetsApiSpec).load(storageContainer);
}

export default async function getOptionSets(ids: Array<string>, store: string, storageContainer: StorageContainer) {
    const filteredIds = ids.reduce((accFilteredIds, id) => {
        if (!accFilteredIds.includes(id)) {
            accFilteredIds.push(id);
        }
        return accFilteredIds;
    }, []);

    const batchedIds = chunk(filteredIds, batchSize);
    await Promise.all(
        batchedIds.map(
            idsInBatch => getOptionSetsBatch(idsInBatch, store, storageContainer),
        ),
    );
}
