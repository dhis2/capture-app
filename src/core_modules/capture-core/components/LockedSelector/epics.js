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
import { programCollection } from '../../metaDataMemoryStores';
import { getApi } from '../../d2';
import { push } from 'connected-react-router';


const exactUrl = (page: string, programId: string, orgUnitId: string) => {
    const argArray = [];
    if (programId) {
        argArray.push(`programId=${programId}`);
    }
    if (orgUnitId) {
        argArray.push(`orgUnitId=${orgUnitId}`);
    }

    return argArray.join('&');
};

export const searchPageSelectorUpdateURLEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.ofType(
        lockedSelectorActionTypes.ORG_UNIT_ID_RESET,
        lockedSelectorActionTypes.ORG_UNIT_ID_SET,
        lockedSelectorActionTypes.PROGRAM_ID_SET,
        lockedSelectorActionTypes.PROGRAM_ID_RESET,
        searchPageSelectorBatchActionTypes.AGAIN_START,
        searchPageSelectorBatchActionTypes.PROGRAM_AND_CATEGORY_OPTION_RESET,
    )
        .map(() => {
            const {
                currentSelections: { programId, orgUnitId },
                app: { page },
            } = store.getState();
            return push(exactUrl(page, programId, orgUnitId));
        });


export const getOrgUnitDataForSearchUrlUpdateEpic = (action$: InputObservable) =>
    action$.ofType(lockedSelectorActionTypes.SELECTIONS_FROM_URL_UPDATE)
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
    action$.ofType(lockedSelectorActionTypes.SELECTIONS_FROM_URL_UPDATE)
        .filter(action => !action.payload.nextProps.orgUnitId)
        .map(() => setEmptyOrgUnitBasedOnUrl());

export const validationForSearchUrlUpdateEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.ofType(
        lockedSelectorActionTypes.BASED_ON_URL_ORG_UNIT_SET,
        lockedSelectorActionTypes.BASED_ON_URL_ORG_UNIT_EMPTY_SET)
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
