// @flow
import { ofType } from 'redux-observable';
import { push } from 'connected-react-router';
import { catchError, filter, flatMap, map, pluck, startWith } from 'rxjs/operators';
import { from, of } from 'rxjs';
import moment from 'moment';
import { getApi } from '../../../d2';
import {
    enrollmentPageActionTypes,
    showErrorViewOnEnrollmentPage,
    showLoadingViewOnEnrollmentPage,
    successfulFetchingEnrollmentPageInformationFromUrl,
} from './EnrollmentPage.actions';
import { urlArguments } from '../../../utils/url';

const fetchEnrollment = id => getApi().get(`enrollments/${id}`);
const fetchTrackedEntityInstance = id => getApi().get(`trackedEntityInstances/${id}`, { fields: '*' });

export const fetchEnrollmentPageInformationFromUrlEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_START),
        pluck('payload'),
        filter(({ nextProps: { enrollmentId } }) => enrollmentId),
        flatMap(({ nextProps: { enrollmentId } }) =>
            from(fetchEnrollment(enrollmentId))
                .pipe(
                    flatMap(({ trackedEntityInstance }) =>
                        from(fetchTrackedEntityInstance(trackedEntityInstance))
                            .pipe(
                                map(({ attributes, enrollments }) => {
                                    const selectedName = attributes.reduce(
                                        (acc, { value: dataElementValue }) =>
                                            (acc ? `${acc} ${dataElementValue}` : dataElementValue),
                                        '');
                                    const selectedEnrollment =
                                      enrollments
                                          .find(({ enrollment }) => enrollment === enrollmentId);

                                    const enrollmentsSortedByDate =
                                      enrollments
                                          .sort((a, b) => moment.utc(a.enrollmentDate).diff(moment.utc(b.enrollmentDate)));
                                    return successfulFetchingEnrollmentPageInformationFromUrl({
                                        selectedName,
                                        selectedEnrollment,
                                        enrollmentsSortedByDate,
                                    });
                                }),
                            )),
                    startWith(showLoadingViewOnEnrollmentPage()),
                    catchError(() => of(showErrorViewOnEnrollmentPage())),
                ),
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

export const setEnrollmentSelectionEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.ENROLLMENT_SELECTION_SET),
        map(({ payload: { enrollmentId } }) => push(`/enrollment/${urlArguments({ enrollmentId })}`)),
    );
