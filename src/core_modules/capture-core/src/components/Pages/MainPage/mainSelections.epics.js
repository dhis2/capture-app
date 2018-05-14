// @flow
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import { getApi } from '../../../d2/d2Instance';
import { actionTypes, mainSelectionCompleted, orgUnitDataRetrived } from './mainSelections.actions';

type InputObservable = rxjs$Observable<ReduxAction<any, any>>;

export const mainSelectionsCompletedEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(actionTypes.UPDATE_MAIN_SELECTIONS)
        .filter(() => {
            const { programId, orgUnitId } = store.getState().currentSelections;
            return programId && orgUnitId;
        })
        .map(() => mainSelectionCompleted());

export const orgUnitDataRetrivedEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(actionTypes.UPDATE_MAIN_SELECTIONS)
        .filter((action) => {
            const orgUnitId = action.payload.orgUnitId;
            return orgUnitId;
        })
        .switchMap(action => getApi()
            .get(`organisationUnits/${action.payload.orgUnitId}`)
            .then(response => orgUnitDataRetrived({ id: response.id, name: response.displayName })));
