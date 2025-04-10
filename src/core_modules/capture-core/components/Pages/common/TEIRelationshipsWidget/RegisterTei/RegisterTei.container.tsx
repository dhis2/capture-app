import * as React from 'react';
import { useSelector } from 'react-redux';
import { RegisterTei as RegisterTeiComponent } from './RegisterTei.component';
import { type ContainerProps } from './RegisterTei.types';
import { useScopeInfo } from '../../../../../hooks';
import { type InputAttribute } from '../../../../DataEntries/EnrollmentRegistrationEntry/hooks/useFormValues';

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
    const error = useSelector(({ newRelationshipRegisterTei }: { newRelationshipRegisterTei: { error: any } }) => 
        (newRelationshipRegisterTei.error));
    const selectedScopeId = suggestedProgramId || trackedEntityTypeId;
    const { trackedEntityName } = useScopeInfo(selectedScopeId);
    
    const inheritedAttributes: InputAttribute[] = [];
    const isLoadingAttributes = false;

    if (isLoadingAttributes) {
        return null;
    }

    return (
        <RegisterTeiComponent
            dataEntryId={dataEntryId}
            onLink={onLink}
            onCancel={onCancel}
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
