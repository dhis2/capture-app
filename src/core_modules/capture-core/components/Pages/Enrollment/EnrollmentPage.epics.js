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
    openEnrollmentPage,
    startFetchingTeiFromEnrollmentId,
    startFetchingTeiFromTeiId,
} from './EnrollmentPage.actions';
import { buildUrlQueryString, deriveURLParamsFromLocation } from '../../../utils/routing';
import { deriveTeiName } from '../common/EnrollmentOverviewDomain/useTeiDisplayName';

const sortByDate = (enrollments = []) => enrollments.sort((a, b) =>
    moment.utc(b.enrollmentDate).diff(moment.utc(a.enrollmentDate)));

const teiQuery = id => ({
    resource: 'trackedEntityInstances',
    id,
    params: {
        fields: ['attributes', 'enrollments', 'trackedEntityType'],
    },
});

const fetchTeiStream = (teiId, querySingleResource) =>
    from(querySingleResource(teiQuery(teiId)))
        .pipe(
            map(({ attributes, enrollments, trackedEntityType }) => {
                const enrollmentsSortedByDate = sortByDate(enrollments);
                const teiDisplayName = deriveTeiName(attributes, trackedEntityType, teiId);

                return successfulFetchingEnrollmentPageInformationFromUrl({
                    teiDisplayName,
                    tetId: trackedEntityType,
                    enrollmentsSortedByDate,
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
            const { enrollmentId, teiId } = deriveURLParamsFromLocation();
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
            const { enrollmentId, programId, orgUnitId, teiId } = deriveURLParamsFromLocation();
            if (enrollmentId === 'AUTO') {
                return of(openEnrollmentPage({
                    programId,
                    orgUnitId,
                    teiId,
                    enrollmentId,
                }));
            }
            return from(querySingleResource({ resource: 'enrollments', id: enrollmentId }))
                .pipe(
                    map(({ trackedEntityInstance, program, orgUnit }) =>
                        openEnrollmentPage({
                            programId: program,
                            orgUnitId: orgUnit,
                            teiId: trackedEntityInstance,
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
            const { teiId } = deriveURLParamsFromLocation();

            return fetchTeiStream(teiId, querySingleResource);
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
            } = deriveURLParamsFromLocation();
            const urlCompleted = Boolean(queryEnrollment && queryOrgUnitId && queryProgramId && queryTeiId);

            if (!urlCompleted) {
                history.push(`/enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId, enrollmentId })}`);
                return fetchTeiStream(teiId, querySingleResource);
            }
            return fetchTeiStream(teiId, querySingleResource);
        },
        ),
    );
