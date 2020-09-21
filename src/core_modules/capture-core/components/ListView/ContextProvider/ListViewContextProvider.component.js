// @flow
import React, { useMemo } from 'react';
import {
    FilterValuesContext,
    PaginationContext,
} from '../listView.context';
import { ListViewMain } from '../Main';
import type { Props } from './listViewContextProvider.types';

export const ListViewContextProvider = ({
    filters,
    onChangePage,
    onChangeRowsPerPage,
    rowsPerPage,
    currentPage,
    rowsCount,
    ...passOnProps
}: Props) => {
    const paginationContextData = useMemo(() => ({
        onChangePage,
        onChangeRowsPerPage,
        rowsPerPage,
        currentPage,
        rowsCount,
    }), [
        onChangePage,
        onChangeRowsPerPage,
        rowsPerPage,
        currentPage,
        rowsCount,
    ]);

    return (
        <FilterValuesContext.Provider
            value={filters}
        >
            <PaginationContext.Provider
                value={paginationContextData}
            >
                <ListViewMain
                    {...passOnProps}
                />
            </PaginationContext.Provider>
        </FilterValuesContext.Provider>
    );
};

