// @flow
import React, { useContext, useMemo } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import {
    OptionSet,
    Option,
    DataElement,
} from '../../../../../metaData';
import { ListView } from '../../../../ListView';
import { ListViewBuilderContext } from '../workingLists.context';
import type { ColumnConfig } from '../workingLists.types';
import type { Props } from './listViewBuilder.types';

type ColumnConfigWithOptions = {
    ...ColumnConfig,
    options: Array<{ text: string, value: any }>,
};
// eslint-disable-next-line complexity
export const ListViewBuilder = ({ columns, customListViewMenuContents, ...passOnProps }: Props) => {
    const context = useContext(ListViewBuilderContext);
    if (!context) {
        throw Error('missing ListViewBuilderContext');
    }

    const {
        dataSource,
        recordsOrder,
        onSelectListRow,
        onSortList,
        onSetListColumnOrder,
        rowsCount,
        stickyFilters,
        ...passOnContext
    } = context;

    if (!dataSource || !recordsOrder || rowsCount == null || !stickyFilters) {
        const baseErrorMessage = 'dataSource, recordsOrder, rowsCount, stickyFilters needs to be set in ListViewBuilder';
        log.error(
            errorCreator(baseErrorMessage)(
                { dataSource, recordsOrder, rowsCount, stickyFilters }));
        throw Error(`${baseErrorMessage}. See console for details`);
    }
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
                        // $FlowFixMe handled in later PR
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
            // $FlowFixMe handling this in later PR
            columns={listViewColumns}
            dataSource={listViewDataSource}
            onSelectRow={onSelectListRow}
            onSort={onSortList}
            onSetColumnOrder={onSetListColumnOrder}
            customMenuContents={customListViewMenuContents}
            rowsCount={rowsCount}
            stickyFilters={stickyFilters}
        />
    );
};
