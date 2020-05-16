// @flow
import { chunk } from 'capture-core-utils';
import { storeTrackedEntityAttributes } from './quickStoreOperations';

function dedupeArray(array: Array<string>) {
    const set = new Set(array);
    return Array.from(set);
}

export async function loadTrackedEntityAttributes(
    trackedEntityAttributeIds: Array<string>) {
    const attributeIdBatches = chunk(dedupeArray(trackedEntityAttributeIds), 100);
    await Promise.all(
        attributeIdBatches.map(
            ids => storeTrackedEntityAttributes(ids),
        ),
    );
}
