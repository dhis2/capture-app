// @flow
import { batchActions } from 'redux-batched-actions';
import { cleanUpEventListInLoading } from './cleanUp.actions';
import type { Store } from 'redux';


function getActionToCleanUpInLoadingList(state: ReduxState) {
    if (state.workingListsUI.main && state.workingListsUI.main.isLoading) {
        return cleanUpEventListInLoading();
    }
    return null;
}

export const cleanUpCommon = (store: Store<ReduxState>) => {
    const cleanUpActions = [getActionToCleanUpInLoadingList(store.getState())]
        .filter((value): value is NonNullable<typeof value> => value !== null);

    if (cleanUpActions.length > 0) {
        store.dispatch(
            batchActions(cleanUpActions),
        );
    }
};
