// @flow
import { createSelector } from 'reselect';

const appliedFilterSelector = (state, props) => state.workingListsAppliedFilters.main[props.itemId];
const toApplyFilterSelector = (state, props) =>
    state.workingListsAppliedFilters.main &&
    state.workingListsAppliedFilters.main.next &&
    state.workingListsAppliedFilters.main.next[props.itemId];

export const makeFilterValueSelector = () => createSelector(
    appliedFilterSelector,
    toApplyFilterSelector,
    (appliedFilter, toApplyFilter) => toApplyFilter || appliedFilter,
);
