// @flow
import { chunk } from 'capture-core-utils';
import { storeTrackedEntityAttributes } from './quickStoreOperations';

function deduplicateArray(array: Array<string>): Array<string> {
    const uniqueSet = new Set(array);
    return [...uniqueSet.values()];
}

export async function loadTrackedEntityAttributes(
    trackedEntityAttributeIds: Array<string>) {
    const attributeIdBatches = chunk(deduplicateArray(trackedEntityAttributeIds), 100);
    await Promise.all(
        attributeIdBatches.map(
            ids => storeTrackedEntityAttributes(ids),
        ),
    );
}
