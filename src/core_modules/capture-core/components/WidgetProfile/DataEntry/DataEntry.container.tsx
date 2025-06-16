import { v4 as uuid } from 'uuid';
import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useDataEngine } from '@dhis2/app-runtime';
import { makeQuerySingleResource } from 'capture-core/utils/api';
import type { Props } from './dataEntry.types';
import { DataEntryComponent } from './DataEntry.component';
import { useLifecycle, useFormValidations } from './hooks';
import { getUpdateFieldActions, updateTeiRequest, setTeiModalError } from './dataEntry.actions';
import { startRunRulesPostUpdateField } from '../../DataEntry';

type ReduxAction<Payload, Meta> = {
    type: string;
    payload: Payload;
    meta: Meta;
};

export const DataEntry = ({
    programAPI,
    orgUnitId,
    onCancel,
    onDisable,
    onEnable,
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
        geometry: geometry ?? null,
        dataEntryFormConfig: dataEntryFormConfig ?? null,
    });
    const { formFoundation } = context;
    const { formValidated, errorsMessages, warningsMessages } = useFormValidations(dataEntryId, itemId, saveAttempted);

    const onUpdateFormField = useCallback(
        (innerAction: ReduxAction<any, any>) => {
            const uid = uuid();
            onDisable();
            dispatch(startRunRulesPostUpdateField(dataEntryId, itemId, uid));

            getUpdateFieldActions({ context, querySingleResource, onGetValidationContext, innerAction, uid }).then(
                (actions) => {
                    onEnable();
                    return dispatch(actions);
                },
            );
        },
        [dispatch, querySingleResource, context, onGetValidationContext, onDisable, onEnable],
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
