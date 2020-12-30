// @flow
import { ofType } from 'redux-observable';
import { catchError, filter, flatMap, map, pluck, startWith } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { getApi } from '../../../d2';
import {
    enrollmentPageActionTypes,
    showErrorViewOnEnrollmentPage,
    showLoadingViewOnEnrollmentPage,
    successfulFetchingEnrollmentPageInformationFromUrl,
} from './EnrollmentPage.actions';

export const fetchEnrollmentPageInformationFromUrlEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_START),
        pluck('payload'),
        filter(({ nextProps: { enrollmentId } }) => enrollmentId),
        flatMap(({ nextProps: { enrollmentId } }) =>
            from(getApi().get(`enrollments/${enrollmentId}`))
                .pipe(
                    flatMap(({ trackedEntityInstance }) => {
                        let r;
                        return from(getApi().get(`trackedEntityInstances/${trackedEntityInstance}`))
                            .pipe(
                                map(({ attributes }) => {
                                    const selectedName = attributes.reduce(
                                        (acc, { value: dataElementValue }) =>
                                            (acc ? `${acc} ${dataElementValue}` : dataElementValue),
                                        '');
                                    return successfulFetchingEnrollmentPageInformationFromUrl({ selectedName });
                                }),
                            );
                    }),
                    startWith(showLoadingViewOnEnrollmentPage()),
                    catchError(() => of(showErrorViewOnEnrollmentPage())),
                ),
        ),
    );
