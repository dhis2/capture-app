// @flow
import { ofType } from 'redux-observable';
import { catchError, concatMap, map, filter, startWith } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import i18n from '@dhis2/d2-i18n';
import { from, of } from 'rxjs';
import moment from 'moment';
import {
    enrollmentPageActionTypes,
    showErrorViewOnEnrollmentPage,
    showLoadingViewOnEnrollmentPage,
    successfulFetchingEnrollmentPageInformationFromUrl,
    fetchEnrollmentsError,
    saveEnrollments,
    openEnrollmentPage,
    startFetchingTeiFromEnrollmentId,
    startFetchingTeiFromTeiId,
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
} from './EnrollmentPage.actions';
import { enrollmentAccessLevels, serverErrorMessages, selectionStatus } from './EnrollmentPage.constants';
import { buildUrlQueryString, getLocationQuery } from '../../../utils/routing';
import { deriveTeiName } from '../common/EnrollmentOverviewDomain/useTeiDisplayName';
import { getScopeInfo } from '../../../metaData';
import { scopeTypes } from '../../../metaData/helpers/constants';
import { actionCreator } from '../../../actions/actions.utils';

const sortByDate = (enrollments = []) => enrollments.sort((a, b) =>
    moment.utc(b.enrolledAt).diff(moment.utc(a.enrolledAt)));

const teiQuery = id => ({
    resource: 'tracker/trackedEntities',
    id,
    params: {
        fields: ['attributes', 'trackedEntityType'],
    },
});

const  enrollmentIdQuery = enrollmentId => ({
    resource: 'tracker/enrollments',
    id: enrollmentId,
    params: {
        fields: ['trackedEntity', 'program'],
    }
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

// Check fetch status
const enrollmentIdReady = (store: ReduxStore): boolean => {
    const {  fetchStatus } = store.value.enrollmentPage;
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

// Epics for enrollmentId
export const changedEnrollmentIdEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.PROCESS_ENROLLMENT_ID),
        filter(({ payload: { enrollmentId } }) =>
            enrollmentId &&
            enrollmentId !== 'AUTO' &&
            !enrollmentIdLoaded(enrollmentId, store.value.enrollmentPage.enrollments)),
        map(({ payload: { enrollmentId } }) => fetchEnrollmentId(enrollmentId)),
    );

export const fetchEnrollmentIdEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.FETCH_ENROLLMENT_ID),
        concatMap(({ payload: { enrollmentId } }) =>
            querySingleResource(enrollmentIdQuery(enrollmentId))
                .then(result => verifyEnrollmentIdSuccess({ enrollmentId, ...result }))
                .catch(error => fetchEnrollmentIdError(enrollmentId))),
        startWith(showLoadingViewOnEnrollmentPage()),
    );

export const verifyEnrollmentIdSuccessEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.VERIFY_ENROLLMENT_ID_SUCCESS),
        filter(({ payload }) => payload.enrollmentId === store.value.enrollmentPage.enrollmentId),
        map(({ payload }) => fetchEnrollmentIdSuccess(payload)),
    );

export const enrollmentIdErrorEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource, history }: ApiUtils) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.FETCH_ENROLLMENT_ID_ERROR),
        map(({ payload: { enrollmentId } }) => showErrorViewOnEnrollmentPage({
            error: i18n.t('Invalid enrollment id {{enrollmentId}}.', {
                enrollmentId,
                interpolation: { escapeValue: false },
            })})),
    );

// Epics for teiId
export const changedTeiIdEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.PROCESS_TEI_ID, enrollmentPageActionTypes.FETCH_ENROLLMENT_ID_SUCCESS),
        filter(({ payload: { teiId } }) =>
            enrollmentIdReady(store) &&
            teiId && store.value.enrollmentPage.teiId !== teiId),
        map(({ payload }) => fetchTei(payload)),
    );

export const fetchTeiIdEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.FETCH_TEI),
        concatMap(({ payload: { teiId, programId }}) => from(querySingleResource(teiQuery(teiId))
            .then(({ attributes, trackedEntityType }) => {
                const teiDisplayName = deriveTeiName(attributes, trackedEntityType, teiId);
                return verifyFetchTeiSuccess({
                    teiDisplayName,
                    tetId: trackedEntityType,
                    teiId,
                    programId,
                });
            })
            .catch(() => { return fetchTeiError(teiId) }))),
    );

export const verifyTeiFetchSuccessEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
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
        ofType(enrollmentPageActionTypes.PROCESS_PROGRAM_ID, enrollmentPageActionTypes.FETCH_ENROLLMENT_ID_SUCCESS),
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

export const programIdErrorEpic = (action$: InputObservable, store: ReduxStore) =>
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

export const fetchEnrollmentsEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource, history }: ApiUtils) =>
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
                );
        }),
        map(action => {
            const { teiId, programId } = store.value.enrollmentPage;
            return verifyFetchedEnrollments({ teiId, programId, action });
        }),
    );

export const verifyFetchedEnrollmentsEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.VERIFY_FETCHED_ENROLLMENTS),
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
                            if (organisationUnits.length > 0) {
                                // Update orgUnitId in url
                                const { orgUnitId, ...restOfQueries } = getLocationQuery();
                                history.push(`/enrollment?${buildUrlQueryString({ ...restOfQueries, orgUnitId: programOwner.orgUnit })}`);
                            }
                            return EMPTY;
                        }),
                    )),
        )),
    );
