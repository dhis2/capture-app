// @flow
import i18n from '@dhis2/d2-i18n';
import { push } from 'connected-react-router';
import {
    lockedSelectorActionTypes,
    lockedSelectorBatchActionTypes,
    invalidSelectionsFromUrl,
    validSelectionsFromUrl,
    setCurrentOrgUnitBasedOnUrl,
    errorRetrievingOrgUnitBasedOnUrl,
    setEmptyOrgUnitBasedOnUrl,
    stopPageLoading,
} from './LockedSelector.actions';
import { programCollection } from '../../metaDataMemoryStores';
import { getApi } from '../../d2';
import { of } from 'rxjs/observable/of';

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

export const updateUrlViaLockedSelectorEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.ofType(
        lockedSelectorActionTypes.ORG_UNIT_ID_RESET,
        lockedSelectorActionTypes.ORG_UNIT_ID_SET,
        lockedSelectorActionTypes.PROGRAM_ID_SET,
        lockedSelectorActionTypes.PROGRAM_ID_RESET,
        lockedSelectorBatchActionTypes.AGAIN_START,
        lockedSelectorBatchActionTypes.PROGRAM_AND_CATEGORY_OPTION_RESET,
    )
        .map(() => {
            const {
                currentSelections: { programId, orgUnitId },
                app: { page },
            } = store.getState();
            return push(exactUrl(page, programId, orgUnitId));
        });


export const getOrgUnitDataBasedOnUrlUpdateEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.ofType(lockedSelectorActionTypes.SELECTIONS_FROM_URL_UPDATE)
        .switchMap(({ payload: { nextProps: { orgUnitId: nextOrgUnitId } } }) => {
            const { organisationUnits, currentSelections: { orgUnitId: currentOrgUnitId } } = store.getState();

            const isOrgUnitAlreadyStored = organisationUnits[nextOrgUnitId];
            // when an action of the user is changing the url but we have already stored the
            // organisation unit in memory we dont want to fetch again.
            // eg. when you are in viewEvent/{eventId} and you deselect the program
            if (isOrgUnitAlreadyStored && currentOrgUnitId === nextOrgUnitId) {
                return of(stopPageLoading());
            }

            return getApi()
                .get(`organisationUnits/${nextOrgUnitId}`)
                .then(response => setCurrentOrgUnitBasedOnUrl({
                    id: response.id,
                    name: response.displayName,
                }),
                )
                .catch(() =>
                    errorRetrievingOrgUnitBasedOnUrl(i18n.t('Could not get organisation unit')),
                );
        });

export const setOrgUnitDataEmptyBasedOnUrlUpdateEpic = (action$: InputObservable) =>
    action$.ofType(lockedSelectorActionTypes.SELECTIONS_FROM_URL_UPDATE)
        .filter(action => !action.payload.nextProps.orgUnitId)
        .map(() => setEmptyOrgUnitBasedOnUrl());

export const validateSelectionsBasedOnUrlUpdateEpic = (action$: InputObservable, store: ReduxStore) =>
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
