// @flow
import * as React from 'react';
import { FiltersRowsComponent } from './FiltersRows.component';
import type { Column, FiltersOnly, AdditionalFilters } from '../types';

type Props = {
    programStageId?: string,
    columns: Array<Column>,
    filtersOnly?: FiltersOnly,
    additionalFilters?: AdditionalFilters,
    onUpdateFilter: Function,
    onClearFilter: Function,
    onRemoveFilter: Function,
    onSelectRestMenuItem: Function,
    stickyFilters: Object,
};

const useAdditionalFiltersButtons = ({ additionalFilters, stickyFilters, filterHasValue }) => {
    if (additionalFilters && stickyFilters) {
        const { filtersWithValueOnInit = {}, userSelectedFilters = {} } = stickyFilters;
        const mainButtonAdditionalFilters = additionalFilters.find(filter => filter.mainButton);

        return mainButtonAdditionalFilters
            ? {
                shouldRenderAdditionalFiltersButtons:
                      userSelectedFilters[mainButtonAdditionalFilters.id] ||
                      filtersWithValueOnInit[mainButtonAdditionalFilters.id],
                visibleSelectorId: !filterHasValue ? mainButtonAdditionalFilters.id : undefined,
            }
            : { shouldRenderAdditionalFiltersButtons: false, visibleSelectorId: undefined };
    }
    return { shouldRenderAdditionalFiltersButtons: false, visibleSelectorId: undefined };
};

export const FiltersRows = ({
    columns,
    filtersOnly,
    additionalFilters,
    onUpdateFilter,
    onClearFilter,
    onRemoveFilter,
    onSelectRestMenuItem,
    stickyFilters,
    programStageId,
}: Props) => {
    const { shouldRenderAdditionalFiltersButtons, visibleSelectorId } = useAdditionalFiltersButtons({
        additionalFilters,
        stickyFilters,
        filterHasValue: Boolean(programStageId),
    });

    return (
        <FiltersRowsComponent
            columns={columns}
            filtersOnly={filtersOnly}
            additionalFilters={additionalFilters}
            onUpdateFilter={onUpdateFilter}
            onClearFilter={onClearFilter}
            onRemoveFilter={onRemoveFilter}
            onSelectRestMenuItem={onSelectRestMenuItem}
            stickyFilters={stickyFilters}
            shouldRenderAdditionalFiltersButtons={shouldRenderAdditionalFiltersButtons}
            visibleSelectorId={visibleSelectorId}
        />
    );
};
