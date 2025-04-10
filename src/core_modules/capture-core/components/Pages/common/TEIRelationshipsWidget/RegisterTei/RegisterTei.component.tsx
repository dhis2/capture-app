import * as React from 'react';
import { type InputAttribute } from '../../../../DataEntries/EnrollmentRegistrationEntry/hooks/useFormValues';

import { type ComponentProps } from './RegisterTei.types';

type RegisterTeiComponentProps = ComponentProps;

export const RegisterTei = (props: RegisterTeiComponentProps) => {
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
