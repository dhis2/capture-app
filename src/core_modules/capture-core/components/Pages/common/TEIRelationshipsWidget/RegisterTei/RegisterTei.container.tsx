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
}: ContainerProps) => {
    const dataEntryId = 'relationship';
    const error = useSelector((state: any) => state.newRelationshipRegisterTei.error);
    const selectedScopeId = suggestedProgramId || trackedEntityTypeId;
    const { trackedEntityName } = useScopeInfo(selectedScopeId);
    const { inheritedAttributes, isLoading: isLoadingAttributes } = useInheritedAttributeValues({
        teiId,
        trackedEntityTypeId,
    } as any);

    if (isLoadingAttributes) {
        return null;
    }

    return React.createElement(RegisterTeiComponent as any, {
        dataEntryId,
        onLink,
        onCancel,
        onSaveWithoutEnrollment: onSave,
        onSaveWithEnrollment: onSave,
        onGetUnsavedAttributeValues,
        trackedEntityName,
        selectedScopeId,
        error,
        trackedEntityTypeId,
        inheritedAttributes,
    });
};
