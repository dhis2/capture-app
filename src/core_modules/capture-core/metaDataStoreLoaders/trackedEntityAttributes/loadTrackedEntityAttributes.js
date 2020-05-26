// @flow
import { chunk } from 'capture-core-utils';
import { storeTrackedEntityAttributes } from './quickStoreOperations';

function deduplicateArray(array: Array<string>): Array<string> {
    const uniqueSet = new Set(array);
    return [...uniqueSet.values()];
}

/**
 * Retrieve and store tracked entity attributes based on the trackedEntityAttributeIds argument.
 * @param {string[]} trackedEntityAttributeIds: attributes to load
 */
export async function loadTrackedEntityAttributes(
    trackedEntityAttributeIds: Array<string>) {
    const attributeIdBatches = chunk(deduplicateArray(trackedEntityAttributeIds), 100);
    await Promise.all(
        attributeIdBatches.map(
            ids => storeTrackedEntityAttributes(ids),
        ),
    );
}
