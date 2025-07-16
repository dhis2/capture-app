import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import {
    newEventBatchActionTypes,
    newEventWidgetActionTypes,
    saveEvents,
} from './validated.actions';

export const saveNewEnrollmentEventEpic = (action$: any) =>
    action$.pipe(
        ofType(
            newEventBatchActionTypes.REQUEST_SAVE_AND_SET_SUBMISSION_IN_PROGRESS,
        ),
        map((actionBatch: any) =>
            actionBatch
                .payload
                .find((action: any) => action.type === newEventWidgetActionTypes.EVENT_SAVE_REQUEST),
        ),
        map((action: any) => {
            const {
                relationship,
                serverData,
                linkMode,
                onSaveExternal,
                onSaveSuccessActionType,
                onSaveErrorActionType,
            } = action.payload;
            const events = serverData.events ?? serverData.enrollments[0].events;
            const relationships = relationship ? [relationship] : [];

            onSaveExternal && onSaveExternal({ linkMode, events, relationships, ...serverData });
            return saveEvents({
                serverData,
                onSaveSuccessActionType,
                onSaveErrorActionType,
                ...action.payload,
            });
        }),
    );
