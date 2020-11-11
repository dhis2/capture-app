// @flow
import React, { useMemo } from 'react';
import { useDefaultColumnConfig } from '../../EventWorkingListsCommon';
import { EventWorkingListsOfflineDataSourceSetup } from '../DataSourceSetup';
import type { Props } from './eventWorkingListsOfflineColumnSetup.types';

export const EventWorkingListsOfflineColumnSetup = ({
    program,
    customColumnOrder,
    ...passOnProps
}: Props) => {
    const defaultColumns = useDefaultColumnConfig(program);

    const defaultColumnsAsObject = useMemo(() =>
        defaultColumns
            .reduce((acc, column) => ({ ...acc, [column.id]: column }), {}),
    [defaultColumns]);

    const columns = useMemo(() => {
        if (!customColumnOrder) {
            return defaultColumns;
        }

        return customColumnOrder
            .map(({ id, visible }) => ({
                ...defaultColumnsAsObject[id],
                visible,
            }));
    }, [customColumnOrder, defaultColumns, defaultColumnsAsObject]);

    const visibleColumns = useMemo(() => columns.filter(column => column.visible), [columns]);

    return (
        <EventWorkingListsOfflineDataSourceSetup
            {...passOnProps}
            columns={visibleColumns}
        />
    );
};
