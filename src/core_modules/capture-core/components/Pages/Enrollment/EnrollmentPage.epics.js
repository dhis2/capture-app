// @flow
import { ofType } from 'redux-observable';
import { catchError, mergeMap, concatMap, map, filter, startWith } from 'rxjs/operators';
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
    commitProgramId,
    fetchEnrollments,
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

const enrollmentIdLoaded = (enrollmentId: string, enrollments: ?Array<Object>) =>
    enrollments && enrollments.some(enrollment => enrollment.enrollment === enrollmentId);

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
        mergeMap(({ payload: { enrollmentId } }) =>
            querySingleResource(enrollmentIdQuery(enrollmentId))
                .then(result => verifyEnrollmentIdSuccess({ enrollmentId, ...result }))
                .catch(error => fetchEnrollmentIdError(error))),
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
        map(({ error }) => showErrorViewOnEnrollmentPage({ error })),
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
        mergeMap(({ payload: { teiId, programId }}) => from(querySingleResource(teiQuery(teiId))
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

// Epics for programId / enrollments
export const changedProgramIdEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.PROCESS_PROGRAM_ID, enrollmentPageActionTypes.FETCH_ENROLLMENT_ID_SUCCESS),
        filter(({ payload: { programId } }) =>
            enrollmentIdReady(store) &&
            store.value.enrollmentPage.programId !== programId),
        map(({ payload }) => commitProgramId(payload)),
    );

export const teiOrProgramChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.FETCH_TEI_SUCCESS, enrollmentPageActionTypes.COMMIT_PROGRAM_ID),
        filter(({ payload: { teiId, programId } }) =>
            teiIdReady(store) &&
            store.value.enrollmentPage.programId),
        map(() => fetchEnrollments()),
    );

export const fetchEnrollmentsEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource, history }: ApiUtils) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.FETCH_ENROLLMENTS),
        mergeMap(() => {
            // Update url
            const { teiId, programId } = store.value.enrollmentPage;
            const { teiId: urlTeiId, programId: urlProgramId, ...restOfQueries } = getLocationQuery();
            history.push(`/enrollment?${buildUrlQueryString({ ...restOfQueries, teiId, programId })}`);

            //const { scopeType } = getScopeInfo(programId);
            // if (scopeType === scopeTypes.EVENT_PROGRAM) {
            //     return enrollmentPageStatuses.MISSING_SELECTIONS;
            // }

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
    );

// Auto-switch orgUnit epic
export const autoSwitchOrgUnitEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource, history }: ApiUtils) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.FETCH_ENROLLMENTS),
        map(() => (({ teiId, programId }) => ({ teiId, programId }))(store.value.enrollmentPage)),
        mergeMap(({ teiId, programId }) => from(querySingleResource(programOwnersQuery(teiId, programId)))
            .pipe(
                map(({ programOwners }) => programOwners.find(programOwner => programOwner.program === programId)),
                filter(programOwner => programOwner),
                mergeMap(programOwner => from(querySingleResource(captureScopeQuery(programOwner.orgUnit)))
                    .pipe(
                        mergeMap(({ organisationUnits }) => {
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
