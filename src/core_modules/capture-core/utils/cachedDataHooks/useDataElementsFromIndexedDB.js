// @flow
import type { UseQueryOptions } from 'react-query';
import { userStores, getUserStorageController } from '../../storageControllers';
import { useIndexedDBQuery } from '../reactQueryHelpers';
import type { CachedDataElement } from '../../storageControllers/';

export const useDataElementsFromIndexedDB = (queryKey: Array<string | number>, dataElementIds: ?Set<string>, queryOptions?: UseQueryOptions<>): {
    dataElements: ?Array<CachedDataElement>,
    isLoading: boolean,
    isError: boolean,
} => {
    const storageController = getUserStorageController();
    const { enabled = !!dataElementIds } = queryOptions ?? {};

    const { data, isLoading, isError } = useIndexedDBQuery(
        ['dataElements', ...queryKey],
        () => storageController.getAll(
            userStores.DATA_ELEMENTS, {
                // $FlowIgnore - the enabled prop guarantees that dataElementIds will be defined
                predicate: dataElement => dataElementIds.has(dataElement.id),
            },
        ), {
            enabled,
        },
    );

    return {
        dataElements: data,
        isLoading,
        isError,
    };
};
