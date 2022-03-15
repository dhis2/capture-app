// @flow

import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { config } from 'd2';
import { actionTypes as NavigateToEnrollmentOverviewActionTypes } from './navigateToEnrollmentOverview.actions';
import { buildUrlQueryString } from '../../utils/routing';
import { scopeHierarchyTypes } from './navigateToEnrollmentOverview.constants';

// TODO This will be removed when the link between capture and tracker capture is not relevant
const redirectToTracker = ({ teiId, orgUnitId, dependencies, store }) => {
    const { baseUrl } = config;
    const { search, pathname } = dependencies.history.location;
    const { programId: queryProgramId, trackedEntityTypeId: queryTrackedEntityTypeId } = store.value.router.location.query;

    const instanceBaseUrl = baseUrl.split('/api')[0];
    const scopeHierarchy = queryProgramId ? scopeHierarchyTypes.PROGRAM : scopeHierarchyTypes.TRACKED_ENTITY_TYPE;
    const selectedScopeId = queryTrackedEntityTypeId || queryProgramId;
    const scopeSearchParam = `${scopeHierarchy.toLowerCase()}=${selectedScopeId}`;
    const base64Url = btoa(`/dhis-web-capture/#${pathname}${search}`);
    setTimeout(() => {
        window.location.href = `${instanceBaseUrl}/dhis-web-tracker-capture/#/dashboard?tei=${teiId}&ou=${orgUnitId}&${scopeSearchParam}&returnUrl=${base64Url}`;
    }, 50);
};

const redirectToEnrollmentDashboard = ({ dependencies, teiId, programId, orgUnitId, enrollmentId }) => {
    dependencies.history.push(
        `/enrollment?${buildUrlQueryString({
            teiId,
            programId,
            orgUnitId,
            enrollmentId,
        })}`,
    );
};

export const navigateToEnrollmentOverviewEpic = (action$: InputObservable, store: ReduxStore, dependencies: any) =>
    action$.pipe(
        ofType(NavigateToEnrollmentOverviewActionTypes.NAVIGATE_TO_ENROLLMENT_OVERVIEW),
        switchMap((action) => {
            const { teiId, programId } = action.payload;
            const enrollmentId = programId && (action.payload?.enrollmentId || 'AUTO');
            const { dataStore, userDataStore } = store.value.useOldDashboard;
            const orgUnitId = action.payload.orgUnitId || store.value.workingListsListRecords?.teiList[teiId]?.programOwners[programId]?.ownerOrgUnit;

            if (dataStore || userDataStore) {
                if (userDataStore?.[programId]) {
                    redirectToTracker({ dependencies, store, teiId, orgUnitId });
                    return EMPTY;
                }

                if (userDataStore?.[programId] !== false && dataStore?.[programId]) {
                    redirectToTracker({ dependencies, store, teiId, orgUnitId });
                    return EMPTY;
                }
            }

            redirectToEnrollmentDashboard({ dependencies, teiId, programId, orgUnitId, enrollmentId });
            return EMPTY;
        }),
    );
