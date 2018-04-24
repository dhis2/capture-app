// @flow
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';

import { actionTypes, mainSelectionCompleted } from './mainSelections.actions';

type InputObservable = rxjs$Observable<ReduxAction<any, any>>;

export const mainSelectionsCompletedEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(actionTypes.UPDATE_MAIN_SELECTIONS)
        .filter(() => {
            const { programId, orgUnitId } = store.getState().currentSelections;
            return programId && orgUnitId;
        })
        .map(() => mainSelectionCompleted());
