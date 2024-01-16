// @flow

import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { actionTypes as NavigateToEnrollmentOverviewActionTypes } from './navigateToEnrollmentOverview.actions';
import { buildUrlQueryString, getLocationQuery, shouldUseNewDashboard } from '../../utils/routing';
import { scopeHierarchyTypes } from './navigateToEnrollmentOverview.constants';

// TODO This will be removed when the link between capture and tracker capture is not relevant
const redirectToTracker = ({ teiId, orgUnitId, dependencies }) => {
    const baseUrl = dependencies.absoluteApiPath;
    const { search, pathname } = dependencies.history.location;
    const { programId: queryProgramId, trackedEntityTypeId: queryTrackedEntityTypeId } = getLocationQuery();

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
            const { teiId, programId, orgUnitId } = action.payload;
            const enrollmentId = programId && (action.payload?.enrollmentId || 'AUTO');
            const { dataStore, userDataStore } = store.value.useNewDashboard;

            if (dataStore || userDataStore) {
                const shouldRedirectToEnrollmentDashboard = shouldUseNewDashboard({
                    userDataStore,
                    dataStore,
                    programId,
                    teiId,
                });
                if (shouldRedirectToEnrollmentDashboard) {
                    redirectToEnrollmentDashboard({ dependencies, teiId, programId, orgUnitId, enrollmentId });
                    return EMPTY;
                }
            }

            redirectToTracker({ dependencies, store, teiId, orgUnitId });
            return EMPTY;
        }),
    );
