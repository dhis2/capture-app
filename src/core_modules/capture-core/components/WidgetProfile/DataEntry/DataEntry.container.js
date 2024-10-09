// @flow
import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useDataEngine } from '@dhis2/app-runtime';
import { makeQuerySingleResource } from 'capture-core/utils/api';
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
    dataEntryFormConfig,
}: Props) => {
    const dataEntryId = 'trackedEntityProfile';
    const itemId = 'edit';
    const dataEngine = useDataEngine();
    const querySingleResource = makeQuerySingleResource(dataEngine.query.bind(dataEngine));
    const dispatch = useDispatch();
    const [saveAttempted, setSaveAttempted] = useState(false);

    const onGetValidationContext = useCallback(
        () => ({
            programId: programAPI.id,
            orgUnitId,
            trackedEntityInstanceId,
            trackedEntityTypeId: programAPI.trackedEntityType.id,
        }),
        [programAPI, orgUnitId, trackedEntityInstanceId],
    );

    const context = useLifecycle({
        programAPI,
        orgUnitId,
        clientAttributesWithSubvalues,
        userRoles,
        dataEntryId,
        itemId,
        geometry,
        dataEntryFormConfig,
        onGetValidationContext,
    });
    const { formFoundation } = context;
    const { formValidated, errorsMessages, warningsMessages } = useFormValidations(dataEntryId, itemId, saveAttempted);

    const onUpdateFormField = useCallback(
        (innerAction: ReduxAction<any, any>) => {
            getUpdateFieldActions({ context, querySingleResource, onGetValidationContext, innerAction }).then(actions =>
                dispatch(actions),
            );
        },
        [dispatch, querySingleResource, context, onGetValidationContext],
    );
    const onUpdateFormFieldAsync = useCallback(
        (innerAction: ReduxAction<any, any>) => {
            dispatch(innerAction);
        },
        [dispatch],
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
                onGetValidationContext={onGetValidationContext}
                errorsMessages={errorsMessages}
                warningsMessages={warningsMessages}
                orgUnit={{ id: orgUnitId }}
            />
        )
    );
};
