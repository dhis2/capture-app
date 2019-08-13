// @flow
import StorageController from 'capture-core-utils/storage/StorageController';

import { chunk } from 'capture-core-utils';
import trackedEntityAttributesSpec from '../../api/apiSpecifications/trackedEntityAttributes.apiSpecification';
import getTrackedEntityAttributesLoadSpecification
    from '../../apiToStore/loadSpecifications/getTrackedEntityAttributesLoadSpecification';

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
