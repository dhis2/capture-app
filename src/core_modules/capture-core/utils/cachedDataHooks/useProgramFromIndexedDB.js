// @flow
import { userStores } from '../../storageControllers/stores';
import { getUserStorageController } from '../../storageControllers';
import { useIndexedDBQuery } from '../reactQueryHelpers';


export const useProgramFromIndexedDB = (programId: string, fields?: Array<string>) => {
    const storageController = getUserStorageController();

    const { data, isLoading, isError } = useIndexedDBQuery(
        ['programs', programId],
        () => storageController.get(userStores.PROGRAMS, programId),
        {
            enabled: !!programId,
        },
    );
    return {
        programData: fields && data ? {
            ...fields.reduce((acc, field) => { acc[field] = data[field]; return acc; }, {}),
        } : undefined,
        program: data,
        isLoading,
        isError,
    };
};
