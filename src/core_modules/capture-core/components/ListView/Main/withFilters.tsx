import * as React from 'react';
import { FiltersRows } from '../Filters';
import type { Columns, FiltersOnly, AdditionalFilters, DataSource } from '../types';

type Props = {
    columns: Columns;
    filtersOnly?: FiltersOnly;
    additionalFilters?: AdditionalFilters;
    onUpdateFilter: (filterId: string, filterData: any) => void;
    onClearFilter: (filterId: string) => void;
    onRemoveFilter: (filterId: string, additionalData?: any) => void;
    onSelectRestMenuItem: (filterId: string, item: any) => void;
    stickyFilters: any;
    programStageId?: string;
    dataSource: DataSource;
    selectedRows: { [key: string]: boolean };
    allRowsAreSelected?: boolean;
    onRowSelect: (id: string) => void;
    onSelectAll: (rows: Array<string>) => void;
    isSelectionInProgress?: boolean;
    bulkActionBarComponent: any;
};

export const withFilters = () => (InnerComponent: React.ComponentType<any>) =>
    ({
        columns,
        filtersOnly,
        additionalFilters,
        onUpdateFilter,
        onClearFilter,
        onRemoveFilter,
        onSelectRestMenuItem,
        stickyFilters,
        programStageId,
        dataSource,
        selectedRows,
        allRowsAreSelected,
        onRowSelect,
        onSelectAll,
        isSelectionInProgress,
        bulkActionBarComponent,
        ...passOnProps
    }: Props) => (
        <InnerComponent
            {...passOnProps}
            columns={columns}
            dataSource={dataSource}
            selectedRows={selectedRows}
            allRowsAreSelected={allRowsAreSelected}
            onRowSelect={onRowSelect}
            onSelectAll={onSelectAll}
            isSelectionInProgress={isSelectionInProgress}
            bulkActionBarComponent={bulkActionBarComponent}
            filters={
                <FiltersRows
                    columns={columns}
                    programStageId={programStageId}
                    filtersOnly={filtersOnly}
                    additionalFilters={additionalFilters}
                    onUpdateFilter={onUpdateFilter}
                    onClearFilter={onClearFilter}
                    onRemoveFilter={onRemoveFilter}
                    onSelectRestMenuItem={onSelectRestMenuItem}
                    stickyFilters={stickyFilters}
                />}
        />
    );
