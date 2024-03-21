// @flow
import i18n from '@dhis2/d2-i18n';
import { ofType } from 'redux-observable';
import { filter, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
    lockedSelectorActionTypes,
    invalidSelectionsFromUrl,
    validSelectionsFromUrl,
    setCurrentOrgUnitBasedOnUrl,
    errorRetrievingOrgUnitBasedOnUrl,
    setEmptyOrgUnitBasedOnUrl,
    startLoading,
    completeUrlUpdate,
} from './LockedSelector.actions';
import { programCollection } from '../../metaDataMemoryStores';
import { getLocationPathname, pageFetchesOrgUnitUsingTheOldWay } from '../../utils/url';
import { getLocationQuery } from '../../utils/routing';
import { getCoreOrgUnit } from '../../metadataRetrieval/coreOrgUnit';

export const getOrgUnitDataBasedOnUrlUpdateEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.FROM_URL_UPDATE),
        filter(action => action.payload.nextProps.orgUnitId),
        concatMap((action) => {
            const { organisationUnits } = store.value;
            const { orgUnitId } = action.payload.nextProps;
            if (organisationUnits[orgUnitId]) {
                return of(completeUrlUpdate());
            }
            return of(startLoading(), getCoreOrgUnit({
                orgUnitId,
                onSuccess: setCurrentOrgUnitBasedOnUrl,
                onError: () => errorRetrievingOrgUnitBasedOnUrl(i18n.t('Could not get organisation unit')),
            }));
        }),
    );

export const setOrgUnitDataEmptyBasedOnUrlUpdateEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.FROM_URL_UPDATE),
        filter(action => !action.payload.nextProps.orgUnitId),
        map(() => setEmptyOrgUnitBasedOnUrl()));

export const validateSelectionsBasedOnUrlUpdateEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(
            lockedSelectorActionTypes.FROM_URL_UPDATE_COMPLETE,
            lockedSelectorActionTypes.FETCH_ORG_UNIT_SUCCESS,
            lockedSelectorActionTypes.EMPTY_ORG_UNIT_SET,
        ),
        filter(() => {
            const pathname = getLocationPathname();
            return pageFetchesOrgUnitUsingTheOldWay(pathname.substring(1));
        }),
        map(() => {
            const { programId, orgUnitId } = getLocationQuery();

            if (programId) {
                const program = programCollection.get(programId);
                if (!program) {
                    return invalidSelectionsFromUrl(i18n.t("Program doesn't exist"));
                }

                if (orgUnitId && !program.organisationUnits[orgUnitId]) {
                    return invalidSelectionsFromUrl(i18n.t('Selected program is invalid for selected organisation unit'));
                }
            }

            return validSelectionsFromUrl();
        }));
