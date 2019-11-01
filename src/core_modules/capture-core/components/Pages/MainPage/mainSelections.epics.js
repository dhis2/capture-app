// @flow
import { getApi } from '../../../d2/d2Instance';
import i18n from '@dhis2/d2-i18n';
import {
    actionTypes,
    mainSelectionCompleted,
    orgUnitDataRetrived,
    setCurrentOrgUnitBasedOnUrl,
    errorRetrievingOrgUnitBasedOnUrl,
    setEmptyOrgUnitBasedOnUrl,
    validSelectionsFromUrl,
    invalidSelectionsFromUrl,
} from './mainSelections.actions';
import { actionTypes as mainPageSelectorActionTypes } from '../MainPage/MainPageSelector/MainPageSelector.actions';
import {
    actionTypes as crossPageActionTypes,
} from '../actions/crossPage.actions';
import programCollection from '../../../metaDataMemoryStores/programCollection/programCollection';

export const mainSelectionsCompletedEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        crossPageActionTypes.SELECTIONS_COMPLETENESS_CALCULATED,
    )
        .filter((action) => {
            const { triggeringActionType } = action.payload;
            return [
                actionTypes.UPDATE_MAIN_SELECTIONS,
                actionTypes.VALID_SELECTIONS_FROM_URL,
                mainPageSelectorActionTypes.SET_PROGRAM_ID,
                mainPageSelectorActionTypes.SET_CATEGORY_OPTION,
                mainPageSelectorActionTypes.SET_ORG_UNIT,
            ].includes(triggeringActionType);
        })
        .filter(() => {
            const currentSelectionsComplete = !!store.getState().currentSelections.complete;
            return currentSelectionsComplete;
        })
        .map(() => mainSelectionCompleted());

export const orgUnitDataRetrivedEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(actionTypes.UPDATE_MAIN_SELECTIONS)
        .filter((action) => {
            const orgUnitId = action.payload.orgUnitId;
            return orgUnitId;
        })
        .switchMap(action => getApi()
            .get(`organisationUnits/${action.payload.orgUnitId}`)
            .then(response => orgUnitDataRetrived({ id: response.id, name: response.displayName })));

// Url-Specific

export const mainSelectionsFromUrlGetOrgUnitDataEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(actionTypes.UPDATE_MAIN_SELECTIONS_FROM_URL)
        .filter(action => action.payload.nextProps.orgUnitId)
        .switchMap(action => getApi()
            .get(`organisationUnits/${action.payload.nextProps.orgUnitId}`)
            .then(response =>
                setCurrentOrgUnitBasedOnUrl({ id: response.id, name: response.displayName }),
            )
            .catch(() =>
                errorRetrievingOrgUnitBasedOnUrl(i18n.t('Could not get organisation unit')),
            ),
        );

export const mainSelectionsFromUrlEmptyOrgUnitEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(actionTypes.UPDATE_MAIN_SELECTIONS_FROM_URL)
        .filter(action => !action.payload.nextProps.orgUnitId)
        .map(() => setEmptyOrgUnitBasedOnUrl());

export const mainSelectionsFromUrlValidationEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(actionTypes.SET_EMPTY_ORG_UNIT_BASED_ON_URL, actionTypes.SET_ORG_UNIT_BASED_ON_URL)
        .map(() => {
            const { programId, orgUnitId } = store.getState().currentSelections;
            if (programId) {
                const program = programCollection.get(programId);
                if (!program) {
                    return invalidSelectionsFromUrl(i18n.t("Program doesn't exist"));
                }

                if (orgUnitId && !program.organisationUnits[orgUnitId]) {
                    return invalidSelectionsFromUrl(i18n.t('Selected program is invalid for registering unit'));
                }
            }

            return validSelectionsFromUrl();
        });
