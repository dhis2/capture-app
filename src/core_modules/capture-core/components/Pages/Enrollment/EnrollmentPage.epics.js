// @flow
import { ofType } from 'redux-observable';
import { catchError, concatMap, map, filter } from 'rxjs/operators';
import { from, of, EMPTY } from 'rxjs';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
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
    verifyFetchedEnrollments,
    saveEnrollments,
    fetchEnrollmentsError,
    showErrorViewOnEnrollmentPage,
    clearErrorView,
} from './EnrollmentPage.actions';
import { enrollmentAccessLevels, serverErrorMessages, selectionStatus } from './EnrollmentPage.constants';
import { buildUrlQueryString, getLocationQuery } from '../../../utils/routing';
import { deriveTeiName } from '../common/EnrollmentOverviewDomain/useTeiDisplayName';
import { getScopeInfo } from '../../../metaData';
import { scopeTypes } from '../../../metaData/helpers/constants';

const sortByDate = (enrollments = []) => enrollments.sort((a, b) =>
    moment.utc(b.enrolledAt).diff(moment.utc(a.enrolledAt)));

const teiQuery = id => ({
    resource: 'tracker/trackedEntities',
    id,
    params: {
        fields: ['attributes', 'trackedEntityType'],
    },
});

const enrollmentIdQuery = enrollmentId => ({
    resource: 'tracker/enrollments',
    id: enrollmentId,
    params: {
        fields: ['trackedEntity', 'program'],
    },
});

const enrollmentsQuery = (teiId, programId) => ({
    resource: 'tracker/trackedEntities',
    id: teiId,
    params: {
        program: programId,
        fields: ['enrollments'],
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

const deselectTei = (history) => {
    const { programId, orgUnitId } = getLocationQuery();
    history.push(`/?${buildUrlQueryString({ programId, orgUnitId })}`);
    return false;
};

// Check fetch status
const enrollmentIdReady = (store: ReduxStore): boolean => {
    const { fetchStatus } = store.value.enrollmentPage;
    return fetchStatus.enrollmentId === selectionStatus.READY;
};

const teiIdReady = (store: ReduxStore): boolean => {
    const { teiId, fetchStatus } = store.value.enrollmentPage;
    return teiId && fetchStatus.teiId === selectionStatus.READY;
};

const programIdReady = (store: ReduxStore): boolean => {
    const { fetchStatus } = store.value.enrollmentPage;
    return fetchStatus.programId === selectionStatus.READY;
};

const enrollmentIdLoaded = (enrollmentId: string, enrollments: ?Array<Object>) =>
    enrollments && enrollments.some(enrollment => enrollment.enrollment === enrollmentId);


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
export const changedEnrollmentIdEpic = (action$: InputObservable, store: ReduxStore) =>
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

export const fetchEnrollmentIdEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.FETCH_ENROLLMENT_ID),
        concatMap(({ payload: { enrollmentId } }) =>
            querySingleResource(enrollmentIdQuery(enrollmentId))
                .then(result => verifyEnrollmentIdSuccess({ enrollmentId, ...result }))
                .catch(() => fetchEnrollmentIdError(enrollmentId))),
    );

export const verifyEnrollmentIdSuccessEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.VERIFY_ENROLLMENT_ID_SUCCESS),
        filter(({ payload }) => payload.enrollmentId === store.value.enrollmentPage.enrollmentId),
        map(({ payload }) => fetchEnrollmentIdSuccess(payload)),
    );

export const enrollmentIdErrorEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.FETCH_ENROLLMENT_ID_ERROR),
        map(({ payload: { enrollmentId } }) =>
            showErrorViewOnEnrollmentPage({ error: i18n.t('Enrollment with id "{{enrollmentId}}" does not exist', { enrollmentId }) })),
    );

// Epics for teiId
export const changedTeiIdEpic = (action$: InputObservable, store: ReduxStore) =>
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

export const resetTeiIdEpic = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.RESET_TEI_ID),
        filter(() =>
            (({ fetchStatus }) =>
                fetchStatus.enrollmentId !== selectionStatus.LOADING &&
                fetchStatus.teiId !== selectionStatus.LOADING &&
                deselectTei(history)
            )(store.value.enrollmentPage)),
    );

export const fetchTeiIdEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.FETCH_TEI),
        concatMap(({ payload: { teiId, programId } }) => from(querySingleResource(teiQuery(teiId))
            .then(({ attributes, trackedEntityType }) => {
                const teiDisplayName = deriveTeiName(attributes, trackedEntityType, teiId);
                return verifyFetchTeiSuccess({
                    teiDisplayName,
                    tetId: trackedEntityType,
                    teiId,
                    programId,
                });
            })
            .catch(() => fetchTeiError(teiId)))),
    );

export const verifyTeiFetchSuccessEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.VERIFY_FETCH_TEI_SUCCESS),
        filter(() => enrollmentIdReady(store)),
        map(({ payload }) => fetchTeiSuccess(payload)),
    );

export const fetchTeiErrorEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.FETCH_TEI_ERROR),
        map(({ payload: { teiId } }) => showErrorViewOnEnrollmentPage({ error: i18n.t('Tracked entity instance with id "{{teiId}}" does not exist', { teiId }) })),
    );

// Epics for programId
export const changedProgramIdEpic = (action$: InputObservable, store: ReduxStore) =>
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

export const programIdErrorEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.PROGRAM_ID_ERROR),
        map(({ payload: { programId } }) =>
            showErrorViewOnEnrollmentPage({ error: i18n.t('Program with id "{{programId}}" does not exist', { programId }) })),
    );

// Epics for enrollments
export const teiOrProgramChangeEpic = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(
            enrollmentPageActionTypes.FETCH_TEI_SUCCESS,
            enrollmentPageActionTypes.COMMIT_TRACKER_PROGRAM_ID,
            enrollmentPageActionTypes.COMMIT_NON_TRACKER_PROGRAM_ID),
        filter(() => store.value.enrollmentPage.pageOpen),
        map(() => {
            // Update url
            const { teiId, programId } = store.value.enrollmentPage;
            history.push(`/enrollment?${buildUrlQueryString({ ...getLocationQuery(), teiId, programId })}`);

            if (teiIdReady(store) && programIdReady(store)) {
                return fetchEnrollments();
            } else if (enrollmentIdReady(store) && teiIdReady(store)) {
                return fetchEnrollmentsError({ accessLevel: enrollmentAccessLevels.UNKNOWN_ACCESS });
            }

            return null;
        }),
        filter(action => action),
    );

export const fetchEnrollmentsEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.FETCH_ENROLLMENTS),
        concatMap(() => {
            const { teiId, programId } = store.value.enrollmentPage;
            return from(querySingleResource(enrollmentsQuery(teiId, programId)))
                .pipe(
                    map(({ enrollments }) => {
                        const enrollmentsSortedByDate = sortByDate(enrollments
                            .filter(enrollment => enrollment.program === programId));
                        return saveEnrollments({ enrollments: enrollmentsSortedByDate });
                    }),
                    catchError((error) => {
                        if (error.message) {
                            if (error.message.includes(serverErrorMessages.OWNERSHIP_ACCESS_PARTIALLY_DENIED)) {
                                return of(fetchEnrollmentsError({ accessLevel: enrollmentAccessLevels.LIMITED_ACCESS }));
                            } else if (error.message.includes(serverErrorMessages.OWNERSHIP_ACCESS_DENIED)) {
                                return of(fetchEnrollmentsError({ accessLevel: enrollmentAccessLevels.LIMITED_ACCESS }));
                            } else if (error.message.includes(serverErrorMessages.PROGRAM_ACCESS_CLOSED)) {
                                return of(fetchEnrollmentsError({ accessLevel: enrollmentAccessLevels.NO_ACCESS }));
                            } else if (error.message.includes(serverErrorMessages.ORGUNIT_OUT_OF_SCOPE)) {
                                return of(fetchEnrollmentsError({ accessLevel: enrollmentAccessLevels.NO_ACCESS }));
                            }
                        }
                        const errorMessage = i18n.t('An error occurred while fetching enrollments. Please enter a valid url.');
                        return of(showErrorViewOnEnrollmentPage({ error: errorMessage }));
                    }),
                    map(action => verifyFetchedEnrollments({ teiId, programId, action })),
                );
        }),
    );

export const verifyFetchedEnrollmentsEpic = (action$: InputObservable, store: ReduxStore) =>
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
export const autoSwitchOrgUnitEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource, history }: ApiUtils) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.FETCH_ENROLLMENTS),
        map(() => (({ teiId, programId }) => ({ teiId, programId }))(store.value.enrollmentPage)),
        concatMap(({ teiId, programId }) => from(querySingleResource(programOwnersQuery(teiId, programId)))
            .pipe(
                map(({ programOwners }) => programOwners.find(programOwner => programOwner.program === programId)),
                filter(programOwner => programOwner),
                concatMap(programOwner => from(querySingleResource(captureScopeQuery(programOwner.orgUnit)))
                    .pipe(
                        concatMap(({ organisationUnits }) => {
                            if (organisationUnits.length > 0 && store.value.enrollmentPage.pageOpen) {
                                // Update orgUnitId in url
                                const { orgUnitId, ...restOfQueries } = getLocationQuery();
                                history.push(`/enrollment?${buildUrlQueryString({ ...restOfQueries, orgUnitId: programOwner.orgUnit })}`);
                            }
                            return EMPTY;
                        }),
                        catchError(() => EMPTY),
                    )),
                catchError(() => EMPTY),
            )),
    );

// Manage error messages for unsuccessful data fetches.
export const clearErrorViewEpic = (action$: InputObservable, store: ReduxStore) =>
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
