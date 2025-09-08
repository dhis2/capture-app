import React, { useCallback } from 'react';
import type { Props } from './BulkDataEntryActive.types';
import { BulkDataEntryActiveComponent } from './BulkDataEntryActive.component';

export const BulkDataEntryActive = ({ title, onOpenBulkDataEntryPlugin }: Props) => {
    const onBackToBulkDataEntry = useCallback(() => {
        onOpenBulkDataEntryPlugin();
    }, [onOpenBulkDataEntryPlugin]);

    return <BulkDataEntryActiveComponent title={title} onBackToBulkDataEntry={onBackToBulkDataEntry} />;
};
