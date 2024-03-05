// @flow
import { ofType } from 'redux-observable';
import { batchActions } from 'redux-batched-actions';
import { map } from 'rxjs/operators';
import {
    addEnrollmentEventPageDefaultActionTypes,
} from './EnrollmentAddEventPageDefault/EnrollmentAddEventPageDefault.actions';
import {
    addPersistedEnrollmentEvents,
    commitEnrollmentEvents,
    rollbackEnrollmentEvents,
    saveFailed,
    commitEnrollmentAndEvents,
    rollbackEnrollmentAndEvents,
} from '../common/EnrollmentOverviewDomain/enrollment.actions';
import { actions as RelatedStageActions } from '../../WidgetRelatedStages/constants';
import { buildUrlQueryString } from '../../../utils/routing';

const shouldNavigateWithRelatedStage = ({
    linkMode,
    linkedEventId,
    linkedOrgUnitId,
    history,
}) => {
    if (linkMode && linkedEventId) {
        if (linkMode === RelatedStageActions.ENTER_DATA) {
            const navigate = () => history.push(`/enrollmentEventEdit?${buildUrlQueryString({
                eventId: linkedEventId,
                orgUnitId: linkedOrgUnitId,
            })}`);
            return { navigate };
        }
    }
    return {};
};

export const saveNewEventSucceededEpic = (action$: InputObservable, state: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(
            addEnrollmentEventPageDefaultActionTypes.EVENT_SAVE_SUCCESS,
            addEnrollmentEventPageDefaultActionTypes.EVENT_SCHEDULE_SUCCESS,
        ),
        map((action) => {
            const actions = [];
            const { enrollmentDomain } = state.value;
            const eventsFromApi = action.payload.bundleReport.typeReportMap.EVENT.objectReports;
            const serverDataEvents = action.meta.serverData.events;
            const enrollmentEvents = enrollmentDomain.enrollment.events;

            const { eventsToCommit, eventsToAdd } = serverDataEvents.reduce((acc, event) => {
                const eventFromRedux = enrollmentEvents.find(e => e.event === event.event);

                if (!eventFromRedux) {
                    acc.eventsToAdd.push(event);
                } else if (eventFromRedux.pendingApiResponse) {
                    const eventToCommit = eventsFromApi.find(e => e.uid === event.event);
                    acc.eventsToCommit.push(eventToCommit);
                }
                return acc;
            }, { eventsToCommit: [], eventsToAdd: [] });

            if (eventsToAdd.length > 0) {
                actions.push(
                    addPersistedEnrollmentEvents({ events: eventsToAdd }),
                );
            }

            if (eventsToCommit.length > 0) {
                actions.push(
                    commitEnrollmentEvents({ events: eventsToCommit }),
                );
            }

            if (enrollmentDomain.eventSaveInProgress) {
                const {
                    linkMode,
                    requestEventId,
                    linkedEventId,
                    linkedOrgUnitId,
                } = enrollmentDomain.eventSaveInProgress;
                const requestEvent = eventsFromApi.find(event => event.uid === requestEventId);

                if (requestEvent) {
                    const { navigate } = shouldNavigateWithRelatedStage({
                        linkMode,
                        linkedEventId,
                        linkedOrgUnitId,
                        history,
                    });

                    navigate && navigate();
                }
            }

            return batchActions(actions);
        }),
    );

export const saveNewEventFailedEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(
            addEnrollmentEventPageDefaultActionTypes.EVENT_SAVE_ERROR,
            addEnrollmentEventPageDefaultActionTypes.EVENT_SCHEDULE_ERROR,
        ),
        map((action) => {
            const { serverData } = action.meta;
            return batchActions([saveFailed(), rollbackEnrollmentEvents({ events: serverData.events })]);
        }),
    );

export const saveEventAndCompleteEnrollmentSucceededEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(addEnrollmentEventPageDefaultActionTypes.EVENT_SAVE_ENROLLMENT_COMPLETE_SUCCESS),
        map((action) => {
            const meta = action.meta;
            // the bundleReport returns the events in the same order as the payload order. Therefore, we know that the first event is the newly added one.
            const eventId = action.payload.bundleReport.typeReportMap.EVENT.objectReports[0].uid;
            return commitEnrollmentAndEvents(meta.uid, eventId);
        }),
    );

export const saveEventAndCompleteEnrollmentFailedEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(addEnrollmentEventPageDefaultActionTypes.EVENT_SAVE_ENROLLMENT_COMPLETE_ERROR),
        map((action) => {
            const meta = action.meta;
            return batchActions(
                [saveFailed(), rollbackEnrollmentAndEvents(meta.uid)],
                'NewEvent.saveEventAndCompleteEnrollmentFailed',
            );
        }),
    );
