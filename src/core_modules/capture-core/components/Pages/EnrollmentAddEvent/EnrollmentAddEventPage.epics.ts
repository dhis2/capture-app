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
} from '../common/EnrollmentOverviewDomain/enrollment.actions';
import { relatedStageActions } from '../../WidgetRelatedStages';
import { buildUrlQueryString } from '../../../utils/routing';
import type { EpicAction, ReduxStore, ApiUtils } from '../../../../capture-core-utils/types/global';

const shouldNavigateWithRelatedStage = ({
    linkMode,
    linkedEventId,
    linkedOrgUnitId,
    navigate,
}: {
    linkMode?: string;
    linkedEventId?: string;
    linkedOrgUnitId?: string;
    navigate: (url: string) => void;
}) => {
    if (linkMode && linkedEventId) {
        if (linkMode === relatedStageActions.ENTER_DATA) {
            const navigateRelatedStage = () => navigate(`/enrollmentEventEdit?${buildUrlQueryString({
                eventId: linkedEventId,
                orgUnitId: linkedOrgUnitId,
            })}`);
            return { navigateRelatedStage };
        }
    }
    return {};
};

type EventSaveSuccessPayload = {
    bundleReport: {
        typeReportMap: {
            EVENT: {
                objectReports: Array<{ uid: string }>;
            };
        };
    };
};

type EventSaveSuccessMeta = {
    serverData: {
        events?: any[];
        enrollments: Array<{ events: any[] }>;
    };
};

export const saveNewEventSucceededEpic = (action$: EpicAction<EventSaveSuccessPayload, EventSaveSuccessMeta>, store: ReduxStore, { navigate }: ApiUtils) =>
    action$.pipe(
        ofType(
            addEnrollmentEventPageDefaultActionTypes.EVENT_SAVE_SUCCESS,
            addEnrollmentEventPageDefaultActionTypes.EVENT_SCHEDULE_SUCCESS,
        ),
        map((action: any) => {
            const actions: any[] = [];
            const { enrollmentDomain } = store.value;
            const eventsFromApi = action.payload.bundleReport.typeReportMap.EVENT.objectReports;
            const { serverData: { events, enrollments } } = action.meta;
            const serverDataEvents = events ?? enrollments[0].events;
            const enrollmentEvents = enrollmentDomain?.enrollment?.events || [];

            const { eventsToCommit, eventsToAdd } = serverDataEvents.reduce((acc: { eventsToCommit: any[]; eventsToAdd: any[] }, event: any) => {
                const eventFromRedux = enrollmentEvents?.find((e: any) => e.event === event.event);

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

            if (enrollmentDomain?.eventSaveInProgress) {
                const {
                    linkMode,
                    requestEventId,
                    linkedEventId,
                    linkedOrgUnitId,
                } = enrollmentDomain?.eventSaveInProgress;
                const requestEvent = eventsFromApi.find(event => event.uid === requestEventId);

                if (requestEvent) {
                    const { navigateRelatedStage } = shouldNavigateWithRelatedStage({
                        linkMode,
                        linkedEventId,
                        linkedOrgUnitId,
                        navigate,
                    });

                    navigateRelatedStage && navigateRelatedStage();
                }
            }

            return batchActions(actions);
        }),
    );

type EventSaveErrorMeta = {
    serverData: {
        events?: any[];
        enrollments: Array<{ events: any[] }>;
    };
};

export const saveNewEventFailedEpic = (action$: EpicAction<any, EventSaveErrorMeta>) =>
    action$.pipe(
        ofType(
            addEnrollmentEventPageDefaultActionTypes.EVENT_SAVE_ERROR,
            addEnrollmentEventPageDefaultActionTypes.EVENT_SCHEDULE_ERROR,
        ),
        map((action: any) => {
            const { serverData: { events, enrollments } } = action.meta;
            const rollbackEvents = events ?? enrollments[0].events;

            return batchActions([
                saveFailed(),
                rollbackEnrollmentEvents({
                    events: rollbackEvents,
                }),
            ]);
        }),
    );
