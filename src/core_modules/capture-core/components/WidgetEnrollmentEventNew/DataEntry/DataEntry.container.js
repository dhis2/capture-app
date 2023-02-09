// @flow
import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { DataEntryComponent } from './DataEntry.component';
import { startRunRulesPostUpdateField } from '../../DataEntry';
import {
    startAsyncUpdateFieldForNewEvent,
    executeRulesOnUpdateForNewEvent,
    newEventWidgetDataEntryBatchActionTypes,
    setNewEventSaveTypes,
    addNewEventNote,
    updateCatCombo,
    removeCatCombo,
} from './actions/dataEntry.actions';
import typeof { addEventSaveTypes } from './addEventSaveTypes';
import type { ContainerProps } from './dataEntry.types';

export const DataEntry = ({ orgUnit, rulesExecutionDependenciesClientFormatted, ...passOnProps }: ContainerProps) => {
    const dispatch = useDispatch();
    const { orgUnitId } = useSelector(({ currentSelections }) => currentSelections);
    const dataValues = useSelector(({ dataEntriesFieldsValue }) => dataEntriesFieldsValue?.[`${passOnProps.id}-${passOnProps.itemId}`]);
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

    const onClickCategoryOption = useCallback((option: Object, categoryId: string) => {
        const value = { [categoryId]: option };
        const { id, itemId } = passOnProps;
        const valueMeta = {
            isValid: true,
            touched: true,
        };
        dispatch(updateCatCombo(value, valueMeta, id, itemId));
    }, [dispatch, passOnProps]);

    const onResetCategoryOption = useCallback((categoryId: string) => {
        const { id, itemId } = passOnProps;
        dispatch(removeCatCombo(categoryId, id, itemId));
    }, [dispatch, passOnProps]);

    return (
        <DataEntryComponent
            {...passOnProps}
            selectedCategories={dataValues?.attributeCategoryOptions}
            orgUnitId={orgUnitId}
            onUpdateDataEntryField={onUpdateDataEntryField}
            onUpdateField={onUpdateField}
            onStartAsyncUpdateField={onStartAsyncUpdateField}
            onAddNote={onAddNote}
            onSetSaveTypes={onSetSaveTypes}
            onClickCategoryOption={onClickCategoryOption}
            onResetCategoryOption={onResetCategoryOption}
        />
    );
};
