// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { actionTypes as columnSelectorActionTypes } from '../ListWrapper/actions/columnSelectorDialog.actions';
import { updateIncludedFiltersAfterColumnSorting } from './filterSelector.actions';

export const includeFiltersWithValueAfterColumnSortingEpic = (
  action$: InputObservable,
  store: ReduxStore,
) =>
  action$.pipe(
    ofType(columnSelectorActionTypes.UPDATE_WORKINGLIST_ORDER),
    // eslint-disable-next-line complexity
    map(() => {
      const state = store.value;
      const listId = state.workingListsTemplates.eventList.currentListId;
      const appliedFilters =
        (state.workingListsMeta &&
          state.workingListsMeta[listId] &&
          state.workingListsMeta[listId].filters) ||
        {};
      const nextAppliedFilters =
        (state.workingListsMeta &&
          state.workingListsMeta[listId] &&
          state.workingListsMeta[listId].next &&
          state.workingListsMeta[listId].next.filters) ||
        {};

      const nextAppliedFiltersNoUndefined = Object.keys(nextAppliedFilters).reduce((acc, key) => {
        if (nextAppliedFilters[key] !== undefined) {
          acc[key] = nextAppliedFilters[key];
        }
        return acc;
      }, {});

      const concatenatedFilters = {
        ...appliedFilters,
        ...nextAppliedFiltersNoUndefined,
      };

      const filtersToInclude = Object.keys(concatenatedFilters).reduce((acc, key) => {
        if (concatenatedFilters[key]) {
          acc[key] = true;
        }
        return acc;
      }, {});

      return updateIncludedFiltersAfterColumnSorting(filtersToInclude, listId);
    }),
  );
