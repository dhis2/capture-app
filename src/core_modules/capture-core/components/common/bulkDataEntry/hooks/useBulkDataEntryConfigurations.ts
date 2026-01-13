import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ReactQueryAppNamespace } from 'capture-core/utils/reactQueryHelpers';
import { setBulkDataEntry, removeBulkDataEntry } from './bulkDataEntryStorageUtils';
import { useBulkDataEntryFromIndexedDB } from './useBulkDataEntryFromIndexedDB';
import { useBulkDataEntryDatastoreConfigurations } from './useBulkDataEntryDatastoreConfigurations';

const getActiveBulkDataEntryConfiguration = (bulkDataEntryConfigurations: any, cachedBulkDataEntry: any) =>
    bulkDataEntryConfigurations?.find((config: any) => config.configKey === cachedBulkDataEntry?.activeList?.configKey);

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
    } = useBulkDataEntryDatastoreConfigurations(programId);

    const activeList = getActiveBulkDataEntryConfiguration(bulkDataEntryConfigurations, cachedBulkDataEntry);

    const setActiveList = useCallback(
        async (configKey: string) => {
            await setBulkDataEntry({ id: programId, activeList: { configKey } });
            await queryClient.invalidateQueries(
                [ReactQueryAppNamespace, 'indexedDB', 'cachedBulkDataEntry', programId],
                { refetchType: 'none' },
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
        isError: isErrorBulkDataEntryFromIndexedDB,
    };
};
