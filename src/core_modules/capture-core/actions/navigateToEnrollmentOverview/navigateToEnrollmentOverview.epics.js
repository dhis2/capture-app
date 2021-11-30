// @flow

import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { config } from 'd2';
import {
    actionTypes as NavigateToEnrollmentOverviewActionTypes,
} from './navigateToEnrollmentOverview.actions';
import { buildUrlQueryString, deriveURLParamsFromLocation } from '../../utils/routing';
import { scopeHierarchyTypes } from './navigateToEnrollmentOverview.constants';
import { getLocationPathname, getLocationSearch } from '../../utils/url';

export const navigateToEnrollmentOverviewEpic = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) => action$.pipe(
    ofType(
        NavigateToEnrollmentOverviewActionTypes.NAVIGATE_TO_ENROLLMENT_OVERVIEW,
    ),
    switchMap((action) => {
        const { teiId, programId, orgUnitId, enrollmentId = 'AUTO' } = action.payload;
        const { dataStore, userDataStore } = store.value.useNewDashboard;

        const pushHistoryToEnrollmentDashboard = () => {
            history.push(`/enrollment?${buildUrlQueryString({
                teiId,
                programId,
                orgUnitId,
                enrollmentId,
            })}`);
        };

        if (dataStore || userDataStore) {
            if (userDataStore?.[programId]) {
                pushHistoryToEnrollmentDashboard();
                return EMPTY;
            }

            if (userDataStore?.[programId] !== false && dataStore?.[programId]) {
                pushHistoryToEnrollmentDashboard();
                return EMPTY;
            }
        }

        // TODO This will be removed when the link between capture and tracker capture is not relevant
        const { baseUrl } = config;
        const pathname = getLocationPathname();
        const search = getLocationSearch();
        const {
            programId: queryProgramId,
            trackedEntityTypeId: queryTrackedEntityTypeId,
        } = deriveURLParamsFromLocation();

        const instanceBaseUrl = baseUrl.split('/api')[0];
        const scopeHierarchy = queryProgramId ? scopeHierarchyTypes.PROGRAM : scopeHierarchyTypes.TRACKED_ENTITY_TYPE;
        const selectedScopeId = queryTrackedEntityTypeId || queryProgramId;
        const scopeSearchParam = `${scopeHierarchy.toLowerCase()}=${selectedScopeId}`;
        const base64Url = btoa(`/dhis-web-capture/#${pathname}${search}`);
        let ownerOrgUnitId;
        !orgUnitId && (
            ownerOrgUnitId = store.value.workingListsListRecords?.teiList[teiId]?.programOwners[programId]?.ownerOrgUnit
        );

        setTimeout(() => {
            window.location.href = `${instanceBaseUrl}/dhis-web-tracker-capture/#/dashboard?tei=${teiId}&ou=${orgUnitId || ownerOrgUnitId}&${scopeSearchParam}&returnUrl=${base64Url}`;
        }, 50);

        return EMPTY;
    }),
);
