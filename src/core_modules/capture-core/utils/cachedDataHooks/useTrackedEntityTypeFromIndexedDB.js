// @flow
import type { UseQueryOptions } from 'react-query';
import { userStores } from '../../storageControllers/stores';
import { getUserStorageController } from '../../storageControllers';
import { useIndexedDBQuery } from '../reactQueryHelpers';


export const useTrackedEntityTypeFromIndexedDB = (trackedEntityTypeId: ?string, { enabled }: UseQueryOptions<>) => {
    const storageController = getUserStorageController();

    const { data, isLoading, isError } = useIndexedDBQuery(
        ['trackedEntityType', trackedEntityTypeId],
        () => storageController.get(userStores.TRACKED_ENTITY_TYPES, trackedEntityTypeId),
        {
            enabled,
        },
    );

    return {
        trackedEntityType: data,
        isLoading,
        isError,
    };
};
