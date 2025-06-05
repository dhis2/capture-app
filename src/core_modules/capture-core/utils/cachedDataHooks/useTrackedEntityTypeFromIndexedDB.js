// @flow
import type { UseQueryOptions } from 'react-query';
import { USER_METADATA_STORES, getUserMetadataStorageController } from '../../storageControllers';
import { useIndexedDBQuery } from '../reactQueryHelpers';


export const useTrackedEntityTypeFromIndexedDB = (trackedEntityTypeId: ?string, { enabled }: UseQueryOptions<>) => {
    const storageController = getUserMetadataStorageController();

    const { data, isLoading, isError } = useIndexedDBQuery(
        // $FlowFixMe - only gets called when programId is defined because of enabled
        ['trackedEntityType', trackedEntityTypeId],
        () => storageController.get(USER_METADATA_STORES.TRACKED_ENTITY_TYPES, trackedEntityTypeId),
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
