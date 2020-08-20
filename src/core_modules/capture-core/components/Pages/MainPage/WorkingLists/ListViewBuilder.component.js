// @flow
import React, { useContext, useMemo } from 'react';
import {
    OptionSet,
    Option,
    DataElement,
} from '../../../../metaData';
import { ListView } from '../../../ListView';
import { ListViewBuilderContext } from './workingLists.context';
import type { ColumnConfig, GetOrdinaryColumnMetadataFn, GetMainColumnMetadataHeaderFn } from './workingLists.types';

type PassOnProps = {
    listId: string,
};

type Props = {
    ...PassOnProps,
    getOrdinaryColumnMetadata: GetOrdinaryColumnMetadataFn,
    getMainColumnMetadataHeader: GetMainColumnMetadataHeaderFn,
};

type ColumnConfigWithOptions = {
    ...ColumnConfig,
    options: Array<{ text: string, value: any }>,
};

export const ListViewBuilder = (props: Props) => {
    const { getOrdinaryColumnMetadata, getMainColumnMetadataHeader, ...passOnProps } = props;

    const {
        isUpdating,
        columnOrder,
        dataSource,
        recordsOrder,
        onListRowSelect,
        onSortList,
        onSetListColumnOrder,
        customRowMenuContents,
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

        return columnOrder
            .map((column) => {
                if (column.isMainProperty) {
                    return {
                        ...column,
                        header: column.header || getMainColumnMetadataHeader(column.id),
                        optionSet: column.options && createMainPropertyOptionSet(column),
                    };
                }

                const { header, optionSet } = getOrdinaryColumnMetadata(column.id);
                return {
                    ...column,
                    header,
                    optionSet,
                };
            });
    }, [
        columnOrder,
        getMainColumnMetadataHeader,
        getOrdinaryColumnMetadata,
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
            isUpdating={isUpdating}
            columns={listViewColumns}
            dataSource={listViewDataSource}
            onRowClick={onListRowSelect}
            onSort={onSortList}
            onSetColumnOrder={onSetListColumnOrder}
            customRowMenuContents={customRowMenuContents}
        />
    );
};
