// @flow
import { ofType } from 'redux-observable';
import { push } from 'connected-react-router';
import { catchError, flatMap, map, startWith } from 'rxjs/operators';
import i18n from '@dhis2/d2-i18n';
import { concat, from, of } from 'rxjs';
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
import { buildUrlQueryString } from '../../../utils/routing';
import { deriveTeiName } from '../common/EnrollmentOverviewDomain/useTeiDisplayName';

const sortByDate = (enrollments = []) => enrollments.sort((a, b) =>
    moment.utc(b.enrolledAt).diff(moment.utc(a.enrolledAt)));

const teiQuery = id => ({
    resource: 'tracker/trackedEntities',
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

export const fetchEnrollmentPageInformationFromUrlEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.INFORMATION_FETCH),
        map(() => {
            const { query: { enrollmentId, teiId } } = store.value.router.location;

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
            const { query: { enrollmentId, programId, orgUnitId, teiId } } = store.value.router.location;
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
            const { query: { teiId } } = store.value.router.location;

            return fetchTeiStream(teiId, querySingleResource);
        }),
    );

export const openEnrollmentPageEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.PAGE_OPEN),
        flatMap(({ payload: { enrollmentId, programId, orgUnitId, teiId } }) => {
            const {
                query: {
                    enrollmentId: queryEnrollment,
                    orgUnitId: queryOrgUnitId,
                    programId: queryProgramId,
                    teiId: queryTeiId,
                },
            } = store.value.router.location;
            const urlCompleted = Boolean(queryEnrollment && queryOrgUnitId && queryProgramId && queryTeiId);

            if (!urlCompleted) {
                return concat(
                    of(push(`/enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId, enrollmentId })}`)),
                    fetchTeiStream(teiId, querySingleResource),
                );
            }
            return fetchTeiStream(teiId, querySingleResource);
        },
        ),
    );
