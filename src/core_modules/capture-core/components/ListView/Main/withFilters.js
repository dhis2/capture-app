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
    programStageId?: string,
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
        ...passOnProps
    }: Props) => (
        <InnerComponent
            {...passOnProps}
            columns={columns}
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
