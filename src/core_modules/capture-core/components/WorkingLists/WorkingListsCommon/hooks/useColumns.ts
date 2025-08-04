import { useMemo } from 'react';
import type { CustomColumnOrder } from '..';

export const useColumns = <TColumnConfigs extends Array<{ id: string, visible: boolean, [key: string]: any }>>(
    customColumnOrder: CustomColumnOrder | undefined,
    defaultColumns: TColumnConfigs,
): TColumnConfigs => {
    const defaultColumnsAsObject = useMemo(() =>
        defaultColumns
            .reduce((acc, column) => ({ ...acc, [column.id]: column }), {} as Record<string, any>),
    [defaultColumns]);

    return useMemo(() => {
        if (!customColumnOrder) {
            return defaultColumns;
        }

        const result = customColumnOrder.reduce((acc: any[], { id, visible }) => {
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

        return result as TColumnConfigs;
    }, [customColumnOrder, defaultColumns, defaultColumnsAsObject]);
};
