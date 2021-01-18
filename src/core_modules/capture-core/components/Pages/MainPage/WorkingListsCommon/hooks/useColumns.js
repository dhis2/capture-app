// @flow
import { useMemo } from 'react';
import type { CustomColumnOrder } from '../../WorkingListsCommon';

export const useColumns = <TColumnConfigs: Array<{ id: string, visible: boolean, [string]: any }>>(
    customColumnOrder?: CustomColumnOrder, // eslint-disable-line
    defaultColumns: TColumnConfigs,
): TColumnConfigs => {
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
