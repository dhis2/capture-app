// @flow
import chunk from '../../utils/chunk';

import trackedEntityAttributesSpec from '../../api/apiSpecifications/trackedEntityAttributes.apiSpecification';

import getTrackedEntityAttributesLoadSpecification
    from '../../apiToStore/loadSpecifications/getTrackedEntityAttributesLoadSpecification';

import StorageController from '../../storage/StorageController';

const batchSize = 50;

function getTrackedEntityAttributes(ids: Array<number>, store: string, storageController: StorageController) {
    trackedEntityAttributesSpec.updateQueryParams({
        filter: `id:in:[${ids.toString()}]`,
    });
    return getTrackedEntityAttributesLoadSpecification(store, trackedEntityAttributesSpec).load(storageController);
}

export default async function loadTrackedEntityAttributesData(
    storageController: StorageController,
    store: string,
    trackedEntityAttributeIds?: ?Array<string>) {
    const attributeIdBatches = chunk(trackedEntityAttributeIds, batchSize);
    await Promise.all(
        attributeIdBatches.map(
            batch =>
                getTrackedEntityAttributes(batch, store, storageController),
        ),
    );
}
