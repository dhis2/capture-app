// @flow
import React, { useMemo } from 'react';
import {
    ListViewBuilderContext,
} from '../../workingListsBase.context';
import type { Props } from './workingListsListViewBuilderContextProvider.types';

export const WorkingListsListViewBuilderContextProvider = ({
    updating,
    updatingWithDialog,
    dataSource,
    onSelectListRow,
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
    children,
}: Props) => {
    const listViewBuilderContextData = useMemo(() => ({
        updating,
        updatingWithDialog,
        dataSource,
        onSelectListRow,
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
    }), [
        updating,
        updatingWithDialog,
        dataSource,
        onSelectListRow,
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
    ]);

    return (
        <ListViewBuilderContext.Provider
            value={listViewBuilderContextData}
        >
            {children}
        </ListViewBuilderContext.Provider>
    );
};
