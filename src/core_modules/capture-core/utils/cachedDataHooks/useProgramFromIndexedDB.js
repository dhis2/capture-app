// @flow
import type { UseQueryOptions } from 'react-query';
import { userStores, getUserStorageController } from '../../storageControllers';
import { useIndexedDBQuery } from '../reactQueryHelpers';


export const useProgramFromIndexedDB = (programId: ?string, queryOptions?: UseQueryOptions<>) => {
    const storageController = getUserStorageController();
    const { enabled = true } = queryOptions ?? {};

    const { data, isLoading, isError } = useIndexedDBQuery(
        // $FlowFixMe - only gets called when programId is defined because of enabled
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
