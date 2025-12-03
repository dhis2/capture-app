import { ofType } from 'redux-observable';
import { map, filter } from 'rxjs/operators';
import { batchActions } from 'redux-batched-actions';
import { createServerData, buildNewEventPayload } from './buildNewEventPayload';
import {
    requestSaveEvent,
    setSaveEnrollmentEventInProgress,
    newEventBatchActionTypes,
    newEventWidgetActionTypes,
    saveEvents,
} from './validated.actions';

export const saveNewEnrollmentEventEpic = (action$: any, store: any) =>
    action$.pipe(
        ofType(newEventWidgetActionTypes.EVENT_SAVE_BUTTON),
        filter((action: any) => {
            const { relatedStageRef } = action.payload;
            if (!(relatedStageRef?.current?.eventHasLinkableStageRelationship())) {
                return true;
            }
            if (relatedStageRef.current.formIsValidOnSave()) {
                return true;
            }
            return !!relatedStageRef.current?.getLinkedStageValues;
        }),
        map((action: any) => {
            const {
                saveType,
                enrollment,
                buildPayloadArgs,
                relatedStageRef,
                onSaveExternal,
                onSaveSuccessActionType,
                onSaveErrorActionType,
                onSaveSuccessAction,
            } = action.payload;
            const {
                serverRequestEvent,
                linkedEvent,
                relationship,
                linkMode,
            } = buildNewEventPayload({
                buildPayloadArgs,
                state: store.value,
                saveType,
                relatedStageRef,
            });

            const serverData = createServerData({
                serverRequestEvent,
                linkedEvent,
                relationship,
                enrollment,
            });

            return batchActions([
                requestSaveEvent({
                    requestEvent: serverRequestEvent,
                    linkedEvent,
                    relationship,
                    serverData,
                    linkMode,
                    onSaveExternal,
                    onSaveSuccessActionType,
                    onSaveErrorActionType,
                }),

                // stores meta in redux to be used when navigating after save
                setSaveEnrollmentEventInProgress({
                    requestEventId: serverRequestEvent?.event,
                    linkedEventId: linkedEvent?.event,
                    linkedOrgUnitId: linkedEvent?.orgUnit,
                    linkMode,
                }),
                ...(onSaveSuccessAction ? [onSaveSuccessAction] : []),
            ], newEventBatchActionTypes.REQUEST_SAVE_AND_SET_SUBMISSION_IN_PROGRESS);
        }),
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
