// @flow
import { chunk } from 'capture-core-utils';
import { storeDataElements } from './quickStoreOperations';

/*
 * Retrieve and store data elements based on the data element ids argument.
 * The data element ids input is determined from the stale programs (programs where the program version has changed)
 * We chunk the data element ids in chunks of smaller sizes in order to comply with a potential url path limit and
 * to improve performance, mainly by reducing memory consumption on both the client and the server.
*/
export async function loadDataElements(
    dataElementIds: Array<string>) {
    const dataElementIdBatches = chunk(dataElementIds, 100);
    await Promise.all(
        dataElementIdBatches.map(
            ids => storeDataElements(ids),
        ),
    );
}
