// @flow
import React, { useContext, useMemo } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { ListView } from '../../../../ListView';
import { ListViewBuilderContext } from '../workingLists.context';
import type { Props } from './listViewBuilder.types';


// eslint-disable-next-line complexity
export const ListViewBuilder = ({ customListViewMenuContents, ...passOnProps }: Props) => {
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
