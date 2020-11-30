// @flow
import { useMemo } from 'react';
import type { CustomColumnOrder } from '../../WorkingListsCommon';

type AA = { id: string, visible: boolean };
export const useColumns = (
    customColumnOrder?: CustomColumnOrder,
    defaultColumns: Array<AA>,
): Array<AA> => {
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

export const useColumns2 = (defaultColumns: Array<AA>) => defaultColumns;
