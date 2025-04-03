// @flow
import React, { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { setBulkDataEntry } from 'capture-core/MetaDataStoreUtils/bulkDataEntry';
import { ReactQueryAppNamespace } from 'capture-core/utils/reactQueryHelpers';
import type { Props } from './WidgetBulkDataEntry.types';
import { BulkDataEntryIdle } from './BulkDataEntryIdle';
import { BulkDataEntryActive } from './BulkDataEntryActive';
import { useBulkDataEntryFromIndexedDB } from '../../utils/cachedDataHooks/useBulkDataEntryFromIndexedDB';

export const WidgetBulkDataEntry = ({ programId, setShowBulkDataEntryPlugin }: Props) => {
    const { cachedBulkDataEntry } = useBulkDataEntryFromIndexedDB(programId);
    const queryClient = useQueryClient();

    const onSelectConfiguration = useCallback(
        async (dataStoreConfiguration) => {
            await setBulkDataEntry({ id: programId, activeList: dataStoreConfiguration });
            await queryClient.refetchQueries([ReactQueryAppNamespace, 'indexedDB', 'cachedBulkDataEntry', programId]);
            setShowBulkDataEntryPlugin(true);
        },
        [programId, setShowBulkDataEntryPlugin, queryClient],
    );

    if (!programId) {
        return null;
    }

    if (cachedBulkDataEntry?.activeList?.configKey) {
        return (
            <BulkDataEntryActive
                title={cachedBulkDataEntry?.activeList.title}
                setShowBulkDataEntryPlugin={setShowBulkDataEntryPlugin}
            />
        );
    }

    return <BulkDataEntryIdle programId={programId} onSelectConfiguration={onSelectConfiguration} />;
};
