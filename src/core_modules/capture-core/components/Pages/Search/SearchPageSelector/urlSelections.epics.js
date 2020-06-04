// @flow
import i18n from '@dhis2/d2-i18n';
import {
    searchPageSelectorActonTypes,
    invalidSelectionsFromUrl,
    validSelectionsFromUrl,
    setCurrentOrgUnitBasedOnUrl,
    errorRetrievingOrgUnitBasedOnUrl,
    setEmptyOrgUnitBasedOnUrl,
} from './SearchPageSelector.actions';
import { programCollection } from '../../../../metaDataMemoryStores';
import { getApi } from '../../../../d2';



export const getOrgUnitDataForSearchUrlUpdateEpic = (action$: InputObservable) => {
    let l;
    return action$.ofType(searchPageSelectorActonTypes.UPDATE_SELECTIONS_FROM_URL)
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
};

export const selectionsFromUrlEmptyOrgUnitForSearchEpic = (action$: InputObservable) =>
    action$.ofType(searchPageSelectorActonTypes.UPDATE_SELECTIONS_FROM_URL)
        .filter(action => !action.payload.nextProps.orgUnitId)
        .map(() => setEmptyOrgUnitBasedOnUrl());

export const validationForSearchUrlUpdateEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        searchPageSelectorActonTypes.SET_ORG_UNIT_BASED_ON_URL,
        searchPageSelectorActonTypes.SET_EMPTY_ORG_UNIT_BASED_ON_URL)
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
