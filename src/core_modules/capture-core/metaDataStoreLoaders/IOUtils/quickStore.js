// @flow
import { query } from './query';
import { getContext } from '../context';

import type { ApiQueryExtended, StoreName, QuickStoreOptions } from './IOUtils.types';

/**
 * Queries the Api, converts the result using the callback and then stores it all in the selected storage.
 *
 * @param {ApiQueryExtended} querySpecification: the specification of the api query to run
 * @param {string} storeName: the name of the store supplied to the storageController
 * @param {Options} options
 */
export const quickStore = async (
    querySpecification: ApiQueryExtended,
    storeName: StoreName,
    {
        onConvert,
        variables,

    }: QuickStoreOptions) => {
    const { storageController } = getContext();
    const rawResponse = await query(querySpecification, variables);
    const convertedData = onConvert && onConvert(rawResponse);
    convertedData && convertedData.length > 0 && await storageController.setAll(storeName, convertedData);
    return { rawResponse, convertedData };
};
