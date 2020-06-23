// @flow
import { query } from './query';
import { getContext } from '../context';

import type { QuickStoreMandatory, QuickStoreOptions } from './IOUtils.types';

/**
 * Queries the Api, converts the result using the callback and then stores it all in the selected storage.
 *
 * @param {ApiQueryExtended} querySpecification: the specification of the api query to run
 * @param {string} storeName: the name of the store supplied to the storageController
 * @param {Options} options
 */
export const quickStore = async ({
    query: querySpecification,
    storeName,
    convertQueryResponse,
}: QuickStoreMandatory, {
        queryVariables,
    }: QuickStoreOptions = {}) => {
    const { storageController } = getContext();
    const rawResponse = await query(querySpecification, queryVariables);
    const convertedData = convertQueryResponse(rawResponse);
    convertedData && convertedData.length > 0 && await storageController.setAll(storeName, convertedData);
    return { rawResponse, convertedData };
};
