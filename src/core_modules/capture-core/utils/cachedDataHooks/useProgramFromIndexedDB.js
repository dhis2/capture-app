// @flow
import type { UseQueryOptions } from 'react-query';
import { userStores } from '../../storageControllers/stores';
import { getUserStorageController } from '../../storageControllers';
import { useIndexedDBQuery } from '../reactQueryHelpers';


export const useProgramFromIndexedDB = (programId: ?string, QueryOptions?: UseQueryOptions<>) => {
    const storageController = getUserStorageController();
    const { enabled = true } = QueryOptions ?? {};

    const { data, isLoading, isError } = useIndexedDBQuery(
        ['programs', programId],
        () => storageController.get(userStores.PROGRAMS, programId),
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
