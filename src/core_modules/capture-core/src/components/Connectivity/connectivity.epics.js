// @flow
import { batchActions } from 'redux-batched-actions';
import { getEventListOnReconnect, goingOnlineExecuted, batchActionTypes } from './connectivity.actions';

const OFFLINE_STATUS_CHANGED = 'Offline/STATUS_CHANGED';

export const goingOnlineEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(OFFLINE_STATUS_CHANGED)
        .filter((action) => {
            const online = !!action.payload.online;
            return online;
        })
        .map(() => {
            let actions = [
                goingOnlineExecuted(),
            ];

            const state = store.getState();
            const isSelectionsComplete = !!state.currentSelections.complete;
            if (isSelectionsComplete) {
                actions = [
                    ...actions,
                    getEventListOnReconnect(),
                ];
            }

            return batchActions(actions, batchActionTypes.GOING_ONLINE_EXECUTED_BATCH);
        });
