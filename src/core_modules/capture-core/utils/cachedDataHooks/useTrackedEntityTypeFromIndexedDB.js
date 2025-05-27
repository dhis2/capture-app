// @flow
import type { UseQueryOptions } from 'react-query';
import { userStores, getUserStorageController } from '../../storageControllers';
import { useIndexedDBQuery } from '../reactQueryHelpers';


export const useTrackedEntityTypeFromIndexedDB = (trackedEntityTypeId: ?string, { enabled }: UseQueryOptions<>) => {
    const storageController = getUserStorageController();

    const { data, isLoading, isError } = useIndexedDBQuery(
        // $FlowFixMe - only gets called when programId is defined because of enabled
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
