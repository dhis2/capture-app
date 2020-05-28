// @flow
import { chunk } from 'capture-core-utils';
import { storeTrackedEntityAttributes } from './quickStoreOperations';

function deduplicateArray(array: Array<string>): Array<string> {
    const uniqueSet = new Set(array);
    return [...uniqueSet.values()];
}

/**
 * Retrieve and store tracked entity attributes based on the tracked entity attribute ids argument.
 * The tracked entity attribute ids input is determined from the stale programs (programs where the program version has changed) and
 * the stale tracked entity types (tracked entity types based on programs where the program version has changed)
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
