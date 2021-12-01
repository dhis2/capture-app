// @flow
import uuid from 'uuid/v4';
import { batchActions } from 'redux-batched-actions';
import { useDispatch } from 'react-redux';
import React, { useCallback } from 'react';
import { startRunRulesPostUpdateField } from '../../DataEntry';
import type { ContainerProps } from './dataEntry.types';
import { DataEntryComponent } from './DataEntry.component';
import typeof { addEventSaveTypes } from './addEventSaveTypes';
import {
    startAsyncUpdateFieldForNewEvent,
    executeRulesOnUpdateForNewEvent,
    newEventWidgetDataEntryBatchActionTypes,
    setNewEventSaveTypes,
    addNewEventNote,
} from './actions/dataEntry.actions';

export const DataEntry = ({ orgUnit, rulesExecutionDependenciesClientFormatted, ...passOnProps }: ContainerProps) => {
    const dispatch = useDispatch();

    const onUpdateDataEntryField = useCallback((innerAction: ReduxAction<any, any>) => {
        const { dataEntryId, itemId } = innerAction.payload;
        const uid = uuid();

        dispatch(batchActions([
            innerAction,
            startRunRulesPostUpdateField(dataEntryId, itemId, uid),
            executeRulesOnUpdateForNewEvent({ ...innerAction.payload, uid, orgUnit, rulesExecutionDependenciesClientFormatted }),
        ], newEventWidgetDataEntryBatchActionTypes.UPDATE_DATA_ENTRY_FIELD_ADD_EVENT_ACTION_BATCH));
    }, [dispatch, orgUnit, rulesExecutionDependenciesClientFormatted]);

    const onUpdateField = useCallback((innerAction: ReduxAction<any, any>) => {
        const { dataEntryId, itemId } = innerAction.payload;
        const uid = uuid();

        dispatch(batchActions([
            innerAction,
            startRunRulesPostUpdateField(dataEntryId, itemId, uid),
            executeRulesOnUpdateForNewEvent({ ...innerAction.payload, uid, orgUnit, rulesExecutionDependenciesClientFormatted }),
        ], newEventWidgetDataEntryBatchActionTypes.FIELD_UPDATE_BATCH));
    }, [dispatch, orgUnit, rulesExecutionDependenciesClientFormatted]);

    const onStartAsyncUpdateField = useCallback((
        innerAction: ReduxAction<any, any>,
        dataEntryId: string,
        itemId: string,
    ) => {
        const onAsyncUpdateSuccess = (successInnerAction: ReduxAction<any, any>) => {
            const uid = uuid();
            return batchActions([
                successInnerAction,
                startRunRulesPostUpdateField(dataEntryId, itemId, uid),
                executeRulesOnUpdateForNewEvent({ ...successInnerAction.payload, dataEntryId, itemId, uid, orgUnit, rulesExecutionDependenciesClientFormatted }),
            ], newEventWidgetDataEntryBatchActionTypes.FIELD_UPDATE_BATCH);
        };
        const onAsyncUpdateError = (errorInnerAction: ReduxAction<any, any>) => errorInnerAction;

        dispatch(startAsyncUpdateFieldForNewEvent(innerAction, onAsyncUpdateSuccess, onAsyncUpdateError));
    }, [dispatch, orgUnit, rulesExecutionDependenciesClientFormatted]);

    const onAddNote = useCallback((itemId: string, dataEntryId: string, note: string) => {
        dispatch(addNewEventNote(itemId, dataEntryId, note));
    }, [dispatch]);

    const onSetSaveTypes = useCallback((newSaveTypes: ?Array<$Values<addEventSaveTypes>>) => {
        dispatch(setNewEventSaveTypes(newSaveTypes));
    }, [dispatch]);

    return (
        <DataEntryComponent
            {...passOnProps}
            onUpdateDataEntryField={onUpdateDataEntryField}
            onUpdateField={onUpdateField}
            onStartAsyncUpdateField={onStartAsyncUpdateField}
            onAddNote={onAddNote}
            onSetSaveTypes={onSetSaveTypes}
        />
    );
};
