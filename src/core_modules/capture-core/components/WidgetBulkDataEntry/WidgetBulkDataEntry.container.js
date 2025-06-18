// @flow
import React, { useCallback } from 'react';
import type { Props } from './WidgetBulkDataEntry.types';
import { BulkDataEntryIdle } from './BulkDataEntryIdle';
import { BulkDataEntryActive } from './BulkDataEntryActive';
import { useBulkDataEntryConfigurations } from '../common/bulkDataEntry';

export const WidgetBulkDataEntry = ({ programId, onOpenBulkDataEntryPlugin }: Props) => {
    const { activeList, setActiveList, bulkDataEntryConfigurations, isError, isLoading } =
        useBulkDataEntryConfigurations(programId);

    const onSelectConfiguration = useCallback(
        async (configKey: string) => {
            await setActiveList(configKey);
            onOpenBulkDataEntryPlugin();
        },
        [onOpenBulkDataEntryPlugin, setActiveList],
    );

    if (!programId || isError || isLoading) {
        return null;
    }

    if (activeList?.configKey) {
        return (
            <BulkDataEntryActive
                title={activeList.title}
                onOpenBulkDataEntryPlugin={onOpenBulkDataEntryPlugin}
            />
        );
    }

    return (
        <BulkDataEntryIdle
            programId={programId}
            onSelectConfiguration={onSelectConfiguration}
            bulkDataEntryConfigurations={bulkDataEntryConfigurations}
        />
    );
};
