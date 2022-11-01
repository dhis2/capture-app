// @flow
import * as React from 'react';
import { FiltersRows } from '../Filters';
import type { Columns, FiltersOnly, AdditionalFilters } from '../types';

type Props = {
    columns: Columns,
    filtersOnly?: FiltersOnly,
    additionalFilters?: AdditionalFilters,
    onUpdateFilter: Function,
    onClearFilter: Function,
    onRemoveFilter: Function,
    onSelectRestMenuItem: Function,
    stickyFilters: Object,
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
        ...passOnProps
    }: Props) => (
        <InnerComponent
            {...passOnProps}
            columns={columns}
            filters={
                <FiltersRows
                    columns={columns}
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
