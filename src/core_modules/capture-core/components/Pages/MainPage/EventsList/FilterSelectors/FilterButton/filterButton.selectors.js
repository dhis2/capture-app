// @flow
import { createSelector } from 'reselect';
import { buildButtonText } from './buttonTextBuilder';

const appliedFilterSelector = (state, props) =>
    state.workingListsMeta[props.listId] &&
    state.workingListsMeta[props.listId].filters &&
    state.workingListsMeta[props.listId].filters[props.itemId];

const toApplyFilterSelector = (state, props) =>
    state.workingListsMeta[props.listId] &&
    state.workingListsMeta[props.listId].next &&
    state.workingListsMeta[props.listId].next.filters &&
    state.workingListsMeta[props.listId].next.filters[props.itemId];

// $FlowFixMe
export const makeCurrentFilterSelector = () => createSelector(
    appliedFilterSelector,
    toApplyFilterSelector,
    (appliedFilter, toApplyFilter) => (toApplyFilter !== undefined ? toApplyFilter : appliedFilter),
);

// $FlowFixMe
export const makeFilterValueSelector = () => createSelector(
    currentFilter => currentFilter,
    (currentFilter, props) => props.type,
    (currentFilter, props) => props.optionSet,
    (currentFilter, type, optionSet) => {
        if (!currentFilter) {
            return currentFilter;
        }
        return buildButtonText(currentFilter, type, optionSet);
    },
);
