import { useMemo } from 'react';
import type { CustomColumnOrder } from '..';

export const useColumns = <TColumnConfigs extends Array<{ id: string, visible: boolean, [key: string]: any }>>(
    defaultColumns: TColumnConfigs,
    customColumnOrder?: CustomColumnOrder,
): TColumnConfigs => {
    const defaultColumnsAsObject = useMemo(() =>
        defaultColumns
            .reduce((acc, column) => ({ ...acc, [column.id]: column }), {}),
    [defaultColumns]);

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
