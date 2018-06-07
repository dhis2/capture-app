// @flow
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';

import { actionCreator } from '../../actions/actions.utils';
import { OFFLINE_STATUS_CHANGED } from '@redux-offline/redux-offline/lib/constants.js'

type InputObservable = rxjs$Observable<ReduxAction<any, any>>;

export const networkMonitorStatusEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$
        .ofType(OFFLINE_STATUS_CHANGED)
        .map((action) => {
            return actionCreator('FLIP_IT')({status: action.payload.online})
        });

