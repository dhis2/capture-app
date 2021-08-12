// @flow
import React, { useMemo } from 'react';
import { useColumns } from '../../WorkingListsCommon';
import { useDefaultColumnConfig, type EventWorkingListsColumnConfigs } from '../../EventWorkingListsCommon';
import { EventWorkingListsOfflineDataSourceSetup } from '../DataSourceSetup';
import type { Props } from './eventWorkingListsOfflineColumnSetup.types';

export const EventWorkingListsOfflineColumnSetup = ({
    program,
    customColumnOrder,
    ...passOnProps
}: Props) => {
    const stage = program.stage;
    const defaultColumns = useDefaultColumnConfig(stage);
    const columns = useColumns<EventWorkingListsColumnConfigs>(customColumnOrder, defaultColumns);
    const visibleColumns = useMemo(() => columns.filter(column => column.visible), [columns]);

    return (
        <EventWorkingListsOfflineDataSourceSetup
            {...passOnProps}
            columns={visibleColumns}
        />
    );
};
