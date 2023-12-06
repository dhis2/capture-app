// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import { RegisterTeiComponent } from './RegisterTei.component';
import type { OwnProps } from './RegisterTei.types';
import { useScopeInfo } from '../../../../hooks/useScopeInfo';

const useNewRelationshipScopeId = (): string =>
    useSelector(
        ({
            newRelationshipRegisterTei: {
                programId,
            },
            newRelationship: {
                selectedRelationshipType: { to: { trackedEntityTypeId } },
            },
        }) => (programId || trackedEntityTypeId),
    );

export const RegisterTei = ({ onLink, onSave, onCancel, onGetUnsavedAttributeValues }: OwnProps) => {
    const dataEntryId = 'relationship';
    const itemId = useSelector(({ dataEntries }) => dataEntries[dataEntryId]?.itemId);
    const error = useSelector(({ newRelationshipRegisterTei }) => (newRelationshipRegisterTei.error));
    const newRelationshipProgramId = useNewRelationshipScopeId();
    const { trackedEntityName } = useScopeInfo(newRelationshipProgramId);

    return (
        <RegisterTeiComponent
            dataEntryId={dataEntryId}
            itemId={itemId}
            onLink={onLink}
            onSave={onSave}
            onCancel={onCancel}
            onGetUnsavedAttributeValues={onGetUnsavedAttributeValues}
            trackedEntityName={trackedEntityName}
            newRelationshipProgramId={newRelationshipProgramId}
            error={error}
        />
    );
};

