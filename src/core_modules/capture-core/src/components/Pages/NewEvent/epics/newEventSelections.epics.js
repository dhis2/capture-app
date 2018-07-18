// @flow
import { getApi } from '../../../../d2/d2Instance';
import i18n from '@dhis2/d2-i18n';
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
        .filter(action => action.payload.nextProps.orgUnitId)
        .switchMap(action => getApi()
            .get(`organisationUnits/${action.payload.nextProps.orgUnitId}`)
            .then(response => setCurrentOrgUnitBasedOnUrl({ id: response.id, name: response.displayName }),
            )
            .catch(() =>
                errorRetrievingOrgUnitBasedOnUrl(i18n.t('Could not get organisation unit')),
            ),
        );

export const selectionsFromUrlEmptyOrgUnitForNewEventEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(actionTypes.UPDATE_SELECTIONS_FROM_URL)
        .filter(action => !action.payload.nextProps.orgUnitId)
        .map(() => setEmptyOrgUnitBasedOnUrl());

export const selectionsFromUrlValidationForNewEventEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(actionTypes.SET_ORG_UNIT_BASED_ON_URL, actionTypes.SET_EMPTY_ORG_UNIT_BASED_ON_URL)
        .map(() => {
            const { programId } = store.getState().currentSelections;

            if (programId && !programCollection.has(programId)) {
                return invalidSelectionsFromUrl(i18n.t("Program doesn't exist"));
            }

            return validSelectionsFromUrl();
        });
