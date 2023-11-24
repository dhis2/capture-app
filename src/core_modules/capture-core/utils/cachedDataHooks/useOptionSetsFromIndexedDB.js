// @flow
import { useCallback } from 'react';
import { userStores, getUserStorageController } from '../../storageControllers';
import { useQueryStyleEvaluation } from '../api/useQueryStyleEvaluation';
import type { CachedOptionSet } from '../../storageControllers/';

export const useOptionSetsFromIndexedDB = (optionSetIds: ?Set<string>): {
    optionSets: ?Array<CachedOptionSet>,
    loading: boolean,
    error: any,
} => {
    const storageController = getUserStorageController();

    const getOptionSets = useCallback(requestedIds =>
        storageController.getAll(
            userStores.OPTION_SETS, {
                predicate: optionSet => requestedIds.has(optionSet.id),
            },
        ), [storageController]);

    const { loading, data, error } = useQueryStyleEvaluation(getOptionSets, optionSetIds);

    return {
        optionSets: data,
        loading,
        error,
    };
};
