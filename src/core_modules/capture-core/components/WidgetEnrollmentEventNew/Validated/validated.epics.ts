import { ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators';
import { mapToInnerAction, filterRejected } from 'capture-core-utils/epics';
import {
    newEventBatchActionTypes,
    newEventWidgetActionTypes,
    newEnrollmentActionTypes,
    saveEvents,
} from './validated.actions';
import { getRulesActions } from '../DataEntry';
import type { GetRulesActionsMain } from '../DataEntry/helpers/getRulesActions';

export const openRegisterNewEnrollmentPageEpic = (action$: any, store: any) =>
    action$.pipe(
        ofType(newEventBatchActionTypes.INITIALIZE_REGISTER_ENROLLMENT_PAGE),
        map(action =>
            mapToInnerAction(
                action,
                newEventBatchActionTypes.INITIALIZE_REGISTER_ENROLLMENT_PAGE,
                newEnrollmentActionTypes.NEW_ENROLLMENT_INITIAL_RULE_EXECUTION,
            ),
        ),
        mergeMap((action: { payload: GetRulesActionsMain }) =>
            filterRejected(getRulesActions({
                state: store.value,
                ...action.payload,
            })),
        ),
    );

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
