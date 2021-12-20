// @flow
import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { Props } from './dataEntry.types';
import { DataEntryComponent } from './DataEntry.component';
import { useLifecycle } from './hooks';
import { getUpdateFieldActions } from './dataEntry.actions';

export const DataEntryProfile = ({ programAPI, orgUnitId, onCancel, toggleEditModal, trackedEntityInstanceAttributes }: Props) => {
    const dataEntryId = 'trackedEntityProfile';
    const itemId = 'edit';
    const dispatch = useDispatch();
    const [saveAttempted, setSaveAttempted] = useState(false);

    const dataEntryContext = useLifecycle({
        programAPI,
        orgUnitId,
        trackedEntityInstanceAttributes,
        dataEntryId,
        itemId,
        toggleEditModal,
    });
    const { trackedEntityName, ...context } = dataEntryContext;
    const onUpdateFormField = useCallback((...args: Array<any>) => dispatch(getUpdateFieldActions(context, ...args)), [dispatch, context]);

    return (
        <DataEntryComponent
            dataEntryId={dataEntryId}
            itemId={itemId}
            onCancel={onCancel}
            onSave={() => setSaveAttempted(true)}
            saveAttempted={saveAttempted}
            toggleEditModal={toggleEditModal}
            trackedEntityName={trackedEntityName}
            formFoundation={context.formFoundation}
            onUpdateFormField={onUpdateFormField}
        />
    );
};
