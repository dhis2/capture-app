// @flow
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import { getApi, getTranslation } from '../../../../d2/d2Instance';
import {
    actionTypes,
    setCurrentOrgUnitBasedOnUrl,
    errorRetrievingOrgUnitBasedOnUrl,
    invalidSelectionsFromUrl,
    validSelectionsFromUrl,
    setEmptyOrgUnitBasedOnUrl,
} from '../newEventSelections.actions';
import programCollection from '../../../../metaDataMemoryStores/programCollection/programCollection';

export const selectionsFromUrlGetOrgUnitDataForNewEventEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(actionTypes.UPDATE_SELECTIONS_FROM_URL)
        .filter(action => action.payload.orgUnitId)
        .switchMap(action => getApi()
            .get(`organisationUnits/${action.payload.orgUnitId}`)
            .then(response => setCurrentOrgUnitBasedOnUrl({ id: response.id, name: response.displayName }),
            )
            .catch(() =>
                errorRetrievingOrgUnitBasedOnUrl(getTranslation('could_not_get_organisation_unit')),
            ),
        );

export const selectionsFromUrlEmptyOrgUnitForNewEventEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(actionTypes.UPDATE_SELECTIONS_FROM_URL)
        .filter(action => !action.payload.orgUnitId)
        .map(() => setEmptyOrgUnitBasedOnUrl());

export const selectionsFromUrlValidationForNewEventEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(actionTypes.SET_ORG_UNIT_BASED_ON_URL, actionTypes.SET_EMPTY_ORG_UNIT_BASED_ON_URL)
        .map(() => {
            const { programId, orgUnitId } = store.getState().currentSelections;

            if (!orgUnitId) {
                return invalidSelectionsFromUrl(getTranslation('organisation_id_must_be_specified'));
            }

            if (!programId) {
                return invalidSelectionsFromUrl(getTranslation('program_id_must_be_specified'));
            }

            if (!programCollection.has(programId)) {
                return invalidSelectionsFromUrl(getTranslation('program_doesnt_exist'));
            }

            return validSelectionsFromUrl();
        });
