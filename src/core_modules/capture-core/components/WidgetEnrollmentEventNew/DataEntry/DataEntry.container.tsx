import React, { useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import type { ReduxAction } from 'capture-core-utils/types';
import { DataEntryComponent } from './DataEntry.component';
import { startRunRulesPostUpdateField, getDataEntryKey } from '../../DataEntry';
import {
    startAsyncUpdateFieldForNewEvent,
    executeRulesOnUpdateForNewEvent,
    newEventWidgetDataEntryBatchActionTypes,
    setNewEventSaveTypes,
    addNewEventNote,
} from './actions/dataEntry.actions';
import type { AddEventSaveType } from './addEventSaveTypes';
import type { ContainerProps } from './dataEntry.types';
import { useProgramExpiryForUser } from '../../../hooks';

export const DataEntry = ({ rulesExecutionDependenciesClientFormatted, id, ...passOnProps }: ContainerProps) => {
    const dispatch = useDispatch();
    const { programId } = useSelector(({ currentSelections }: any) => currentSelections);
    const dataEntryItemId = useSelector(({ dataEntries }: any) => dataEntries[id] && dataEntries[id].itemId);
    const dataEntryKey = getDataEntryKey(id, dataEntryItemId);
    const orgUnitFieldValue = useSelector(({ dataEntriesFieldsValue }: any) => dataEntriesFieldsValue[dataEntryKey].orgUnit);
    const expiryPeriod = useProgramExpiryForUser(programId);
    const onUpdateDataEntryField = useCallback((innerAction: ReduxAction<any, any>) => {
        const { dataEntryId, itemId } = innerAction.payload;
        const uid = uuid();

        dispatch(batchActions([
            innerAction,
            startRunRulesPostUpdateField(dataEntryId, itemId, uid),
            executeRulesOnUpdateForNewEvent({ ...innerAction.payload, uid, rulesExecutionDependenciesClientFormatted }),
        ], newEventWidgetDataEntryBatchActionTypes.UPDATE_DATA_ENTRY_FIELD_ADD_EVENT_ACTION_BATCH));
    }, [dispatch, rulesExecutionDependenciesClientFormatted]);

    const onUpdateField = useCallback((innerAction: ReduxAction<any, any>) => {
        const { dataEntryId, itemId } = innerAction.payload;
        const uid = uuid();

        dispatch(batchActions([
            innerAction,
            startRunRulesPostUpdateField(dataEntryId, itemId, uid),
            executeRulesOnUpdateForNewEvent({ ...innerAction.payload, uid, rulesExecutionDependenciesClientFormatted }),
        ], newEventWidgetDataEntryBatchActionTypes.FIELD_UPDATE_BATCH));
    }, [dispatch, rulesExecutionDependenciesClientFormatted]);

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
                executeRulesOnUpdateForNewEvent({
                    ...successInnerAction.payload,
                    dataEntryId,
                    itemId,
                    uid,
                    rulesExecutionDependenciesClientFormatted,
                }),
            ], newEventWidgetDataEntryBatchActionTypes.FIELD_UPDATE_BATCH);
        };
        const onAsyncUpdateError = (errorInnerAction: ReduxAction<any, any>) => errorInnerAction;

        dispatch(startAsyncUpdateFieldForNewEvent(innerAction, onAsyncUpdateSuccess, onAsyncUpdateError));
    }, [dispatch, rulesExecutionDependenciesClientFormatted]);

    const onAddNote = useCallback((itemId: string, dataEntryId: string, note: string) => {
        dispatch(addNewEventNote(itemId, dataEntryId, note));
    }, [dispatch]);

    const onSetSaveTypes = useCallback((newSaveTypes: AddEventSaveType[] | null) => {
        dispatch(setNewEventSaveTypes(newSaveTypes));
    }, [dispatch]);
    return (
        <DataEntryComponent
            {...passOnProps}
            id={id}
            orgUnitFieldValue={orgUnitFieldValue}
            programId={programId}
            expiryPeriod={expiryPeriod}
            onUpdateDataEntryField={onUpdateDataEntryField}
            onUpdateField={onUpdateField}
            onStartAsyncUpdateField={onStartAsyncUpdateField}
            onAddNote={onAddNote}
            onSetSaveTypes={onSetSaveTypes}
        />
    );
};
