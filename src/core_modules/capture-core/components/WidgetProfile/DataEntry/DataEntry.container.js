// @flow
import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { Props } from './dataEntry.types';
import { DataEntryComponent } from './DataEntry.component';
import { useLifecycle, useFormValidations } from './hooks';
import { getUpdateFieldActions, updateTeiRequest, setTeiModalState, TEI_MODAL_STATE } from './dataEntry.actions';

export const DataEntry = ({
    programAPI,
    orgUnitId,
    onCancel,
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
    const { formValidated, errorsMessages, warningsMessages } = useFormValidations(dataEntryId, itemId, saveAttempted);

    const onGetValidationContext = useCallback(() => ({ orgUnitId, programId: programAPI.id, trackedEntityInstanceId }), [orgUnitId, programAPI, trackedEntityInstanceId]);
    const onUpdateFormField = useCallback((...args: Array<any>) => dispatch(getUpdateFieldActions(context, ...args)), [dispatch, context]);
    const onSave = useCallback(() => {
        setSaveAttempted(true);
        if (formValidated) {
            dispatch(setTeiModalState(TEI_MODAL_STATE.OPEN_DISABLE));
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
        onSaveExternal,
        onSaveSuccessActionType,
        onSaveErrorActionType,
    ]);

    return (
        Object.entries(context.formFoundation).length > 0 && (
            <DataEntryComponent
                dataEntryId={dataEntryId}
                itemId={itemId}
                onCancel={onCancel}
                onSave={onSave}
                saveAttempted={saveAttempted}
                trackedEntityName={trackedEntityName}
                formFoundation={context.formFoundation}
                onUpdateFormField={onUpdateFormField}
                modalState={modalState}
                onGetValidationContext={onGetValidationContext}
                errorsMessages={errorsMessages}
                warningsMessages={warningsMessages}
            />
        )
    );
};
