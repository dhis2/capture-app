// @flow
import React from 'react';
import type { Props } from './BulkDataEntryIdle.types';
import { useBulkDataEntryConfigurations } from '../hooks';
import { BulkDataEntryIdleComponenet } from './BulkDataEntryIdle.component';

export const BulkDataEntryIdle = ({ programId, onSelectConfiguration }: Props) => {
    const { bulkDataEntryConfigurations, isLoading, isError } = useBulkDataEntryConfigurations(programId);

    if (isError || isLoading || !bulkDataEntryConfigurations || bulkDataEntryConfigurations.length === 0) {
        return null;
    }

    return (
        <BulkDataEntryIdleComponenet
            bulkDataEntryConfigurations={bulkDataEntryConfigurations}
            onSelectConfiguration={onSelectConfiguration}
        />
    );
};
