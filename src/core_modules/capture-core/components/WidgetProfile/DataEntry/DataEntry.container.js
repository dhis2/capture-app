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
    userRoles,
    modalState,
    trackedEntityInstanceId,
    onSaveSuccessActionType,
    onSaveErrorActionType,
    onSaveExternal,
    geometry,
    trackedEntityName,
}: Props) => {
    const dataEntryId = 'trackedEntityProfile';
    const itemId = 'edit';
    const dispatch = useDispatch();
    const [saveAttempted, setSaveAttempted] = useState(false);

    const context = useLifecycle({
        programAPI,
        orgUnitId,
        clientAttributesWithSubvalues,
        userRoles,
        dataEntryId,
        itemId,
        geometry,
    });
    const { formFoundation } = context;
    const { formValidated, errorsMessages, warningsMessages } = useFormValidations(dataEntryId, itemId, saveAttempted);

    const onUpdateFormField = useCallback(
        (...args: Array<any>) => dispatch(getUpdateFieldActions(context, ...args)),
        [dispatch, context],
    );
    const onUpdateFormFieldAsync = useCallback(
        (innerAction: ReduxAction<any, any>) => {
            dispatch(innerAction);
        },
        [dispatch],
    );
    const getValidationContext = useCallback(
        () => ({
            programId: programAPI.id,
            orgUnitId,
            trackedEntityInstanceId,
            trackedEntityTypeId: programAPI.trackedEntityType.id,
        }),
        [programAPI, orgUnitId, trackedEntityInstanceId],
    );

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
                onUpdateFormFieldAsync={onUpdateFormFieldAsync}
                modalState={modalState}
                onGetValidationContext={getValidationContext}
                errorsMessages={errorsMessages}
                warningsMessages={warningsMessages}
                orgUnit={{ id: orgUnitId }}
            />
        )
    );
};
