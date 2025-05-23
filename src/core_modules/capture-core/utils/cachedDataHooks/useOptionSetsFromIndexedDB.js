// @flow
import type { UseQueryOptions } from 'react-query';
import { USER_METADATA_STORES, getUserMetadataStorageController } from '../../storageControllers';
import { useIndexedDBQuery } from '../reactQueryHelpers';
import type { CachedOptionSet } from '../../storageControllers/';

export const useOptionSetsFromIndexedDB = (queryKey: Array<string | number>, optionSetIds: ?Set<string>, queryOptions?: UseQueryOptions<>): {
    optionSets: ?Array<CachedOptionSet>,
    isLoading: boolean,
    isError: boolean,
} => {
    const storageController = getUserMetadataStorageController();
    const { enabled = !!optionSetIds } = queryOptions ?? {};

    const { data, isLoading, isError } = useIndexedDBQuery(
        ['optionSets', ...queryKey],
        () => storageController.getAll(
            USER_METADATA_STORES.OPTION_SETS, {
                // $FlowIgnore - the enabled prop guarantees that optionSetIds will be defined
                predicate: optionSet => optionSetIds.has(optionSet.id),
            },
        ), {
            enabled,
        },
    );

    return {
        optionSets: data,
        isLoading,
        isError,
    };
};
