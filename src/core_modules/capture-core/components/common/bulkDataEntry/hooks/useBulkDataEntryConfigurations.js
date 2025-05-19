// @flow
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { ReactQueryAppNamespace } from 'capture-core/utils/reactQueryHelpers';
import { setBulkDataEntry, removeBulkDataEntry } from './bulkDataEntryStorageUtils';
import { useBulkDataEntryFromIndexedDB } from './useBulkDataEntryFromIndexedDB';
import { useBulkDataEntryDatastoreConfigurations } from './useBulkDataEntryDatastoreConfigurations';

const getActiveBulkDataEntryConfiguration = (bulkDataEntryConfigurations, cachedBulkDataEntry) =>
    bulkDataEntryConfigurations?.find(config => config.configKey === cachedBulkDataEntry?.activeList?.configKey);

export const useBulkDataEntryConfigurations = (programId: string) => {
    const queryClient = useQueryClient();

    const {
        cachedBulkDataEntry,
        isLoading: isLoadingBulkDataEntryFromIndexedDB,
        isError: isErrorBulkDataEntryFromIndexedDB,
    } = useBulkDataEntryFromIndexedDB(programId);

    const {
        bulkDataEntryConfigurations,
        isLoading: isLoadingBulkDataEntryConfigurations,
        isError: isErrorBulkDataEntryConfigurations,
    } = useBulkDataEntryDatastoreConfigurations(programId);

    const activeList = getActiveBulkDataEntryConfiguration(bulkDataEntryConfigurations, cachedBulkDataEntry);

    const setActiveList = useCallback(
        async (configKey: string) => {
            await setBulkDataEntry({ id: programId, activeList: { configKey } });
            await queryClient.invalidateQueries(
                [ReactQueryAppNamespace, 'indexedDB', 'cachedBulkDataEntry', programId],
                { refetchInactive: false },
            );
        },
        [programId, queryClient],
    );

    const removeActiveList = useCallback(async () => {
        await removeBulkDataEntry(programId);
        await queryClient.invalidateQueries([ReactQueryAppNamespace, 'indexedDB', 'cachedBulkDataEntry', programId]);
    }, [programId, queryClient]);

    return {
        activeList,
        setActiveList,
        removeActiveList,
        bulkDataEntryConfigurations,
        isLoading: isLoadingBulkDataEntryFromIndexedDB || isLoadingBulkDataEntryConfigurations,
        isError: isErrorBulkDataEntryFromIndexedDB || isErrorBulkDataEntryConfigurations,
    };
};
