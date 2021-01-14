// @flow
import { ofType } from 'redux-observable';
import { push } from 'connected-react-router';
import { catchError, flatMap, map, startWith } from 'rxjs/operators';
import i18n from '@dhis2/d2-i18n';
import { from, of } from 'rxjs';
import moment from 'moment';
import { getApi } from '../../../d2';
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

const fetchEnrollment = id => getApi().get(`enrollments/${id}`, { fields: 'trackedEntityInstance,program,orgUnit' });
const fetchTrackedEntityInstance = id => getApi().get(`trackedEntityInstances/${id}`, { fields: 'attributes,enrollments' });

const sortByDate = (enrollments = []) => enrollments.sort((a, b) =>
    moment.utc(b.enrollmentDate).diff(moment.utc(a.enrollmentDate)));
const deriveSelectedName = (attributes = {}) => attributes.reduce((acc, { value: dataElementValue }) =>
    (acc ? `${acc} ${dataElementValue}` : dataElementValue), '');


const fetchTeiStream = teiId => from(fetchTrackedEntityInstance(teiId))
    .pipe(
        map(({ attributes, enrollments }) => {
            // todo this is not scaling when you have many attributes the name will be huge
            const selectedName = deriveSelectedName(attributes);
            const enrollmentsSortedByDate = sortByDate(enrollments);

            return successfulFetchingEnrollmentPageInformationFromUrl({
                selectedName,
                enrollmentsSortedByDate,
            });
        }),
        catchError(() => {
            const error = i18n.t("Tracked entity instance with id '{{teiId}}' doesn't exist", { teiId });
            return of(showErrorViewOnEnrollmentPage({ error }));
        }),
    );

export const fetchEnrollmentPageInformationFromUrlEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.INFORMATION_FETCH),
        map(() => {
            const {
                currentSelections: {
                    enrollmentId: selectedEnrollmentId,
                    teiId: selectedTeiId,
                },
            } = store.value;

            if (selectedEnrollmentId) {
                return startFetchingTeiFromEnrollmentId();
            } else if (selectedTeiId) {
                return startFetchingTeiFromTeiId();
            }
            const error = i18n.t('There is an error while opening this enrollment. Please enter a valid url.');
            return showErrorViewOnEnrollmentPage({ error });
        }),
    );

export const startFetchingTeiFromEnrollmentIdEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.INFORMATION_USING_ENROLLMENT_ID_FETCH),
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
                    flatMap(({ trackedEntityInstance, program, orgUnit }) => (
                        urlCompleted
                            ?
                            fetchTeiStream(trackedEntityInstance)
                            :
                            of(openEnrollmentPage({
                                programId: program,
                                orgUnitId: orgUnit,
                                teiId: trackedEntityInstance,
                                enrollmentId: selectedEnrollmentId,
                            }))
                    )),
                    catchError(() => {
                        const error = i18n.t("Enrollment with id '{{selectedEnrollmentId}}' doesn't exist", { selectedEnrollmentId });
                        return of(showErrorViewOnEnrollmentPage({ error }));
                    }),
                    startWith(showLoadingViewOnEnrollmentPage()),
                );
        }),
    );

export const startFetchingTeiFromTeiIdEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.INFORMATION_USING_TEI_ID_FETCH),
        flatMap(() => {
            const { currentSelections: { teiId } } = store.value;

            return fetchTeiStream(teiId);
        }),
    );

export const openEnrollmentPageEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.PAGE_OPEN),
        map(({ payload: { enrollmentId, programId, orgUnitId, teiId } }) =>
            push(`/enrollment/${urlArguments({ programId, orgUnitId, teiId, enrollmentId })}`),
        ),
    );
