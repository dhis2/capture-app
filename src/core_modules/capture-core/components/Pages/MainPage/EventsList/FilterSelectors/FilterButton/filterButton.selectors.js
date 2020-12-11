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

export const makeCurrentFilterSelector = () =>
  // $FlowFixMe[missing-annot] automated comment
  createSelector(appliedFilterSelector, toApplyFilterSelector, (appliedFilter, toApplyFilter) =>
    toApplyFilter !== undefined ? toApplyFilter : appliedFilter,
  );

export const makeFilterValueSelector = () =>
  // $FlowFixMe[missing-annot] automated comment
  createSelector(
    (currentFilter) => currentFilter,
    (currentFilter, props) => props.type,
    (currentFilter, props) => props.optionSet,
    (currentFilter, type, optionSet) => {
      if (!currentFilter) {
        return currentFilter;
      }
      return buildButtonText(currentFilter, type, optionSet);
    },
  );
