// @flow
import { ofType } from 'redux-observable';
import { catchError, flatMap, map, startWith } from 'rxjs/operators';
import { from, of } from 'rxjs';
import moment from 'moment';
import { getApi } from '../../../d2';
import {
    enrollmentPageActionTypes,
    showErrorViewOnEnrollmentPage,
    showLoadingViewOnEnrollmentPage,
    successfulFetchingEnrollmentPageInformationFromUrl,
} from './EnrollmentPage.actions';

const fetchEnrollment = id => getApi().get(`enrollments/${id}`, { fields: 'trackedEntityInstance,program,orgUnit' });
const fetchTrackedEntityInstance = id => getApi().get(`trackedEntityInstances/${id}`, { fields: 'attributes,enrollments' });

export const fetchEnrollmentPageInformationFromUrlEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_FETCH),
        flatMap(() => {
            const { query: { enrollmentId } } = store.value.router.location;

            return from(fetchEnrollment(enrollmentId))
                .pipe(
                    flatMap(({ trackedEntityInstance }) =>
                        from(fetchTrackedEntityInstance(trackedEntityInstance))
                            .pipe(
                                map(({ attributes, enrollments }) => {
                                    const selectedName = attributes.reduce((acc, { value: dataElementValue }) =>
                                        (acc ? `${acc} ${dataElementValue}` : dataElementValue), '');
                                    const enrollmentsSortedByDate = enrollments.sort((a, b) =>
                                        moment.utc(a.enrollmentDate).diff(moment.utc(b.enrollmentDate)));

                                    return successfulFetchingEnrollmentPageInformationFromUrl({
                                        selectedName,
                                        enrollmentsSortedByDate,
                                    });
                                }),
                            )),
                    startWith(showLoadingViewOnEnrollmentPage()),
                    catchError(() => of(showErrorViewOnEnrollmentPage())),
                );
        }),
    );
