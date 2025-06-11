// @flow
import React from 'react';
import type { Props } from './BulkDataEntryIdle.types';
import { BulkDataEntryIdleComponenet } from './BulkDataEntryIdle.component';

export const BulkDataEntryIdle = ({ bulkDataEntryConfigurations, onSelectConfiguration }: Props) => {
    if (!bulkDataEntryConfigurations || bulkDataEntryConfigurations.length === 0) {
        return null;
    }

    return (
        <BulkDataEntryIdleComponenet
            bulkDataEntryConfigurations={bulkDataEntryConfigurations}
            onSelectConfiguration={onSelectConfiguration}
        />
    );
};
