// @flow
import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { map, filter } from 'rxjs/operators';

import { getEventListOnReconnect, goingOnlineExecuted, batchActionTypes } from './connectivity.actions';

const OFFLINE_STATUS_CHANGED = 'Offline/STATUS_CHANGED';

export const goingOnlineEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(OFFLINE_STATUS_CHANGED),
        filter((action) => {
            const online = !!action.payload.online;
            return online;
        }),
        map(() => {
            let actions = [
                goingOnlineExecuted(),
            ];

            const state = store.value;
            const isSelectionsComplete = !!state.currentSelections.complete;
            if (isSelectionsComplete) {
                actions = [
                    ...actions,
                    getEventListOnReconnect(),
                ];
            }

            return batchActions(actions, batchActionTypes.GOING_ONLINE_EXECUTED_BATCH);
        }));
