// @flow
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';

import { OFFLINE_STATUS_CHANGED } from '@redux-offline/redux-offline/lib/constants';
import { networkStatusChange } from './NetworkStatusBadge.actions';

type InputObservable = rxjs$Observable<ReduxAction<any, any>>;

export const networkMonitorStatusEpic = (action$: InputObservable) =>

    action$
        // $FlowFixMe[prop-missing] automated comment
        .ofType(OFFLINE_STATUS_CHANGED)
        .map(action => networkStatusChange(action.payload.online));

