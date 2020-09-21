// @flow
import React, { useContext, useMemo } from 'react';
import {
    OptionSet,
    Option,
    DataElement,
} from '../../../../metaData';
import { ListView, type CustomMenuContents } from '../../../ListView';
import { ListViewBuilderContext } from './workingLists.context';
import type { ColumnConfigs, ColumnConfig } from './workingLists.types';

type Props = {
    columns: ColumnConfigs,
    customListViewMenuContents: CustomMenuContents,
};

type ColumnConfigWithOptions = {
    ...ColumnConfig,
    options: Array<{ text: string, value: any }>,
};

export const ListViewBuilder = ({ columns, customListViewMenuContents, ...passOnProps }: Props) => {
    const {
        dataSource,
        recordsOrder,
        onListRowSelect,
        onSortList,
        onSetListColumnOrder,
        ...passOnContext
    } = useContext(ListViewBuilderContext);

    const listViewColumns = useMemo(() => {
        const createMainPropertyOptionSet = (column: ColumnConfigWithOptions) => {
            const dataElement = new DataElement((o) => {
                o.id = column.id;
                o.type = column.type;
            });

            const options = column.options.map(option =>
                new Option((o) => {
                    o.text = option.text;
                    o.value = option.value;
                }),
            );

            const optionSet = new OptionSet(column.id, options, null, dataElement);
            dataElement.optionSet = optionSet;
            return optionSet;
        };

        return columns
            .map((column) => {
                if (column.isMainProperty) {
                    return {
                        ...column,
                        optionSet: column.options && createMainPropertyOptionSet(column),
                    };
                }

                return column;
            });
    }, [
        columns,
    ]);

    const listViewDataSource = useMemo(() =>
        recordsOrder
            .map(id => dataSource[id]), [
        dataSource,
        recordsOrder,
    ]);

    return (
        <ListView
            {...passOnProps}
            {...passOnContext}
            columns={listViewColumns}
            dataSource={listViewDataSource}
            onRowClick={onListRowSelect}
            onSort={onSortList}
            onSetColumnOrder={onSetListColumnOrder}
            customMenuContents={customListViewMenuContents}
        />
    );
};
