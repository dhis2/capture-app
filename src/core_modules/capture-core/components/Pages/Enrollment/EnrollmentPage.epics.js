// @flow
import { ofType } from 'redux-observable';
import { catchError, flatMap, map, startWith } from 'rxjs/operators';
import i18n from '@dhis2/d2-i18n';
import { from, of } from 'rxjs';
import moment from 'moment';
import {
    enrollmentPageActionTypes,
    showErrorViewOnEnrollmentPage,
    showLoadingViewOnEnrollmentPage,
    successfulFetchingEnrollmentPageInformationFromUrl,
    updateEnrollmentAccessLevel,
    saveEnrollments,
    openEnrollmentPage,
    startFetchingTeiFromEnrollmentId,
    startFetchingTeiFromTeiId,
} from './EnrollmentPage.actions';
import { enrollmentAccessLevels } from './EnrollmentPage.constants';
import { buildUrlQueryString, getLocationQuery } from '../../../utils/routing';
import { deriveTeiName } from '../common/EnrollmentOverviewDomain/useTeiDisplayName';
import { serverErrorMessages } from '../../../constants';

const sortByDate = (enrollments = []) => enrollments.sort((a, b) =>
    moment.utc(b.enrolledAt).diff(moment.utc(a.enrolledAt)));

const teiQuery = id => ({
    resource: 'tracker/trackedEntities',
    id,
    params: {
        fields: ['attributes', 'trackedEntityType'],
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

const fetchTeiStream = (teiId, querySingleResource) =>
    from(querySingleResource(teiQuery(teiId)))
        .pipe(
            map(({ attributes, trackedEntityType }) => {
                const teiDisplayName = deriveTeiName(attributes, trackedEntityType, teiId);

                return successfulFetchingEnrollmentPageInformationFromUrl({
                    teiDisplayName,
                    tetId: trackedEntityType,
                });
            }),
            catchError(() => {
                const error = i18n.t('Tracked entity instance with id "{{teiId}}" does not exist', { teiId });
                return of(showErrorViewOnEnrollmentPage({ error }));
            }),
        );

export const fetchEnrollmentPageInformationFromUrlEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.INFORMATION_FETCH),
        map(() => {
            const { enrollmentId, teiId } = getLocationQuery();
            if (enrollmentId) {
                return startFetchingTeiFromEnrollmentId();
            } else if (teiId) {
                return startFetchingTeiFromTeiId();
            }
            const error = i18n.t('There is an error while opening this enrollment. Please enter a valid url.');
            return showErrorViewOnEnrollmentPage({ error });
        }),
    );

export const startFetchingTeiFromEnrollmentIdEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.INFORMATION_USING_ENROLLMENT_ID_FETCH),
        flatMap(() => {
            const { enrollmentId, programId, orgUnitId, teiId } = getLocationQuery();
            if (enrollmentId === 'AUTO') {
                return of(openEnrollmentPage({
                    programId,
                    orgUnitId,
                    teiId,
                    enrollmentId,
                }));
            }
            return from(querySingleResource({ resource: 'tracker/enrollments', id: enrollmentId }))
                .pipe(
                    map(({ trackedEntity, program, orgUnit }) =>
                        openEnrollmentPage({
                            programId: program,
                            orgUnitId: orgUnit,
                            teiId: trackedEntity,
                            enrollmentId,
                        })),
                    catchError(() => {
                        const error = i18n.t('Enrollment with id "{{enrollmentId}}" does not exist', { enrollmentId });
                        return of(showErrorViewOnEnrollmentPage({ error }));
                    }),
                    startWith(showLoadingViewOnEnrollmentPage()),
                );
        }),
    );

export const startFetchingTeiFromTeiIdEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.INFORMATION_USING_TEI_ID_FETCH),
        flatMap(() => {
            const { teiId } = getLocationQuery();

            return fetchTeiStream(teiId, querySingleResource);
        }),
    );

export const fetchEnrollmentsEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.ENROLLMENTS_FETCH, enrollmentPageActionTypes.INFORMATION_SUCCESS_FETCH),
        flatMap(() => {
            const { teiId, programId } = getLocationQuery();

            if (!programId) {
                return of(updateEnrollmentAccessLevel({ accessLevel: enrollmentAccessLevels.UNKNOWN_ACCESS }));
            }

            return from(querySingleResource(enrollmentsQuery(teiId, programId)))
                .pipe(
                    map(({ enrollments }) => {
                        const enrollmentsSortedByDate = sortByDate(enrollments
                            .filter(enrollment => enrollment.program === programId));
                        return saveEnrollments({ enrollments: enrollmentsSortedByDate });
                    }),
                    catchError((error) => {
                        if (error.message) {
                            if (error.message === serverErrorMessages.OWNERSHIP_ACCESS_PARTIALLY_DENIED) {
                                return of(updateEnrollmentAccessLevel({ accessLevel: enrollmentAccessLevels.LIMITED_ACCESS }));
                            } else if (error.message === serverErrorMessages.OWNERSHIP_ACCESS_DENIED) {
                                return of(updateEnrollmentAccessLevel({ accessLevel: enrollmentAccessLevels.LIMITED_ACCESS })); // Todo: Change to NO_ACCESS
                            } else if (error.message === serverErrorMessages.PROGRAM_ACCESS_CLOSED) {
                                return of(updateEnrollmentAccessLevel({ accessLevel: enrollmentAccessLevels.NO_ACCESS }));
                            } else if (error.message.startsWith(serverErrorMessages.ORGUNIT_OUT_OF_SCOPE)) {
                                return of(updateEnrollmentAccessLevel({ accessLevel: enrollmentAccessLevels.NO_ACCESS }));
                            }
                        }
                        const errorMessage = i18n.t('An error occurred while fetching enrollments. Please enter a valid url.');
                        return of(showErrorViewOnEnrollmentPage({ error: errorMessage }));
                    }),
                );
        }),
    );

export const openEnrollmentPageEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource, history }: ApiUtils) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.PAGE_OPEN),
        flatMap(({ payload: { enrollmentId, programId, orgUnitId, teiId } }) => {
            const {
                enrollmentId: queryEnrollment,
                orgUnitId: queryOrgUnitId,
                programId: queryProgramId,
                teiId: queryTeiId,
            } = getLocationQuery();
            const urlCompleted = Boolean(queryEnrollment && queryOrgUnitId && queryProgramId && queryTeiId);

            if (!urlCompleted) {
                history.push(`/enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId, enrollmentId })}`);
                return fetchTeiStream(teiId, querySingleResource);
            }
            return fetchTeiStream(teiId, querySingleResource);
        },
        ),
    );
