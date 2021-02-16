// @flow
import { ofType } from 'redux-observable';
import { push } from 'connected-react-router';
import { catchError, flatMap, map, startWith } from 'rxjs/operators';
import i18n from '@dhis2/d2-i18n';
import { concat, empty, from, of } from 'rxjs';
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
import { urlArguments } from '../../../utils/url';
import { getAttributesFromScopeId } from '../../../metaData/helpers';

const sortByDate = (enrollments = []) => enrollments.sort((a, b) =>
    moment.utc(b.enrollmentDate).diff(moment.utc(a.enrollmentDate)));

const teiQuery = id => ({
    resource: 'trackedEntityInstances',
    id,
    params: {
        fields: ['attributes', 'enrollments', 'trackedEntityType'],
    },
});

const deriveTeiName = (attributes, trackedEntityType) => {
    const tetAttributes = getAttributesFromScopeId(trackedEntityType);
    const [firstId, secondId] = tetAttributes
        .filter(({ displayInReports }) => displayInReports)
        .map(({ id }) => id);

    const { value: firstValue = '' } = attributes.find(({ attribute }) => attribute === firstId);
    const { value: secondValue = '' } = attributes.find(({ attribute }) => attribute === secondId);
    return `${firstValue}${firstValue && ' '}${secondValue}`;
};

const fetchTeiStream = (teiId, querySingleResource) =>
    from(querySingleResource(teiQuery(teiId)))
        .pipe(
            map(({ attributes, enrollments, trackedEntityType }) => {
                const enrollmentsSortedByDate = sortByDate(enrollments);
                const teiDisplayName = deriveTeiName(attributes, trackedEntityType);

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
            const { query: { enrollmentId } } = store.value.router.location;

            return from(querySingleResource({ resource: 'enrollments', id: enrollmentId }))
                .pipe(
                    flatMap(({ trackedEntityInstance, program, orgUnit }) => (
                        concat(
                            fetchTeiStream(trackedEntityInstance, querySingleResource),
                            of(openEnrollmentPage({
                                programId: program,
                                orgUnitId: orgUnit,
                                teiId: trackedEntityInstance,
                                enrollmentId,
                            })),
                        )
                    )),
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

export const openEnrollmentPageEpic = (action$: InputObservable, store: ReduxStore) =>
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
                return of(push(`/enrollment?${urlArguments({ programId, orgUnitId, teiId, enrollmentId })}`));
            }
            return empty();
        },
        ),
    );
