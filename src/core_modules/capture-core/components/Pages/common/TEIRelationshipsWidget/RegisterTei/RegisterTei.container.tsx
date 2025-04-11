import React from 'react';
import { useSelector } from 'react-redux';
import { RegisterTeiComponent } from './RegisterTei.component';
import type { ContainerProps } from './RegisterTei.types';
import { useScopeInfo } from '../../../../../hooks';
import { useInheritedAttributeValues } from '../useInheritedAttributeValues';

export const RegisterTei = ({
    onLink,
    onSave,
    onGetUnsavedAttributeValues,
    onCancel,
    teiId,
    trackedEntityTypeId,
    suggestedProgramId,
}: ContainerProps): React.ReactElement | null => {
    const dataEntryId = 'relationship';
    const error = useSelector(({ newRelationshipRegisterTei }: { newRelationshipRegisterTei: { error: string } }) =>
        (newRelationshipRegisterTei.error));
    const selectedScopeId = suggestedProgramId ?? trackedEntityTypeId;
    const { trackedEntityName } = useScopeInfo(selectedScopeId);
    const { inheritedAttributes, isLoading: isLoadingAttributes } = useInheritedAttributeValues({
        teiId,
        trackedEntityTypeId,
        programId: suggestedProgramId,
    });

    if (isLoadingAttributes) {
        return null;
    }

    return (
        <RegisterTeiComponent
            dataEntryId={dataEntryId}
            onLink={onLink}
            onCancel={onCancel}
            onSaveWithoutEnrollment={(teiPayload?: Record<string, any>) => onSave(teiPayload as Record<string, any>)}
            onSaveWithEnrollment={(teiPayload?: Record<string, any>) => onSave(teiPayload as Record<string, any>)}
            onGetUnsavedAttributeValues={onGetUnsavedAttributeValues}
            trackedEntityName={trackedEntityName}
            selectedScopeId={selectedScopeId}
            error={error}
            trackedEntityTypeId={trackedEntityTypeId}
            inheritedAttributes={inheritedAttributes}
        />
    );
};
