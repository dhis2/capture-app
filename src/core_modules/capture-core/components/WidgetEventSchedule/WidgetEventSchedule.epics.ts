import { ofType } from 'redux-observable';
import { v4 as uuid } from 'uuid';
import { map } from 'rxjs/operators';
import {
    scheduleEventWidgetActionTypes,
    scheduleEvent,
    updateScheduledDateForEvent,
    type ApiAssignedUser,
} from './WidgetEventSchedule.actions';
import { statusTypes } from '../../events/statusTypes';
import { convertCategoryOptionsToServer } from '../../converters/clientToServer';
import { generateUID } from '../../utils/uid/generateUID';
import type { EpicAction } from '../../../capture-core-utils/types';

type ReduxStore = {
    value: {
        dataEntries: Record<string, { eventId: string }>;
        currentSelections: Record<string, unknown>;
        events: Record<string, { status: string }>;
    };
};

type RequestScheduleEventAction = {
    scheduleDate: string;
    notes: Array<{value: string}>;
    programId: string;
    orgUnitId: string;
    stageId: string;
    teiId: string;
    enrollmentId: string;
    eventId: string;
    categoryOptions: Record<string, string>;
    onSaveExternal: (eventServerValues: Object, uid?: string) => void;
    onSaveSuccessActionType?: string;
    onSaveErrorActionType?: string;
    assignedUser?: ApiAssignedUser | null;
};

export const scheduleEnrollmentEventEpic = (action$: EpicAction<RequestScheduleEventAction>, store: ReduxStore) =>
    action$.pipe(
        ofType(scheduleEventWidgetActionTypes.EVENT_SCHEDULE_REQUEST),
        map((action) => {
            const uid = uuid();
            const {
                scheduleDate,
                notes,
                programId,
                orgUnitId,
                stageId,
                teiId,
                enrollmentId,
                eventId = generateUID(),
                categoryOptions,
                onSaveExternal,
                onSaveSuccessActionType,
                onSaveErrorActionType,
                assignedUser,
            } = action.payload;

            const events = (store.value as any).events;
            const existingEnrollment = events[eventId]
            && [statusTypes.SCHEDULE, statusTypes.OVERDUE].includes(events[eventId].status);
            const attributeCategoryOptions = categoryOptions && convertCategoryOptionsToServer(categoryOptions);

            let serverData: { events: Array<any> } = { events: [{
                scheduledAt: scheduleDate,
                dataValues: [],
                trackedEntity: teiId,
                event: eventId,
                orgUnit: orgUnitId,
                enrollment: enrollmentId,
                program: programId,
                programStage: stageId,
                status: 'SCHEDULE',
                notes: notes ?? [],
                assignedUser,
            }] };

            if (attributeCategoryOptions) {
                serverData = {
                    events: [{
                        ...serverData.events[0],
                        attributeCategoryOptions,
                    }],
                };
            }

            if (existingEnrollment) {
                onSaveExternal && onSaveExternal(serverData.events[0]);
                return updateScheduledDateForEvent(serverData, eventId, onSaveSuccessActionType, onSaveErrorActionType);
            }

            onSaveExternal && onSaveExternal(serverData, uid);
            return scheduleEvent(serverData, uid, onSaveSuccessActionType, onSaveErrorActionType);
        }),
    );
