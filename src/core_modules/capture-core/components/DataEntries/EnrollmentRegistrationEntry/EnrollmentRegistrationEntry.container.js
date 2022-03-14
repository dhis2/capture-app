// @flow
import React from 'react';
import type { ComponentType } from 'react';
import { EnrollmentRegistrationEntryComponent } from './EnrollmentRegistrationEntry.component';
import type { OwnProps } from './EnrollmentRegistrationEntry.types';
import { useLifecycle } from './hooks';

export const EnrollmentRegistrationEntry: ComponentType<OwnProps> = ({
    selectedScopeId,
    id,
    trackedEntityInstanceAttributes,
    ...passOnProps
}) => {
    const { teiId, ready, skipDuplicateCheck } = useLifecycle(selectedScopeId, id, trackedEntityInstanceAttributes);

    return (
        <EnrollmentRegistrationEntryComponent
            {...passOnProps}
            selectedScopeId={selectedScopeId}
            id={id}
            ready={ready}
            teiId={teiId}
            skipDuplicateCheck={skipDuplicateCheck}
        />
    );
};
