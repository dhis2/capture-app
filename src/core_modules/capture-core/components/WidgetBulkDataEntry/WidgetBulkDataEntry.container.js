// @flow
import React, { useEffect, useState, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { setBulkDataEntry } from 'capture-core/MetaDataStoreUtils/bulkDataEntry';
import { ReactQueryAppNamespace } from 'capture-core/utils/reactQueryHelpers';
import type { Props } from './WidgetBulkDataEntry.types';
import { BulkDataEntryIdle } from './BulkDataEntryIdle';
import { BulkDataEntryActive } from './BulkDataEntryActive';
import { useBulkDataEntryFromIndexedDB } from '../../utils/cachedDataHooks/useBulkDataEntryFromIndexedDB';

export const WidgetBulkDataEntry = ({ programId, setShowBulkDataEntryPlugin }: Props) => {
    const [pluginProps, setPluginProps] = useState(false);
    const { cachedBulkDataEntry } = useBulkDataEntryFromIndexedDB(programId);
    const queryClient = useQueryClient();

    useEffect(() => {
        setPluginProps(cachedBulkDataEntry?.activeList);
    }, [cachedBulkDataEntry?.activeList]);

    const onSelectConfiguration = useCallback(
        async (dataStoreConfiguration) => {
            await setBulkDataEntry({ id: programId, activeList: dataStoreConfiguration });
            await queryClient.refetchQueries([ReactQueryAppNamespace, 'indexedDB', 'cachedBulkDataEntry', programId]);
            setShowBulkDataEntryPlugin(true);
        },
        [programId, setShowBulkDataEntryPlugin, queryClient],
    );

    if (!programId || pluginProps === false) {
        return null;
    }

    if (pluginProps?.configKey) {
        return (
            <BulkDataEntryActive title={pluginProps.title} setShowBulkDataEntryPlugin={setShowBulkDataEntryPlugin} />
        );
    }

    return <BulkDataEntryIdle programId={programId} onSelectConfiguration={onSelectConfiguration} />;
};
