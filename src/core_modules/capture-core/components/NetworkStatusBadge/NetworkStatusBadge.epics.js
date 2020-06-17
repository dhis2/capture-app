// @flow
import { OFFLINE_STATUS_CHANGED } from '@redux-offline/redux-offline/lib/constants.js';
import { networkStatusChange } from './NetworkStatusBadge.actions.js';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';

type InputObservable = rxjs$Observable<ReduxAction<any, any>>;

export const networkMonitorStatusEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.pipe(
        ofType(OFFLINE_STATUS_CHANGED),
        map(action => networkStatusChange(action.payload.online)),
    );

