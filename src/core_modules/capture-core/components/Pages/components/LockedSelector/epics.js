// @flow
import i18n from '@dhis2/d2-i18n';
import {
    lockedSelectorActionTypes,
    searchPageSelectorBatchActionTypes,
    invalidSelectionsFromUrl,
    validSelectionsFromUrl,
    setCurrentOrgUnitBasedOnUrl,
    errorRetrievingOrgUnitBasedOnUrl,
    setEmptyOrgUnitBasedOnUrl,
} from './actions';
import { programCollection } from '../../../../metaDataMemoryStores';
import { getApi } from '../../../../d2';
import { push } from 'connected-react-router';


const exactUrl = (page: string, programId: string, orgUnitId: string) => {
    const argArray = [];
    if (programId) {
        argArray.push(`programId=${programId}`);
    }
    if (orgUnitId) {
        argArray.push(`orgUnitId=${orgUnitId}`);
    }

    if (page && page !== 'viewEvent') {
        return `/${page}/${argArray.join('&')}`;
    }
    return `/${argArray.join('&')}`;
};

export const searchPageSelectorUpdateURLEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.ofType(
        lockedSelectorActionTypes.RESET_ORG_UNIT_ID,
        lockedSelectorActionTypes.SET_ORG_UNIT,
        lockedSelectorActionTypes.SET_PROGRAM_ID,
        lockedSelectorActionTypes.RESET_PROGRAM_ID,
        searchPageSelectorBatchActionTypes.START_AGAIN,
        searchPageSelectorBatchActionTypes.RESET_PROGRAM_AND_CATEGORY_OPTION,
    )
        .map(() => {
            const {
                currentSelections: { programId, orgUnitId },
                app: { page },
            } = store.getState();
            return push(exactUrl(page, programId, orgUnitId));
        });


export const getOrgUnitDataForSearchUrlUpdateEpic = (action$: InputObservable) =>
    action$.ofType(lockedSelectorActionTypes.UPDATE_SELECTIONS_FROM_URL)
        .filter(action => action.payload.nextProps.orgUnitId)
        .switchMap(action => getApi()
            .get(`organisationUnits/${action.payload.nextProps.orgUnitId}`)
            .then(response => setCurrentOrgUnitBasedOnUrl({
                id: response.id,
                name: response.displayName,
            }),
            )
            .catch(() =>
                errorRetrievingOrgUnitBasedOnUrl(i18n.t('Could not get organisation unit')),
            ),
        );

export const selectionsFromUrlEmptyOrgUnitForSearchEpic = (action$: InputObservable) =>
    action$.ofType(lockedSelectorActionTypes.UPDATE_SELECTIONS_FROM_URL)
        .filter(action => !action.payload.nextProps.orgUnitId)
        .map(() => setEmptyOrgUnitBasedOnUrl());

export const validationForSearchUrlUpdateEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        lockedSelectorActionTypes.SET_ORG_UNIT_BASED_ON_URL,
        lockedSelectorActionTypes.SET_EMPTY_ORG_UNIT_BASED_ON_URL)
        .map(() => {
            const { programId, orgUnitId } = store.getState().currentSelections;

            if (programId) {
                const program = programCollection.get(programId);
                if (!program) {
                    return invalidSelectionsFromUrl(i18n.t("Program doesn't exist"));
                }

                if (orgUnitId && !program.organisationUnits[orgUnitId]) {
                    return invalidSelectionsFromUrl(i18n.t('Selected program is invalid for selected registering unit'));
                }
            }

            return validSelectionsFromUrl();
        });
