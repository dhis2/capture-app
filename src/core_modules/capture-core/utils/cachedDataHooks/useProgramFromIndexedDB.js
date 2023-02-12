// @flow
import { userStores } from '../../storageControllers/stores';
import { getUserStorageController } from '../../storageControllers';
import { useIndexedDBQuery } from '../reactQueryHelpers';
import type { CachedProgram } from '../../storageControllers/cache.types';

export const useProgramFromIndexedDB = (programId: string, fields?: Array<string>): {
    programData?: Object,
    program?: ?Object,
    isLoading: boolean,
    isError: boolean
} => {
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
