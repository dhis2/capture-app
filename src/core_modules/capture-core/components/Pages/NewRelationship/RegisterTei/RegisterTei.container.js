// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import { useScopeInfo } from '../../../../hooks/useScopeInfo';
import { RegisterTeiComponent } from './RegisterTei.component';
import type { OwnProps } from './RegisterTei.types';

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

