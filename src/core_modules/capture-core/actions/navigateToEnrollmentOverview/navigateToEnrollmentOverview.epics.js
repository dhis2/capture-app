// @flow

import { switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { ofType } from 'redux-observable';
import { config } from 'd2';
import { buildUrlQueryString } from '../../utils/routing';
import { scopeHierarchyTypes } from './navigateToEnrollmentOverview.constants';
import {
    actionTypes as NavigateToEnrollmentOverviewActionTypes,
} from './navigateToEnrollmentOverview.actions';

export const navigateToEnrollmentOverviewEpic = (action$: InputObservable, store: ReduxStore, dependencies: any) => action$.pipe(
    ofType(
        NavigateToEnrollmentOverviewActionTypes.NAVIGATE_TO_ENROLLMENT_OVERVIEW,
    ),
    switchMap((action) => {
        const { teiId, programId, orgUnitId, enrollmentId = 'AUTO' } = action.payload;
        const { dataStore, userDataStore } = store.value.useNewDashboard;

        const pushHistoryToEnrollmentDashboard = () => {
            dependencies.history.push(`/enrollment?${buildUrlQueryString({
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
        const { search, pathname } = dependencies.history.location;
        const {
            programId: queryProgramId,
            trackedEntityTypeId: queryTrackedEntityTypeId,
        } = store.value.router.location.query;

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
