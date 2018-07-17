// @flow
import {
    actionTypes as columnSelectorActionTypes,
} from '../../../../ColumnSelector/actions/ColumnSelector.actions';
import { updateIncludedFiltersAfterColumnSorting } from './filterSelector.actions';

export const includeFiltersWithValueAfterColumnSortingEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(columnSelectorActionTypes.UPDATE_WORKINGLIST_ORDER)
        .map(() => {
            const state = store.getState();
            const appliedFilters = (state.workingListsAppliedFilters && state.workingListsAppliedFilters.main) || {};
            const nextAppliedFilters = (
                state.workingListsAppliedFilters &&
                state.workingListsAppliedFilters.main &&
                state.workingListsAppliedFilters.main.next) || {};

            const filtersToIncludeFromAlreadyApplied = Object
                .keys(appliedFilters)
                .reduce((accFiltersToIncludeFromAlreadyApplied, key) => {
                    if (appliedFilters[key] && key !== 'next') {
                        accFiltersToIncludeFromAlreadyApplied[key] = true;
                    }
                    return accFiltersToIncludeFromAlreadyApplied;
                }, {});

            const filtersToIncludeFromNext = Object
                .keys(nextAppliedFilters)
                .reduce((accFiltersToIncludeFromNext, key) => {
                    if (nextAppliedFilters[key]) {
                        accFiltersToIncludeFromNext[key] = true;
                    }
                    return accFiltersToIncludeFromNext;
                }, {});
            return updateIncludedFiltersAfterColumnSorting({
                ...filtersToIncludeFromAlreadyApplied,
                ...filtersToIncludeFromNext,
            });
        });
