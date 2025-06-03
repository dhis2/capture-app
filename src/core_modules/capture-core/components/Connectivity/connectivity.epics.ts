import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { map, filter } from 'rxjs/operators';
import type { EpicAction } from '../../../capture-core-utils/types';

import { getEventListOnReconnect, goingOnlineExecuted, batchActionTypes } from './connectivity.actions';

const OFFLINE_STATUS_CHANGED = 'Offline/STATUS_CHANGED';

export const goingOnlineEpic = (action$: EpicAction<{ online: boolean }>, store: any) =>
    action$.pipe(
        ofType(OFFLINE_STATUS_CHANGED),
        filter((action: any) => {
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
