import { batchActions } from 'redux-batched-actions';
import { cleanUpEventListInLoading } from './cleanUp.actions';

function getActionToCleanUpInLoadingList(state: any) {
    if (state.workingListsUI.main && state.workingListsUI.main.isLoading) {
        return cleanUpEventListInLoading();
    }
    return null;
}

export const cleanUpCommon = (store: any) => {
    const cleanUpActions = [getActionToCleanUpInLoadingList(store.getState())]
        .filter(value => value);

    if (cleanUpActions.length > 0) {
        store.dispatch(batchActions(cleanUpActions as any));
    }
};
