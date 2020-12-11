// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { OFFLINE_STATUS_CHANGED } from '@redux-offline/redux-offline/lib/constants';
import { networkStatusChange } from './NetworkStatusBadge.actions';

export const networkMonitorStatusEpic = (action$: InputObservable) =>
  action$.pipe(
    ofType(OFFLINE_STATUS_CHANGED),
    map((action) => networkStatusChange(action.payload.online)),
  );
