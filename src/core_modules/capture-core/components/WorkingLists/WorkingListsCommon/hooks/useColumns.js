// @flow
import { useMemo } from 'react';
import type { CustomColumnOrder } from '..';

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

        return customColumnOrder.reduce((acc, { id, visible }) => {
            if (defaultColumnsAsObject[id]) {
                return [
                    ...acc,
                    {
                        ...defaultColumnsAsObject[id],
                        visible,
                    },
                ];
            }
            return acc;
        }, []);
    }, [customColumnOrder, defaultColumns, defaultColumnsAsObject]);
};
