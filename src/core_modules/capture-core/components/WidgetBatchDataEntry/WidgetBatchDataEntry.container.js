// @flow
import React, { useEffect, useState, useCallback } from 'react';
import { getBatchDataEntry, setBatchDataEntry } from 'capture-core/MetaDataStoreUtils/batchDataEntry';
import type { Props } from './WidgetBatchDataEntry.types';
import { BatchDataEntryConfigurations } from './BatchDataEntryConfigurations';
import { BatchDataEntryActive } from './BatchDataEntryActive';

export const WidgetBatchDataEntry = ({ programId, setShowBatchDataEntryPlugin }: Props) => {
    const [pluginProps, setPluginProps] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const batchDataEntry = await getBatchDataEntry(programId);
            batchDataEntry?.activeList && setPluginProps(batchDataEntry.activeList);
        };
        programId && fetchData();
    }, [programId]);

    const onSelectConfiguration = useCallback(
        async (dataStoreConfiguration) => {
            await setBatchDataEntry({ id: programId, activeList: dataStoreConfiguration });
            setPluginProps(dataStoreConfiguration);
            setShowBatchDataEntryPlugin(true);
        },
        [programId, setShowBatchDataEntryPlugin],
    );

    if (!programId) {
        return null;
    }

    if (pluginProps?.configKey) {
        return (
            <BatchDataEntryActive title={pluginProps.title} setShowBatchDataEntryPlugin={setShowBatchDataEntryPlugin} />
        );
    }

    return <BatchDataEntryConfigurations programId={programId} onSelectConfiguration={onSelectConfiguration} />;
};
