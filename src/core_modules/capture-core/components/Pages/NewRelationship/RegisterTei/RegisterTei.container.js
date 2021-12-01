// @flow
import { useSelector } from 'react-redux';
import React from 'react';
import { useScopeInfo } from '../../../../hooks/useScopeInfo';
import type { OwnProps } from './RegisterTei.types';
import { RegisterTeiComponent } from './RegisterTei.component';

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

export const RegisterTei = ({ onLink, onSave, onGetUnsavedAttributeValues }: OwnProps) => {
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
            onGetUnsavedAttributeValues={onGetUnsavedAttributeValues}
            trackedEntityName={trackedEntityName}
            newRelationshipProgramId={newRelationshipProgramId}
            error={error}
        />);
};

