// @flow
import { ofType } from 'redux-observable';
import { push } from 'connected-react-router';
import { catchError, filter, flatMap, map, pluck, startWith } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { getApi } from '../../../d2';
import {
    enrollmentPageActionTypes,
    showErrorViewOnEnrollmentPage,
    showLoadingViewOnEnrollmentPage,
    successfulFetchingEnrollmentPageInformationFromUrl,
} from './EnrollmentPage.actions';
import { urlArguments } from '../../../utils/url';

export const fetchEnrollmentPageInformationFromUrlEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_START),
        pluck('payload'),
        filter(({ nextProps: { enrollmentId } }) => enrollmentId),
        flatMap(({ nextProps: { enrollmentId } }) =>
            from(getApi().get(`enrollments/${enrollmentId}`))
                .pipe(
                    flatMap(({ trackedEntityInstance }) =>
                        from(getApi().get(`trackedEntityInstances/${trackedEntityInstance}`))
                            .pipe(
                                map(({ attributes }) => {
                                    const selectedName = attributes.reduce(
                                        (acc, { value: dataElementValue }) =>
                                            (acc ? `${acc} ${dataElementValue}` : dataElementValue),
                                        '');
                                    return successfulFetchingEnrollmentPageInformationFromUrl({ selectedName });
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
