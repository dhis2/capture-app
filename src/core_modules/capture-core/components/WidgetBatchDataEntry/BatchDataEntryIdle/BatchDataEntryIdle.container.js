// @flow
import React from 'react';
import type { Props } from './BatchDataEntryIdle.types';
import { useBatchDataEntryConfigurations } from './hooks';
import { BatchDataEntryIdleComponenet } from './BatchDataEntryIdle.component';

export const BatchDataEntryIdle = ({ programId, onSelectConfiguration }: Props) => {
    const { batchDataEntryConfigurations, isLoading, isError } = useBatchDataEntryConfigurations(programId);

    if (isError || isLoading || !batchDataEntryConfigurations || batchDataEntryConfigurations.length === 0) {
        return null;
    }

    return (
        <BatchDataEntryIdleComponenet
            batchDataEntryConfigurations={batchDataEntryConfigurations}
            onSelectConfiguration={onSelectConfiguration}
        />
    );
};
