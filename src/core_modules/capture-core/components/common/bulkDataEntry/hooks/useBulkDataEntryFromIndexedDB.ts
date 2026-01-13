import { getBulkDataEntry } from './bulkDataEntryStorageUtils';
import type { ActiveList } from './bulkDataEntryStorageUtils';
import { useIndexedDBQuery } from '../../../../utils/reactQueryHelpers';

export type CachedBulkDataEntry = {
    id: string;
    activeList: ActiveList;
};

export const useBulkDataEntryFromIndexedDB = (programId: string) => {
    const {
        data: cachedBulkDataEntry,
        isInitialLoading,
        isError,
    } = useIndexedDBQuery(
        ['cachedBulkDataEntry', programId],
        () => getBulkDataEntry(programId),
        {
            staleTime: Infinity,
            cacheTime: Infinity,
            enabled: !!programId,
        },
    );

    return {
        cachedBulkDataEntry,
        isLoading: isInitialLoading,
        isError,
    };
};
