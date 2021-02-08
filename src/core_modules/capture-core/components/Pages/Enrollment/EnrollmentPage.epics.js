// @flow
import { ofType } from 'redux-observable';
import { push } from 'connected-react-router';
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
import { urlArguments } from '../../../utils/url';

const sortByDate = (enrollments = []) => enrollments.sort((a, b) =>
    moment.utc(b.enrollmentDate).diff(moment.utc(a.enrollmentDate)));

const teiQuery = id => ({
    resource: 'trackedEntityInstances',
    id,
    params: {
        fields: ['attributes', 'enrollments', 'trackedEntityType'],
    },
});

const deriveSelectedTeiName = (attributes = {}) =>
    attributes.reduce((acc, { value: dataElementValue }) =>
        (acc ? `${acc} ${dataElementValue}` : dataElementValue), '');

const fetchTeiStream = (teiId, querySingleResource) =>
    from(querySingleResource(teiQuery(teiId)))
        .pipe(
            map(({ attributes, enrollments }) => {
                const enrollmentsSortedByDate = sortByDate(enrollments);
                const teiDisplayName = deriveSelectedTeiName(attributes);

                return successfulFetchingEnrollmentPageInformationFromUrl({
                    teiDisplayName,
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
            const { query: { enrollmentId, orgUnitId, programId, teiId } } = store.value.router.location;
            const urlCompleted = Boolean(enrollmentId && orgUnitId && programId && teiId);

            return from(querySingleResource({ resource: 'enrollments', id: enrollmentId }))
                .pipe(
                    flatMap(({ trackedEntityInstance, program, orgUnit }) => (
                        urlCompleted
                            ?
                            fetchTeiStream(trackedEntityInstance, querySingleResource)
                            :
                            of(openEnrollmentPage({
                                programId: program,
                                orgUnitId: orgUnit,
                                teiId: trackedEntityInstance,
                                enrollmentId,
                            }))
                    )),
                    catchError(() => {
                        const error = i18n.t("Enrollment with id '{{selectedEnrollmentId}}' doesn't exist", { enrollmentId });
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

export const openEnrollmentPageEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.PAGE_OPEN),
        map(({ payload: { enrollmentId, programId, orgUnitId, teiId } }) =>
            push(`/enrollment?${urlArguments({ programId, orgUnitId, teiId, enrollmentId })}`),
        ),
    );
