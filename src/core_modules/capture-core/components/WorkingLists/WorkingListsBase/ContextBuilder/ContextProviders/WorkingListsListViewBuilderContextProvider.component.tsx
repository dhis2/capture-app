import React, { useMemo } from 'react';
import {
    ListViewBuilderContext,
} from '../../workingListsBase.context';
import type { Props } from './workingListsListViewBuilderContextProvider.types';

export const WorkingListsListViewBuilderContextProvider = ({
    updating,
    selectedRows,
    allRowsAreSelected,
    selectionInProgress,
    dataSource,
    onClickListRow,
    onRowSelect,
    onSelectAll,
    onSortList,
    onSetListColumnOrder,
    customRowMenuContents,
    onUpdateFilter,
    onClearFilter,
    onRemoveFilter,
    onSelectRestMenuItem,
    onChangePage,
    onChangeRowsPerPage,
    stickyFilters,
    programStageId,
    bulkActionBarComponent,
    children,
}: Props) => {
    const listViewBuilderContextData = useMemo(() => ({
        updating,
        dataSource,
        selectedRows,
        allRowsAreSelected,
        selectionInProgress,
        onClickListRow,
        onRowSelect,
        onSelectAll,
        onSortList,
        onSetListColumnOrder,
        customRowMenuContents,
        onUpdateFilter,
        onClearFilter,
        onRemoveFilter,
        onSelectRestMenuItem,
        onChangePage,
        onChangeRowsPerPage,
        stickyFilters,
        programStageId,
        bulkActionBarComponent,
    }), [
        updating,
        dataSource,
        selectedRows,
        allRowsAreSelected,
        selectionInProgress,
        onClickListRow,
        onRowSelect,
        onSelectAll,
        onSortList,
        onSetListColumnOrder,
        customRowMenuContents,
        onUpdateFilter,
        onClearFilter,
        onRemoveFilter,
        onSelectRestMenuItem,
        onChangePage,
        onChangeRowsPerPage,
        stickyFilters,
        programStageId,
        bulkActionBarComponent,
    ]);

    return (
        <ListViewBuilderContext.Provider
            value={listViewBuilderContextData}
        >
            {children}
        </ListViewBuilderContext.Provider>
    );
};
