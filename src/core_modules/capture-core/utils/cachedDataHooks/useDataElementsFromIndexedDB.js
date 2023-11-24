// @flow
import { useCallback } from 'react';
import { userStores, getUserStorageController } from '../../storageControllers';
import { useQueryStyleEvaluation } from '../api/useQueryStyleEvaluation';
import type { CachedDataElement } from '../../storageControllers/';

export const useDataElementsFromIndexedDB = (dataElementIds: ?Set<string>): {
    dataElements: ?Array<CachedDataElement>,
    loading: boolean,
    error: any,
} => {
    const storageController = getUserStorageController();

    const getDataElements = useCallback(requestedIds =>
        storageController.getAll(
            userStores.DATA_ELEMENTS, {
                predicate: dataElement => requestedIds.has(dataElement.id),
            },
        ), [storageController]);

    const { loading, data, error } = useQueryStyleEvaluation(getDataElements, dataElementIds);

    return {
        dataElements: data,
        loading,
        error,
    };
};
