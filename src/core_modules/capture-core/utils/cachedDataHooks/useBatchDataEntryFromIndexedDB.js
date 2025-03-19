// @flow
import { getBatchDataEntry } from 'capture-core/MetaDataStoreUtils/batchDataEntry';
import { useIndexedDBQuery } from '../../utils/reactQueryHelpers';

export const useBatchDataEntryFromIndexedDB = (programId: string) => {
    const {
        data: cachedBatchDataEntry,
        isLoading,
        isError,
    } = useIndexedDBQuery(
        ['cachedBatchDataEntry', programId],
        // $FlowFixMe
        () => getBatchDataEntry(programId),
        {
            staleTime: Infinity,
            cacheTime: Infinity,
            enabled: !!programId,
        },
    );

    return {
        cachedBatchDataEntry,
        isLoading,
        isError,
    };
};
