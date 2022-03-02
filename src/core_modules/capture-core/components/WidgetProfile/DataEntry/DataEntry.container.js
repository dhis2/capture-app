// @flow
import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { Props } from './dataEntry.types';
import { DataEntryComponent } from './DataEntry.component';
import { useLifecycle, useFormValidations } from './hooks';
import { getUpdateFieldActions, updateTeiRequest, setTeiModalError } from './dataEntry.actions';

export const DataEntry = ({
    programAPI,
    orgUnitId,
    onCancel,
    onDisable,
    clientAttributesWithSubvalues,
    modalState,
    trackedEntityInstanceId,
    onSaveSuccessActionType,
    onSaveErrorActionType,
    onSaveExternal,
}: Props) => {
    const dataEntryId = 'trackedEntityProfile';
    const itemId = 'edit';
    const dispatch = useDispatch();
    const [saveAttempted, setSaveAttempted] = useState(false);

    const dataEntryContext = useLifecycle({
        programAPI,
        orgUnitId,
        clientAttributesWithSubvalues,
        dataEntryId,
        itemId,
    });
    const { trackedEntityName, ...context } = dataEntryContext;
    const { formFoundation } = context;
    const { formValidated, errorsMessages, warningsMessages } = useFormValidations(dataEntryId, itemId, saveAttempted);

    const onUpdateFormField = useCallback((...args: Array<any>) => dispatch(getUpdateFieldActions(context, ...args)), [dispatch, context]);
    const getValidationContext = useCallback(() => ({
        programId: programAPI.id,
        orgUnitId,
        trackedEntityInstanceId,
    }), [programAPI, orgUnitId, trackedEntityInstanceId]);

    const onSave = useCallback(() => {
        setSaveAttempted(true);
        if (formValidated) {
            onDisable();
            dispatch(setTeiModalError(false));
            dispatch(
                updateTeiRequest({
                    itemId,
                    dataEntryId,
                    orgUnitId,
                    trackedEntityInstanceId,
                    trackedEntityTypeId: programAPI.trackedEntityType.id,
                    onSaveExternal,
                    onSaveSuccessActionType,
                    onSaveErrorActionType,
                    formFoundation,
                }),
            );
        }
    }, [
        dispatch,
        itemId,
        dataEntryId,
        orgUnitId,
        trackedEntityInstanceId,
        programAPI,
        formValidated,
        formFoundation,
        onSaveExternal,
        onSaveSuccessActionType,
        onSaveErrorActionType,
        onDisable,
    ]);

    return (
        Object.entries(formFoundation).length > 0 && (
            <DataEntryComponent
                dataEntryId={dataEntryId}
                itemId={itemId}
                onCancel={onCancel}
                onSave={onSave}
                saveAttempted={saveAttempted}
                trackedEntityName={trackedEntityName}
                formFoundation={formFoundation}
                onUpdateFormField={onUpdateFormField}
                modalState={modalState}
                onGetValidationContext={getValidationContext}
                errorsMessages={errorsMessages}
                warningsMessages={warningsMessages}
            />
        )
    );
};
