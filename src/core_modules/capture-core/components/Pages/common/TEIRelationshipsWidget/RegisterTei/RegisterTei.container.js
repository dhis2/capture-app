// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import { RegisterTeiComponent } from './RegisterTei.component';
import type { ContainerProps } from './RegisterTei.types';
import { useScopeInfo } from '../../../../../hooks/useScopeInfo';

export const RegisterTei = ({
    onLink,
    onSave,
    onGetUnsavedAttributeValues,
    trackedEntityTypeId,
    suggestedProgramId,
}: ContainerProps) => {
    const dataEntryId = 'relationship';
    // const itemId = useSelector(({ dataEntries }) => dataEntries[dataEntryId]?.itemId);
    const error = useSelector(({ newRelationshipRegisterTei }) => (newRelationshipRegisterTei.error));
    const selectedScopeId = suggestedProgramId || trackedEntityTypeId;
    const { trackedEntityName } = useScopeInfo(selectedScopeId);

    return (
        <RegisterTeiComponent
            dataEntryId={dataEntryId}
            onLink={onLink}
            onSaveWithoutEnrollment={onSave}
            onSaveWithEnrollment={onSave}
            onGetUnsavedAttributeValues={onGetUnsavedAttributeValues}
            trackedEntityName={trackedEntityName}
            selectedScopeId={selectedScopeId}
            error={error}
            trackedEntityTypeId={trackedEntityTypeId}
        />
    );
};

