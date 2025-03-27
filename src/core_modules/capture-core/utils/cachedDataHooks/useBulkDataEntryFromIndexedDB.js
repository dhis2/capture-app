// @flow
import { getBulkDataEntry } from 'capture-core/MetaDataStoreUtils/bulkDataEntry';
import { useIndexedDBQuery } from '../../utils/reactQueryHelpers';

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
