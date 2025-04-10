import * as React from 'react';
import { type InputAttribute } from '../../../../DataEntries/EnrollmentRegistrationEntry/hooks/useFormValues';

type RegisterTeiComponentProps = {
    dataEntryId: string;
    onLink: () => void;
    onCancel: () => void;
    onSaveWithoutEnrollment: (teiPayload: Record<string, any>) => void;
    onSaveWithEnrollment: (teiPayload: Record<string, any>) => void;
    onGetUnsavedAttributeValues?: (() => any) | null;
    trackedEntityName: string | null;
    selectedScopeId: string;
    error: any;
    trackedEntityTypeId: string;
    inheritedAttributes: InputAttribute[];
};

export const RegisterTeiComponent = (props: RegisterTeiComponentProps) => {
    const {
        dataEntryId,
        onLink,
        onCancel,
        onSaveWithoutEnrollment,
        onSaveWithEnrollment,
        onGetUnsavedAttributeValues,
        trackedEntityName,
        selectedScopeId,
        error,
        trackedEntityTypeId,
        inheritedAttributes,
    } = props;

    return (
        <div>
            {/* Placeholder for RegisterTeiComponent */}
        </div>
    );
};
