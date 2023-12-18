// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { newEventBatchActionTypes, newEventWidgetActionTypes, saveEvents } from './validated.actions';

export const saveNewEnrollmentEventEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(
            newEventBatchActionTypes.REQUEST_SAVE_AND_SET_SUBMISSION_IN_PROGRESS,
        ),
        map(actionBatch =>
            actionBatch
                .payload
                .find(action => action.type === newEventWidgetActionTypes.EVENT_SAVE_REQUEST),
        ),
        map((action) => {
            const {
                requestEvent,
                linkedEvent,
                relationship,
                linkMode,
                onSaveExternal,
                onSaveSuccessActionType,
                onSaveErrorActionType,
            } = action.payload;

            const serverData = linkedEvent ? {
                events: [requestEvent, linkedEvent],
                relationships: [relationship],
            } : {
                events: [requestEvent],
            };

            onSaveExternal && onSaveExternal({ linkMode, ...serverData });
            return saveEvents({
                serverData,
                onSaveSuccessActionType,
                onSaveErrorActionType,
                ...action.payload,
            });
        }),
    );
