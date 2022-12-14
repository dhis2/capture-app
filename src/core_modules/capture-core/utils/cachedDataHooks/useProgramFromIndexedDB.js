// @flow
import { userStores } from '../../storageControllers/stores';
import { getUserStorageController } from '../../storageControllers';
import { useIndexedDBQuery } from '../reactQueryHelpers';


export const useProgramFromIndexedDB = (programId: string) => {
    const storageController = getUserStorageController();

    const { data, isLoading, isError } = useIndexedDBQuery(
        ['programs', programId],
        () => storageController.get(userStores.PROGRAMS, programId),
    );

    return {
        program: data,
        loading: isLoading,
        error: isError,
    };
};
