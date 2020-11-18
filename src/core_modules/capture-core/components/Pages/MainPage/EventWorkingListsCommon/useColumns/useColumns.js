// @flow
import { useMemo } from 'react';
import type { CustomColumnOrder } from '../../WorkingListsCommon';
import type { EventWorkingListsColumnConfigs } from '../types';

export const useColumns = (
    customColumnOrder?: CustomColumnOrder,
    defaultColumns: EventWorkingListsColumnConfigs,
): EventWorkingListsColumnConfigs => {
    const defaultColumnsAsObject = useMemo(() =>
        defaultColumns
            .reduce((acc, column) => ({ ...acc, [column.id]: column }), {}),
    [defaultColumns]);

    return useMemo(() => {
        if (!customColumnOrder) {
            return defaultColumns;
        }

        return customColumnOrder
            .map(({ id, visible }) => ({
                ...defaultColumnsAsObject[id],
                visible,
            }));
    }, [customColumnOrder, defaultColumns, defaultColumnsAsObject]);
};
