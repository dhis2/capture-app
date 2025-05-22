// @flow
import { getBulkDataEntry } from './bulkDataEntryStorageUtils';
import type { ActiveList } from './bulkDataEntryStorageUtils';
import { useIndexedDBQuery } from '../../../../utils/reactQueryHelpers';

export type CachedBulkDataEntry = {|
    id: string,
    activeList: ActiveList,
|};

export const useBulkDataEntryFromIndexedDB = (programId: string) => {
    const {
        data: cachedBulkDataEntry,
        isLoading,
        isError,
    } = useIndexedDBQuery(
        ['cachedBulkDataEntry', programId],
        // $FlowFixMe
        () => getBulkDataEntry(programId),
        {
            staleTime: Infinity,
            cacheTime: Infinity,
            enabled: !!programId,
        },
    );

    return {
        cachedBulkDataEntry,
        isLoading,
        isError,
    };
};
