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
 * We chunk the tracked entity type attribute ids in chunks of smaller sizes in order to comply with a potential url path limit and
 * to improve performance, mainly by reducing memory consumption on both the client and the server.
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
