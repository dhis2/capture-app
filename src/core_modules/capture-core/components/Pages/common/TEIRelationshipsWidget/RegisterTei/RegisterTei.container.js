// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import { RegisterTeiComponent } from './RegisterTei.component';
import type { OwnProps } from './RegisterTei.types';
import { useScopeInfo } from '../../../../../hooks/useScopeInfo';

export const RegisterTei = ({
    onLink,
    onSave,
    onGetUnsavedAttributeValues,
    trackedEntityTypeId,
    suggestedProgramId,
}: OwnProps) => {
    const dataEntryId = 'relationship';
    const itemId = useSelector(({ dataEntries }) => dataEntries[dataEntryId]?.itemId);
    const error = useSelector(({ newRelationshipRegisterTei }) => (newRelationshipRegisterTei.error));
    const newRelationshipProgramId = suggestedProgramId || trackedEntityTypeId;
    const { trackedEntityName } = useScopeInfo(newRelationshipProgramId);

    return (
        <RegisterTeiComponent
            dataEntryId={dataEntryId}
            itemId={itemId}
            onLink={onLink}
            onSave={onSave}
            onGetUnsavedAttributeValues={onGetUnsavedAttributeValues}
            trackedEntityName={trackedEntityName}
            newRelationshipProgramId={newRelationshipProgramId}
            error={error}
            trackedEntityTypeId={trackedEntityTypeId}
        />
    );
};

