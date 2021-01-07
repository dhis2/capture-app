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
    openEnrollmentPage,
} from './EnrollmentPage.actions';
import { urlArguments } from '../../../utils/url';

const fetchEnrollment = id => getApi().get(`enrollments/${id}`, { fields: 'trackedEntityInstance,program,orgUnit' });
const fetchTrackedEntityInstance = id => getApi().get(`trackedEntityInstances/${id}`, { fields: 'attributes,enrollments' });

export const fetchEnrollmentPageInformationFromUrlEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_FETCH),
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
                                    const enrollmentsSortedByDate = enrollments.sort((a, b) =>
                                        moment.utc(a.enrollmentDate).diff(moment.utc(b.enrollmentDate)));

                                    return concat(
                                        of(successfulFetchingEnrollmentPageInformationFromUrl({
                                            selectedName,
                                            enrollmentsSortedByDate,
                                        })),
                                        of(openEnrollmentPage({
                                            programId: program,
                                            orgUnitId: orgUnit,
                                            teiId: trackedEntityInstance,
                                            enrollmentId,
                                        }),
                                        ),
                                    );
                                }),
                            )),
                    startWith(showLoadingViewOnEnrollmentPage()),
                    catchError(() => of(showErrorViewOnEnrollmentPage())),
                );
        }),
    );

export const openEnrollmentPageEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.OPEN_ENROLLMENT_PAGE),
        map(({ payload: { enrollmentId, programId, orgUnitId, teiId } }) =>
            push(`/enrollment/${urlArguments({ programId, orgUnitId, teiId, enrollmentId })}`),
        ),
    );
