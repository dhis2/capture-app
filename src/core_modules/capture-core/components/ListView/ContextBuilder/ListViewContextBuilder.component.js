// @flow
import React, { useMemo } from 'react';
import {
    FilterValuesContext,
    PaginationContext,
} from '../listView.context';
import { ListViewMain } from '../Main';
import type { Props } from './listViewContextBuilder.types';

export const ListViewContextBuilder = ({
    filters,
    onChangePage,
    onChangeRowsPerPage,
    rowsPerPage,
    currentPage,
    dataSource,
    ...passOnProps
}: Props) => {
    const paginationContextData = useMemo(() => ({
        onChangePage,
        onChangeRowsPerPage,
        rowsPerPage,
        currentPage,
        rowCountPage: dataSource.length,
    }), [
        onChangePage,
        onChangeRowsPerPage,
        rowsPerPage,
        currentPage,
        dataSource.length,
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
                    dataSource={dataSource}
                />
            </PaginationContext.Provider>
        </FilterValuesContext.Provider>
    );
};

