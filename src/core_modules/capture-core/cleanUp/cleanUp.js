// @flow
import { batchActions } from 'redux-batched-actions';
import { cleanUpEventListInLoading } from './cleanUp.actions';

function getActionToCleanUpInLoadingList(state: ReduxState) {
    if (state.workingListsUI.main && state.workingListsUI.main.isLoading) {
        return cleanUpEventListInLoading();
    }
    return null;
}

export default function cleanUp(store: ReduxStore) {
    const cleanUpActions = [
        getActionToCleanUpInLoadingList(store.value),
    ]
        .filter(value => value);

    if (cleanUpActions.length > 0) {
        store.dispatch(
            batchActions(cleanUpActions),
        );
    }
}
