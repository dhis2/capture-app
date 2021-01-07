// @flow
import { ofType } from 'redux-observable';
import { push } from 'connected-react-router';
import { catchError, flatMap, map, startWith } from 'rxjs/operators';
import { from, of } from 'rxjs';
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
            const {
                currentSelections: {
                    enrollmentId: selectedEnrollmentId,
                    orgUnitId: selectedOrgUnitId,
                    programId: selectedProgramId,
                    teiId: selectedTeiId,
                },
            } = store.value;
            const urlCompleted = Boolean(selectedEnrollmentId && selectedOrgUnitId && selectedProgramId && selectedTeiId);

            return from(fetchEnrollment(selectedEnrollmentId))
                .pipe(
                    flatMap(({ trackedEntityInstance, program, orgUnit }) =>
                        from(fetchTrackedEntityInstance(trackedEntityInstance))
                            .pipe(
                                map(({ attributes, enrollments }) => {
                                    // todo this is not scaling when you have many attributes the name will be huge
                                    const selectedName = attributes.reduce((acc, { value: dataElementValue }) =>
                                        (acc ? `${acc} ${dataElementValue}` : dataElementValue), '');
                                    const enrollmentsSortedByDate = enrollments.sort((a, b) =>
                                        moment.utc(a.enrollmentDate).diff(moment.utc(b.enrollmentDate)));


                                    return urlCompleted ?
                                        successfulFetchingEnrollmentPageInformationFromUrl({
                                            selectedName,
                                            enrollmentsSortedByDate,
                                        })
                                        :
                                        openEnrollmentPage({
                                            programId: program,
                                            orgUnitId: orgUnit,
                                            teiId: trackedEntityInstance,
                                            enrollmentId: selectedEnrollmentId,
                                        });
                                }),
                                catchError(() => of(showErrorViewOnEnrollmentPage())),
                            )),
                    catchError(() => of(showErrorViewOnEnrollmentPage())),
                    startWith(showLoadingViewOnEnrollmentPage()),
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
