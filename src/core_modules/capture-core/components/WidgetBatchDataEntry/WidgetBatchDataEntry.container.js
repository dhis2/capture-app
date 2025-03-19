// @flow
import React, { useEffect, useState, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { setBatchDataEntry } from 'capture-core/MetaDataStoreUtils/batchDataEntry';
import { ReactQueryAppNamespace } from 'capture-core/utils/reactQueryHelpers';
import type { Props } from './WidgetBatchDataEntry.types';
import { BatchDataEntryConfigurations } from './BatchDataEntryConfigurations';
import { BatchDataEntryActive } from './BatchDataEntryActive';
import { useBatchDataEntryFromIndexedDB } from '../../utils/cachedDataHooks/useBatchDataEntryFromIndexedDB';

export const WidgetBatchDataEntry = ({ programId, setShowBatchDataEntryPlugin }: Props) => {
    const [pluginProps, setPluginProps] = useState(false);
    const { cachedBatchDataEntry } = useBatchDataEntryFromIndexedDB(programId);
    const queryClient = useQueryClient();

    useEffect(() => {
        setPluginProps(cachedBatchDataEntry?.activeList);
    }, [cachedBatchDataEntry?.activeList]);

    const onSelectConfiguration = useCallback(
        async (dataStoreConfiguration) => {
            await setBatchDataEntry({ id: programId, activeList: dataStoreConfiguration });
            await queryClient.refetchQueries([ReactQueryAppNamespace, 'indexedDB', 'cachedBatchDataEntry', programId]);
            setShowBatchDataEntryPlugin(true);
        },
        [programId, setShowBatchDataEntryPlugin, queryClient],
    );

    if (!programId || pluginProps === false) {
        return null;
    }

    if (pluginProps?.configKey) {
        return (
            <BatchDataEntryActive title={pluginProps.title} setShowBatchDataEntryPlugin={setShowBatchDataEntryPlugin} />
        );
    }

    return <BatchDataEntryConfigurations programId={programId} onSelectConfiguration={onSelectConfiguration} />;
};
