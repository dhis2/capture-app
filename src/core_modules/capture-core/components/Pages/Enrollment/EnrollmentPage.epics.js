// @flow
import { ofType } from 'redux-observable';
import { catchError, filter, flatMap, pluck, startWith } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { getApi } from '../../../d2';
import {
    enrollmentPageActionTypes,
    showErrorViewOnEnrollmentPage,
    showInitialViewOnEnrollmentPage,
    showLoadingViewOnEnrollmentPage,
} from './EnrollmentPage.actions';

export const fetchEnrollmentPageInformationFromUrlEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.BASED_ON_ENROLLMENT_ID_SELECTIONS_FROM_URL_UPDATE),
        pluck('payload'),
        filter(({ nextProps: { enrollmentId } }) => enrollmentId),
        flatMap(({ nextProps: { enrollmentId } }) =>
            from(getApi().get(`enrollments/${enrollmentId}`))
                .pipe(
                    flatMap((enrollment) => {
                        let r;
                        return of(showInitialViewOnEnrollmentPage());
                    }),
                    startWith(showLoadingViewOnEnrollmentPage()),
                    catchError(() => of(showErrorViewOnEnrollmentPage())),
                ),
        ),
    );
