// @flow
import React, { useMemo } from 'react';
import { ListViewBuilderContext } from '../../workingListsBase.context';
import type { Props } from './workingListsListViewBuilderContextProvider.types';

export const WorkingListsListViewBuilderContextProvider = ({
    updating,
    updatingWithDialog,
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
        updatingWithDialog,
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
        updatingWithDialog,
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
