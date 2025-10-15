import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { OFFLINE_STATUS_CHANGED } from '@redux-offline/redux-offline/lib/constants';
import type { EpicAction } from 'capture-core-utils/types/global';
import { networkStatusChange } from './NetworkStatusBadge.actions';

export const networkMonitorStatusEpic = (action$: EpicAction<any>) =>
    action$.pipe(
        ofType(OFFLINE_STATUS_CHANGED),
        map(action => networkStatusChange(action.payload.online)),
    );
