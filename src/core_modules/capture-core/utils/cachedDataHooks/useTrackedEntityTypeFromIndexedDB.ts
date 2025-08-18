import type { UseQueryOptions } from 'react-query';
import { USER_METADATA_STORES, getUserMetadataStorageController } from '../../storageControllers';
import { useIndexedDBQuery } from '../reactQueryHelpers';


export const useTrackedEntityTypeFromIndexedDB = (trackedEntityTypeId: string | null | undefined, { enabled }: UseQueryOptions<any>) => {
    const storageController = getUserMetadataStorageController();

    const { data, isLoading, isError } = useIndexedDBQuery(
        ['trackedEntityType', trackedEntityTypeId ?? ''],
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
