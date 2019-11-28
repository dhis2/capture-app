// @flow
import { createSelector } from 'reselect';

const appliedFilterSelector = (state, props) =>
    state.workingListsAppliedFilters[props.listId] &&
    state.workingListsAppliedFilters[props.listId][props.itemId];

const toApplyFilterSelector = (state, props) =>
    state.workingListsAppliedFilters[props.listId] &&
    state.workingListsAppliedFilters[props.listId].next &&
    state.workingListsAppliedFilters[props.listId].next[props.itemId];

// $FlowFixMe
export const makeFilterValueSelector = () => createSelector(
    appliedFilterSelector,
    toApplyFilterSelector,
    (appliedFilter, toApplyFilter) => (toApplyFilter !== undefined ? toApplyFilter : appliedFilter),
);
