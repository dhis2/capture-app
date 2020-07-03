// @flow
import { createSelector } from 'reselect';

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
        // $FlowFixMe[incompatible-call] automated comment
        (id: string) => dispatch(onItemSelected(id, listId)),
);
