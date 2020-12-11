// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { workingListsCommonActionTypes, setStickyFiltersAfterColumnSorting } from '../actions';

export const includeFiltersWithValueAfterColumnSortingEpic = (
  action$: InputObservable,
  store: ReduxStore,
) =>
  action$.pipe(
    ofType(workingListsCommonActionTypes.LIST_COLUMN_ORDER_SET),
    // eslint-disable-next-line complexity
    map((action) => {
      const state = store.value;
      const { storeId } = action.payload;

      const appliedFilters =
        (state.workingListsMeta &&
          state.workingListsMeta[storeId] &&
          state.workingListsMeta[storeId].filters) ||
        {};
      const nextAppliedFilters =
        (state.workingListsMeta &&
          state.workingListsMeta[storeId] &&
          state.workingListsMeta[storeId].next &&
          state.workingListsMeta[storeId].next.filters) ||
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

      return setStickyFiltersAfterColumnSorting(filtersToInclude, storeId);
    }),
  );
