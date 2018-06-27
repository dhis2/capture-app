// @flow
import { createSelector } from 'reselect';

const appliedFiltersSelector = state => state.workingListsAppliedFilters.main;

export const makeAppliedViewFiltersSelector = () => createSelector(
    appliedFiltersSelector,
    (appliedFilters) => {
        const { next, ...currentlyAppliedFilters } = (appliedFilters || {});
        return {
            ...currentlyAppliedFilters,
            ...next,
        };
    },
);
