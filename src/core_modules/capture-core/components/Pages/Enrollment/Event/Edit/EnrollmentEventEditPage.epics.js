// @flow
import { ofType } from 'redux-observable';
import i18n from '@dhis2/d2-i18n';
import { catchError, flatMap, map, startWith } from 'rxjs/operators';
import { forkJoin, from, of } from 'rxjs';
import {
    enrollmentEventEditPagePageActionTypes,
    showErrorViewOnEnrollmentEventEditPage,
    showLoadingViewOnEnrollmentEventEditPage,
    successfulFetchingEventInformation,
} from './EnrollmentEventEditPage.actions';
import { deriveTeiName } from '../../helpers';
import { convertValue } from '../../../../../converters/clientToView';
import { dataElementTypes } from '../../../../../metaData/DataElement';

export const fetchEventInformationEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(enrollmentEventEditPagePageActionTypes.EVENT_START_FETCH),
        flatMap(() => {
            const { query: { teiId, enrollmentId, stageId, eventId } } = store.value.router.location;
            const urlComplete = Boolean(teiId) && Boolean(enrollmentId) && Boolean(stageId) && Boolean(eventId);
            if (!urlComplete) {
                const error = i18n.t('There is an error while opening this enrollment. Please enter a valid url.');
                return of(showErrorViewOnEnrollmentEventEditPage({ error }));
            }

            return from(querySingleResource({ resource: 'events', id: eventId }))
                .pipe(
                    flatMap(({ trackedEntityInstance, enrollment, programStage, event, eventDate }) =>
                        forkJoin(
                            querySingleResource({ resource: 'enrollments', id: enrollment, params: { fields: ['created'] } }),
                            querySingleResource({ resource: 'trackedEntityInstances', id: trackedEntityInstance }),
                            querySingleResource({ resource: 'programStages', id: programStage }),
                        ).pipe(
                            map(([{ created }, { attributes, trackedEntityType }, programStageResponse]) => {
                                const teiDisplayName = deriveTeiName(attributes, trackedEntityType);
                                // $FlowFixMe;
                                const enrollmentDisplayDate: string = convertValue(created, dataElementTypes.DATETIME);
                                // $FlowFixMe;
                                const eventDisplayDate: string = convertValue(eventDate, dataElementTypes.DATETIME);

                                return successfulFetchingEventInformation({ teiDisplayName, enrollmentDisplayDate, programStageDisplayName: 'Yet to come', eventDisplayDate });
                            }))),
                    catchError(() => {
                        const error = i18n.t('Enrollment with id "{{eventId}}" does not exist', { eventId });
                        return of(showErrorViewOnEnrollmentEventEditPage({ error }));
                    }),
                    startWith(showLoadingViewOnEnrollmentEventEditPage()),
                );
        }),
    );
