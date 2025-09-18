import { ofType } from 'redux-observable';
import { catchError, concatMap, map, filter } from 'rxjs/operators';
import { from, EMPTY } from 'rxjs';
import i18n from '@dhis2/d2-i18n';

import {
    enrollmentPageActionTypes,
    resetEnrollmentId,
    fetchEnrollmentId,
    verifyEnrollmentIdSuccess,
    fetchEnrollmentIdSuccess,
    fetchEnrollmentIdError,
    fetchTei,
    verifyFetchTeiSuccess,
    fetchTeiSuccess,
    fetchTeiError,
    commitTrackerProgramId,
    commitNonTrackerProgramId,
    programIdError,
    fetchEnrollments,
    fetchEnrollmentsError,
    showErrorViewOnEnrollmentPage,
    clearErrorView,
} from '../EnrollmentPage.actions';
import { enrollmentAccessLevels, selectionStatus } from '../EnrollmentPage.constants';
import { buildUrlQueryString, getLocationQuery } from '../../../../utils/routing';
import { deriveTeiName } from '../../common/EnrollmentOverviewDomain/useTeiDisplayName';
import { getScopeInfo } from '../../../../metaData';
import { scopeTypes } from '../../../../metaData/helpers/constants';

const teiQuery = id => ({
    resource: 'tracker/trackedEntities',
    id,
    params: {
        fields: ['attributes', 'trackedEntityType', 'programOwners'],
    },
});

const enrollmentIdQuery = enrollmentId => ({
    resource: 'tracker/enrollments',
    id: enrollmentId,
    params: {
        fields: ['trackedEntity', 'program'],
    },
});

const programOwnersQuery = (teiId, programId) => ({
    resource: 'tracker/trackedEntities',
    id: teiId,
    params: {
        program: programId,
        fields: ['programOwners[program,orgUnit]'],
    },
});

const captureScopeQuery = orgUnitId => ({
    resource: 'organisationUnits',
    params: {
        query: orgUnitId,
        withinUserHierarchy: true,
        fields: 'id',
    },
});

const deselectTei = (navigate) => {
    const { programId, orgUnitId } = getLocationQuery();
    navigate(`/?${buildUrlQueryString({ programId, orgUnitId })}`);
    return false;
};

// Check fetch status
const enrollmentIdReady = (store: any): boolean => {
    const { fetchStatus } = store.value.enrollmentPage;
    return fetchStatus.enrollmentId === selectionStatus.READY;
};

const teiIdReady = (store: any): boolean => {
    const { teiId, fetchStatus } = store.value.enrollmentPage;
    return teiId && fetchStatus.teiId === selectionStatus.READY;
};

const programIdReady = (store: any): boolean => {
    const { fetchStatus } = store.value.enrollmentPage;
    return fetchStatus.programId === selectionStatus.READY;
};

const enrollmentIdLoaded = (enrollmentId: string, enrollments: Array<Record<string, unknown>> | null | undefined) =>
    enrollments &&
    enrollments.some((enrollment: any) => enrollment.enrollment === enrollmentId);


// The verification epics which are triggered by the completion of
// async requests (e.g. verifyEnrollmentIdSuccessEpic) are not subject
// to race conditions with other async requests because the chain of
// epics and reducers triggered by the completion is resolved
// synchronously before moving on to the next completed request.

// Note that the reason for doing the verification in a separate epic
// is to make sure we are using the most recent version of the redux
// store (but we might in fact have access to the most recent state
// using the old store object as well).

// Epics for enrollmentId
export const changedEnrollmentIdEpic = (action$: any, store: any) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.PROCESS_ENROLLMENT_ID),
        filter(({ payload: enrollmentId }) =>
            ((!enrollmentId || enrollmentId === 'AUTO') ?
                store.value.enrollmentPage.enrollmentId :
                !enrollmentIdLoaded(enrollmentId, store.value.enrollmentPage.enrollments))),
        map(({ payload: enrollmentId }) => {
            if (!enrollmentId || enrollmentId === 'AUTO') {
                const { programId, teiId } = getLocationQuery();
                return resetEnrollmentId({ programId, teiId });
            }
            return fetchEnrollmentId(enrollmentId);
        }),
    );

export const fetchEnrollmentIdEpic = (action$: any, store: any, { querySingleResource }: any) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.FETCH_ENROLLMENT_ID),
        concatMap(({ payload: { enrollmentId } }) =>
            querySingleResource(enrollmentIdQuery(enrollmentId))
                .then(result => verifyEnrollmentIdSuccess({ enrollmentId, ...result }))
                .catch(() => fetchEnrollmentIdError(enrollmentId))),
    );

export const verifyEnrollmentIdSuccessEpic = (action$: any, store: any) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.VERIFY_ENROLLMENT_ID_SUCCESS),
        filter(({ payload }) => payload.enrollmentId === store.value.enrollmentPage.enrollmentId),
        map(({ payload }) => fetchEnrollmentIdSuccess(payload)),
    );

export const enrollmentIdErrorEpic = (action$: any) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.FETCH_ENROLLMENT_ID_ERROR),
        map(({ payload: { enrollmentId } }) =>
            showErrorViewOnEnrollmentPage({
                error: i18n.t('Enrollment with id "{{enrollmentId}}" does not exist', { enrollmentId }),
            })),
    );

// Epics for teiId
export const changedTeiIdEpic = (action$: any, store: any) =>
    action$.pipe(
        ofType(
            enrollmentPageActionTypes.PROCESS_TEI_ID,
            enrollmentPageActionTypes.FETCH_ENROLLMENT_ID_SUCCESS,
            enrollmentPageActionTypes.RESET_ENROLLMENT_ID),
        filter(({ payload: { teiId } }) =>
            enrollmentIdReady(store) &&
            teiId && store.value.enrollmentPage.teiId !== teiId),
        map(({ payload }) => fetchTei(payload)),
    );

export const resetTeiIdEpic = (action$: any, store: any, { navigate }: any) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.RESET_TEI_ID),
        filter(() =>
            (({ fetchStatus }) =>
                fetchStatus.enrollmentId !== selectionStatus.LOADING &&
                fetchStatus.teiId !== selectionStatus.LOADING &&
                deselectTei(navigate)
            )(store.value.enrollmentPage)),
    );

export const fetchTeiIdEpic = (action$: any, store: any, { querySingleResource }: any) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.FETCH_TEI),
        concatMap(({ payload: { teiId, programId } }) => from(querySingleResource(teiQuery(teiId))
            .then(({ attributes, trackedEntityType, programOwners }) => {
                const teiDisplayName = deriveTeiName(attributes, trackedEntityType, teiId);
                return verifyFetchTeiSuccess({
                    teiDisplayName,
                    tetId: trackedEntityType,
                    teiId,
                    programId,
                    programOwners,
                });
            })
            .catch(() => fetchTeiError(teiId)))),
    );

export const verifyTeiFetchSuccessEpic = (action$: any, store: any) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.VERIFY_FETCH_TEI_SUCCESS),
        filter(() => enrollmentIdReady(store)),
        map(({ payload }) => fetchTeiSuccess(payload)),
    );

export const fetchTeiErrorEpic = (action$: any) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.FETCH_TEI_ERROR),
        map(({ payload: { teiId } }) => showErrorViewOnEnrollmentPage({
            error: i18n.t('Tracked entity instance with id "{{teiId}}" does not exist', { teiId }),
        })),
    );

// Epics for programId
export const changedProgramIdEpic = (action$: any, store: any) =>
    action$.pipe(
        ofType(
            enrollmentPageActionTypes.PROCESS_PROGRAM_ID,
            enrollmentPageActionTypes.FETCH_ENROLLMENT_ID_SUCCESS,
            enrollmentPageActionTypes.RESET_ENROLLMENT_ID),
        filter(({ payload: { programId } }) =>
            enrollmentIdReady(store) &&
            store.value.enrollmentPage.programId !== programId),
        map(({ payload: { programId } }) => {
            const { scopeType } = getScopeInfo(programId);
            if (scopeType === scopeTypes.TRACKER_PROGRAM) {
                return commitTrackerProgramId(programId);
            } else if (!programId || scopeType === scopeTypes.EVENT_PROGRAM) {
                return commitNonTrackerProgramId(programId);
            }
            return programIdError(programId);
        }),
    );

export const programIdErrorEpic = (action$: any) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.PROGRAM_ID_ERROR),
        map(({ payload: { programId } }) =>
            showErrorViewOnEnrollmentPage({
                error: i18n.t('Program with id "{{programId}}" does not exist', { programId }),
            })),
    );

// Epics for enrollments
export const teiOrProgramChangeEpic = (action$: any, store: any, { navigate }: any) =>
    action$.pipe(
        ofType(
            enrollmentPageActionTypes.FETCH_TEI_SUCCESS,
            enrollmentPageActionTypes.COMMIT_TRACKER_PROGRAM_ID,
            enrollmentPageActionTypes.COMMIT_NON_TRACKER_PROGRAM_ID),
        filter(() => store.value.enrollmentPage.pageOpen),
        map(() => {
            // Update url
            const { teiId, programId } = store.value.enrollmentPage;
            navigate(`/enrollment?${buildUrlQueryString({ ...getLocationQuery(), teiId, programId })}`);
            if (teiIdReady(store) && programIdReady(store)) {
                return fetchEnrollments();
            } else if (enrollmentIdReady(store) && teiIdReady(store)) {
                return fetchEnrollmentsError({ accessLevel: enrollmentAccessLevels.UNKNOWN_ACCESS });
            }

            return null;
        }),
        filter((action: any) => Boolean(action)),
    );

export const verifyFetchedEnrollmentsEpic = (action$: any, store: any) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.VERIFY_FETCHED_ENROLLMENTS),
        filter(() => enrollmentIdReady(store)),
        filter(({ payload: { teiId: fetchedTeiId, programId: fetchedProgramId } }) => {
            const { teiId, programId } = store.value.enrollmentPage;
            return fetchedTeiId === teiId && fetchedProgramId === programId;
        }),
        map(({ payload: { action } }) => action),
    );

// Auto-switch orgUnit epic
export const autoSwitchOrgUnitEpic = (action$: any, store: any, { querySingleResource, navigate }: any) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.FETCH_ENROLLMENTS),
        map(() => (({ teiId, programId }) => ({ teiId, programId }))(store.value.enrollmentPage)),
        concatMap(({ teiId, programId }) => from(querySingleResource(programOwnersQuery(teiId, programId)))
            .pipe(
                map(({ programOwners }: any) =>
                    programOwners.find((programOwner: any) => programOwner.program === programId)),
                filter(programOwner => programOwner),
                concatMap(programOwner => from(querySingleResource(captureScopeQuery(programOwner.orgUnit)))
                    .pipe(
                        concatMap(({ organisationUnits }: any) => {
                            if (organisationUnits.length > 0 && store.value.enrollmentPage.pageOpen) {
                                // Update orgUnitId in url
                                const { orgUnitId, ...restOfQueries } = getLocationQuery();
                                navigate(`/enrollment?${buildUrlQueryString({
                                    ...restOfQueries,
                                    orgUnitId: programOwner.orgUnit,
                                })}`);
                            }
                            return EMPTY;
                        }),
                        catchError(() => EMPTY),
                    )),
                catchError(() => EMPTY),
            )),
    );

// Manage error messages for unsuccessful data fetches.
export const clearErrorViewEpic = (action$: any, store: any) =>
    action$.pipe(
        ofType(
            enrollmentPageActionTypes.RESET_ENROLLMENT_ID,
            enrollmentPageActionTypes.FETCH_ENROLLMENT_ID,
            enrollmentPageActionTypes.FETCH_TEI,
            enrollmentPageActionTypes.COMMIT_TRACKER_PROGRAM_ID),
        filter(() => store.value.activePage.selectionsError),
        filter(() => {
            const fetchStatus = store.value.enrollmentPage.fetchStatus;
            return fetchStatus.enrollmentId !== selectionStatus.ERROR &&
                fetchStatus.programId !== selectionStatus.ERROR &&
                fetchStatus.teiId !== selectionStatus.ERROR;
        }),
        map(() => clearErrorView()),
    );
