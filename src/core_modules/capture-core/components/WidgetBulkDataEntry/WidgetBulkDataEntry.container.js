// @flow
import React, { useCallback } from 'react';
import type { Props } from './WidgetBulkDataEntry.types';
import { BulkDataEntryIdle } from './BulkDataEntryIdle';
import { BulkDataEntryActive } from './BulkDataEntryActive';
import { useActiveBulkDataEntryList } from './hooks';

export const WidgetBulkDataEntry = ({ programId, setShowBulkDataEntryPlugin }: Props) => {
    const { activeList, setActiveList } = useActiveBulkDataEntryList(programId);

    const onSelectConfiguration = useCallback(
        async (configKey: string) => {
            await setActiveList(configKey);
            setShowBulkDataEntryPlugin(true);
        },
        [setShowBulkDataEntryPlugin, setActiveList],
    );

    if (!programId) {
        return null;
    }

    if (activeList?.configKey) {
        return (
            <BulkDataEntryActive
                title={activeList.title}
                setShowBulkDataEntryPlugin={setShowBulkDataEntryPlugin}
            />
        );
    }

    return <BulkDataEntryIdle programId={programId} onSelectConfiguration={onSelectConfiguration} />;
};
