import type { UseQueryOptions } from 'react-query';
import { USER_METADATA_STORES, getUserMetadataStorageController } from '../../storageControllers';
import { useIndexedDBQuery } from '../reactQueryHelpers';


export const useProgramFromIndexedDB = (programId: string | null | undefined, queryOptions?: UseQueryOptions<any>) => {
    const storageController = getUserMetadataStorageController();
    const { enabled = true } = queryOptions ?? {};

    const { data, isLoading, isError } = useIndexedDBQuery(
        ['programs', programId ?? ''],
        () => storageController.get(USER_METADATA_STORES.PROGRAMS, programId),
        {
            enabled,
        },
    );

    return {
        program: data,
        isLoading,
        isError,
    };
};
