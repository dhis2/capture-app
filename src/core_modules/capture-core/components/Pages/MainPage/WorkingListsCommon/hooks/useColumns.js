// @flow
import { useMemo } from 'react';
import type { CustomColumnOrder } from '../../WorkingListsCommon';

type NewColumnConfigBase = { id: string, visible: boolean };
export const useColumns = (
    customColumnOrder?: CustomColumnOrder,
    defaultColumns: Array<NewColumnConfigBase>,
): Array<NewColumnConfigBase> => {
    const defaultColumnsAsObject = useMemo(() =>
        defaultColumns
            .reduce((acc, column) => ({ ...acc, [column.id]: column }), {}),
    [defaultColumns]);

    // $FlowFixMe Based on the business logic the customColumOrder id should exists as a key in defaultColumnsAsObject
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

export const useColumns2 = (defaultColumns: Array<{ id: string, visible: boolean, [string]: any }>) => defaultColumns;
