// @flow
import { ofType } from 'redux-observable';
import { push } from 'connected-react-router';
import { catchError, flatMap, map, startWith } from 'rxjs/operators';
import { concat, from, of } from 'rxjs';
import moment from 'moment';
import { getApi } from '../../../d2';
import {
    enrollmentPageActionTypes,
    showErrorViewOnEnrollmentPage,
    showLoadingViewOnEnrollmentPage,
    successfulFetchingEnrollmentPageInformationFromUrl,
    pushCompleteUrl,
} from './EnrollmentPage.actions';
import { urlArguments } from '../../../utils/url';

const fetchEnrollment = id => getApi().get(`enrollments/${id}`);
const fetchTrackedEntityInstance = id => getApi().get(`trackedEntityInstances/${id}`, { fields: '*' });

export const fetchEnrollmentPageInformationFromUrlEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_START),
        flatMap(() => {
            const { currentSelections: { enrollmentId } } = store.value;

            return from(fetchEnrollment(enrollmentId))
                .pipe(
                    flatMap(({ trackedEntityInstance, program, orgUnit }) =>
                        from(fetchTrackedEntityInstance(trackedEntityInstance))
                            .pipe(
                                flatMap(({ attributes, enrollments }) => {
                                    const selectedName = attributes.reduce(
                                        (acc, { value: dataElementValue }) =>
                                            (acc ? `${acc} ${dataElementValue}` : dataElementValue), '');
                                    const enrollmentsSortedByDate =
                                      enrollments
                                          .sort((a, b) =>
                                              moment.utc(a.enrollmentDate).diff(moment.utc(b.enrollmentDate)),
                                          );

                                    return concat(
                                        of(successfulFetchingEnrollmentPageInformationFromUrl({
                                            selectedName,
                                            enrollmentsSortedByDate,
                                        })),
                                        of(pushCompleteUrl({
                                            programId: program,
                                            orgUnitId: orgUnit,
                                            trackedEntityInstanceId: trackedEntityInstance,
                                            enrollmentId,
                                        }),
                                        ),
                                    );
                                }),
                            )),
                    startWith(showLoadingViewOnEnrollmentPage()),
                    catchError(() => of(showErrorViewOnEnrollmentPage())),
                );
        },
        ),
    );

export const clearTrackedEntityInstanceSelectionEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.TRACKED_ENTITY_INSTANCE_SELECTION_CLEAR),
        map(() => {
            const { currentSelections: { programId, orgUnitId } } = store.value;
            return push(`/${urlArguments({ programId, orgUnitId })}`);
        }),
    );

export const setEnrollmentSelectionEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.ENROLLMENT_SELECTION_SET),
        map(({ payload: { enrollmentId } }) => {
            const { currentSelections: { programId, orgUnitId, trackedEntityInstanceId } } = store.value;
            return push(`/enrollment/${urlArguments({ programId, orgUnitId, enrollmentId })}`);
        }),
    );

export const clearEnrollmentSelectionEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.ENROLLMENT_SELECTION_CLEAR),
        map(() => {
            const { currentSelections: { programId, orgUnitId, trackedEntityInstanceId } } = store.value;
            return push(`/enrollment/${urlArguments({ programId, orgUnitId })}`);
        }),
    );


export const pushCompleteUrlEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.CURRENT_SELECTIONS_UPDATE),
        map(({ payload: { programId, orgUnitId, trackedEntityInstanceId, enrollmentId } }) =>
            push(`/enrollment/${urlArguments({ programId, orgUnitId, enrollmentId })}`)),
    );
