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
import programCollection from '../../../../../metaDataMemoryStores/programCollection/programCollection';
import { TrackerProgram } from '../../../../../metaData/Program';
import { getScopeInfo } from '../../../../../metaData/helpers';

const deriveEnrollmentInfo = (program, programStage) => {
    const trackerProgram = [...programCollection.values()].find(({ id }) => id === program) || {};
    const { name: programStageDisplayName } = trackerProgram.stages.get(programStage) || { name: '' };
    const { _labels: { enrollmentDate: enrollmentDisplayName } } = trackerProgram instanceof TrackerProgram ? trackerProgram.enrollment : {};

    return { programStageDisplayName, enrollmentDisplayName };
};

export const fetchEventInformationEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(enrollmentEventEditPagePageActionTypes.EVENT_START_FETCH),
        flatMap(() => {
            const { query: { teiId, enrollmentId, stageId, eventId } } = store.value.router.location;
            const urlComplete = Boolean(teiId && enrollmentId && stageId && eventId);
            if (!urlComplete) {
                const error = i18n.t('There is an error while opening this enrollment. Please enter a valid url.');
                return of(showErrorViewOnEnrollmentEventEditPage({ error }));
            }

            return from(querySingleResource({
                resource: 'events',
                id: eventId,
                params: { fields: ['*'] },
            }),
            )
                .pipe(
                    flatMap(({ trackedEntityInstance, enrollment, programStage, eventDate, program }) =>
                        forkJoin(
                            querySingleResource({
                                resource: 'enrollments',
                                id: enrollment,
                                params: { fields: ['created'] },
                            }),
                            querySingleResource({
                                resource: 'trackedEntityInstances',
                                id: trackedEntityInstance,
                                params: { fields: ['attributes', 'trackedEntityType'] },
                            }),
                        ).pipe(
                            map(([{ created }, { attributes, trackedEntityType }]) => {
                                const teiDisplayName = deriveTeiName(attributes, trackedEntityType);
                                // $FlowFixMe;
                                const enrollmentDisplayDate: string = convertValue(created, dataElementTypes.DATE);
                                // $FlowFixMe;
                                const eventDisplayDate: string = convertValue(eventDate, dataElementTypes.DATE);
                                const { programStageDisplayName, enrollmentDisplayName } = deriveEnrollmentInfo(program, programStage);
                                const { trackedEntityName: tetDisplayName } = getScopeInfo(program);

                                return successfulFetchingEventInformation({
                                    teiDisplayName,
                                    tetDisplayName,
                                    enrollmentDisplayDate,
                                    programStageDisplayName,
                                    enrollmentDisplayName,
                                    eventDisplayDate,
                                });
                            })),
                    ),
                    catchError(() => {
                        const error = i18n.t('Enrollment with id "{{eventId}}" does not exist', { eventId });
                        return of(showErrorViewOnEnrollmentEventEditPage({ error }));
                    }),
                    startWith(showLoadingViewOnEnrollmentEventEditPage()),
                );
        }),
    );
