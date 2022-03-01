// @flow
import React from 'react';
import type { ComponentType } from 'react';
import { EnrollmentRegistrationEntryComponent } from './EnrollmentRegistrationEntry.component';
import type { OwnProps } from './EnrollmentRegistrationEntry.types';
import { useLifecycle } from './hooks';

export const EnrollmentRegistrationEntry: ComponentType<OwnProps> = ({ selectedScopeId, id, ...passOnProps }) => {
    const { teiId, ready, skipDuplicateCheck } = useLifecycle(selectedScopeId, id);

    return <EnrollmentRegistrationEntryComponent {...passOnProps} selectedScopeId={selectedScopeId} id={id} ready={ready} teiId={teiId} skipDuplicateCheck={skipDuplicateCheck} />;
};
