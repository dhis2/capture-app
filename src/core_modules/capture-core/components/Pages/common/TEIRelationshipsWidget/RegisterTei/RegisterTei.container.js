// @flow
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
    teiId,
    trackedEntityTypeId,
    suggestedProgramId,
}: ContainerProps) => {
    const dataEntryId = 'relationship';
    const error = useSelector(({ newRelationshipRegisterTei }) => (newRelationshipRegisterTei.error));
    const selectedScopeId = suggestedProgramId || trackedEntityTypeId;
    const { trackedEntityName } = useScopeInfo(selectedScopeId);
    const {
        inheritedAttributes,
        isLoading: isLoadingAttributes,
    } = useInheritedAttributeValues({
        teiId,
        trackedEntityTypeId,
    });

    if (isLoadingAttributes) {
        return null;
    }

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
            inheritedAttributes={inheritedAttributes}
        />
    );
};

