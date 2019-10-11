// @flow
import { createSelector } from 'reselect';

const appliedFiltersSelector = state => state.workingListsAppliedFilters.main;

// $FlowFixMe
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

// $FlowFixMe
export const makeOnItemSelectedSelector = () => createSelector(
    data => data.dispatch,
    data => data.listId,
    data => data.onItemSelected,
    (
        dispatch: ReduxDispatch,
        listId: string,
        onItemSelected: (id: string, listId: string) => void,
    ) =>
        (id: string) => dispatch(onItemSelected(id, listId)),
);
