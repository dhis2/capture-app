import React, { useContext } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { ListView } from '../../../ListView';
import { ListViewBuilderContext } from '../workingListsBase.context';
import type { Props } from './listViewBuilder.types';


export const ListViewBuilder = ({ customListViewMenuContents, ...passOnProps }: Props) => {
    const context = useContext(ListViewBuilderContext);
    if (!context) {
        throw Error('missing ListViewBuilderContext');
    }

    const {
        dataSource,
        onClickListRow,
        onRowSelect,
        onSelectAll,
        selectedRows,
        allRowsAreSelected,
        onSortList,
        onSetListColumnOrder,
        stickyFilters,
        ...passOnContext
    } = context;

    if (!dataSource || !stickyFilters) {
        const baseErrorMessage = 'dataSource and stickyFilters needs to be set in ListViewBuilder';
        log.error(
            errorCreator(baseErrorMessage)(
                { dataSource, stickyFilters }));
        throw Error(`${baseErrorMessage}. See console for details`);
    }

    return (
        <ListView
            {...passOnProps}
            {...passOnContext}
            dataSource={dataSource}
            selectedRows={selectedRows}
            allRowsAreSelected={allRowsAreSelected ?? false}
            onClickListRow={onClickListRow}
            onRowSelect={onRowSelect}
            onSelectAll={onSelectAll}
            onSort={onSortList}
            onSetColumnOrder={onSetListColumnOrder}
            customMenuContents={customListViewMenuContents}
            stickyFilters={stickyFilters}
        />
    );
};
