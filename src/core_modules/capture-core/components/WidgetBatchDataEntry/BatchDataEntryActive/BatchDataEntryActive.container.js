// @flow
import React, { useCallback } from 'react';
import type { Props } from './BatchDataEntryActive.types';
import { BatchDataEntryActiveComponent } from './BatchDataEntryActive.component';

export const BatchDataEntryActive = ({ title, setShowBatchDataEntryPlugin }: Props) => {
    const onBackToBatchDataEntry = useCallback(() => {
        setShowBatchDataEntryPlugin(true);
    }, [setShowBatchDataEntryPlugin]);

    return <BatchDataEntryActiveComponent title={title} onBackToBatchDataEntry={onBackToBatchDataEntry} />;
};
