import React, { useCallback } from 'react';
import type { Props } from './BulkDataEntryActive.types';
import { BulkDataEntryActiveComponent } from './BulkDataEntryActive.component';

export const BulkDataEntryActive = ({ title, setShowBulkDataEntryPlugin }: Props) => {
    const onBackToBulkDataEntry = useCallback(() => {
        setShowBulkDataEntryPlugin(true);
    }, [setShowBulkDataEntryPlugin]);

    return <BulkDataEntryActiveComponent title={title} onBackToBulkDataEntry={onBackToBulkDataEntry} />;
};
