// @flow
import React from 'react';
import type { Props } from './BatchDataEntryConfigurations.types';
import { useBatchDataEntryConfigurations } from './hooks';
import { BatchDataEntryConfigurationsComponenet } from './BatchDataEntryConfigurations.component';

export const BatchDataEntryConfigurations = ({ programId, onSelectConfiguration }: Props) => {
    const { batchDataEntryConfigurations, isLoading, isError } = useBatchDataEntryConfigurations(programId);

    if (isError || isLoading || !batchDataEntryConfigurations || batchDataEntryConfigurations.length === 0) {
        return null;
    }

    return (
        <BatchDataEntryConfigurationsComponenet
            batchDataEntryConfigurations={batchDataEntryConfigurations}
            onSelectConfiguration={onSelectConfiguration}
        />
    );
};
