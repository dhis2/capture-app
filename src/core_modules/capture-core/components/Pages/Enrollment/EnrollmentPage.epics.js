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
import { enrollmentAccessLevels, serverErrorMessages } from './EnrollmentPage.constants';
import { buildUrlQueryString, getLocationQuery } from '../../../utils/routing';
import { deriveTeiName } from '../common/EnrollmentOverviewDomain/useTeiDisplayName';

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

const captureScopeQuery = () => ({
    resource: 'organisationUnits',
    params: {
        paging: false,
        userOnly: true,
        fields: 'id',
    },
});

const ancestorsQuery = orgUnitId => ({
    resource: 'organisationUnits',
    id: orgUnitId,
    params: {
        fields: 'ancestors',
    },
});

const inCaptureScope = (querySingleResource, orgUnitId) =>
    Promise.all([
        querySingleResource(captureScopeQuery()),
        querySingleResource(ancestorsQuery(orgUnitId)),
    ]).then(([{ organisationUnits }, { ancestors }]) => {
        ancestors.push({ id: orgUnitId });
        return ancestors.some(({ id: ancestorId }) => organisationUnits.some(({ id }) => ancestorId === id));
    }).catch(error => console.log(error));

const autoSelectEnrollment = (
    programId: string,
    orgUnitId: string,
    teiId: string,
): InputObservable => {
    if (teiId && programId) {
        return of(openEnrollmentPage({
            programId,
            orgUnitId,
            teiId,
            enrollmentId: 'AUTO',
        }));
    }
    return of(startFetchingTeiFromTeiId());
};

const fetchTeiStream = (teiId, programId, querySingleResource) =>
    from(querySingleResource(teiQuery(teiId)))
        .pipe(
            map(({ attributes, trackedEntityType }) => {
                const teiDisplayName = deriveTeiName({ attributes, trackedEntityType, teiId, programId });

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
                return autoSelectEnrollment(programId, orgUnitId, teiId);
            }
            return from(querySingleResource({ resource: 'tracker/enrollments', id: enrollmentId }))
                .pipe(
                    flatMap(({ trackedEntity, program, orgUnit }) =>
                        from(inCaptureScope(querySingleResource, orgUnit))
                            .pipe(
                                map(programOwnerInCaptureScope =>
                                    openEnrollmentPage({
                                        programId: program,
                                        teiId: trackedEntity,
                                        orgUnitId: programOwnerInCaptureScope ? orgUnit : orgUnitId,
                                        enrollmentId,
                                    }),
                                ))),
                    catchError(() => of(startFetchingTeiFromTeiId())),
                    startWith(showLoadingViewOnEnrollmentPage()),
                );
        }),
    );

export const startFetchingTeiFromTeiIdEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.INFORMATION_USING_TEI_ID_FETCH),
        flatMap(() => {
            const { teiId, programId } = getLocationQuery();

            return fetchTeiStream(teiId, programId, querySingleResource);
        }),
    );

export const fetchEnrollmentsEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.ENROLLMENTS_FETCH, enrollmentPageActionTypes.INFORMATION_SUCCESS_FETCH),
        flatMap(() => {
            const { teiId, programId } = getLocationQuery();

            if (!teiId || !programId) {
                return of(updateEnrollmentAccessLevel({ programId, accessLevel: enrollmentAccessLevels.UNKNOWN_ACCESS }));
            }

            return from(querySingleResource(enrollmentsQuery(teiId, programId)))
                .pipe(
                    map(({ enrollments }) => {
                        const enrollmentsSortedByDate = sortByDate(enrollments
                            .filter(enrollment => enrollment.program === programId));
                        return saveEnrollments({ programId, enrollments: enrollmentsSortedByDate });
                    }),
                    catchError((error) => {
                        if (error.message) {
                            if (error.message.includes(serverErrorMessages.OWNERSHIP_ACCESS_PARTIALLY_DENIED)) {
                                return of(updateEnrollmentAccessLevel({ programId, accessLevel: enrollmentAccessLevels.LIMITED_ACCESS }));
                            } else if (error.message.includes(serverErrorMessages.OWNERSHIP_ACCESS_DENIED)) {
                                return of(updateEnrollmentAccessLevel({ programId, accessLevel: enrollmentAccessLevels.LIMITED_ACCESS })); // Todo: Change to NO_ACCESS
                            } else if (error.message.includes(serverErrorMessages.PROGRAM_ACCESS_CLOSED)) {
                                return of(updateEnrollmentAccessLevel({ programId, accessLevel: enrollmentAccessLevels.NO_ACCESS }));
                            } else if (error.message.includes(serverErrorMessages.ORGUNIT_OUT_OF_SCOPE)) {
                                return of(updateEnrollmentAccessLevel({ programId, accessLevel: enrollmentAccessLevels.NO_ACCESS }));
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

            if (enrollmentId !== queryEnrollment ||
                orgUnitId !== queryOrgUnitId ||
                programId !== queryProgramId ||
                teiId !== queryTeiId) {
                history.push(`/enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId, enrollmentId })}`);
            }
            return fetchTeiStream(teiId, programId, querySingleResource);
        },
        ),
    );
