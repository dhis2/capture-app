// @flow
import React from 'react';
import type { ComponentType } from 'react';
import { EnrollmentRegistrationEntryComponent } from './EnrollmentRegistrationEntry.component';
import type { OwnProps } from './EnrollmentRegistrationEntry.types';
import { useLifecycle } from './hooks';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import { useRulesEngineOrgUnit } from '../../../hooks/useRulesEngineOrgUnit';

export const EnrollmentRegistrationEntry: ComponentType<OwnProps> = ({
    selectedScopeId,
    id,
    trackedEntityInstanceAttributes,
    ...passOnProps
}) => {
    const orgUnitId = useCurrentOrgUnitInfo().id;
    const orgUnit = useRulesEngineOrgUnit(orgUnitId);
    const { teiId, ready, skipDuplicateCheck } = useLifecycle(selectedScopeId, id, trackedEntityInstanceAttributes, orgUnit);

    return (
        <EnrollmentRegistrationEntryComponent
            {...passOnProps}
            selectedScopeId={selectedScopeId}
            id={id}
            ready={ready}
            teiId={teiId}
            skipDuplicateCheck={skipDuplicateCheck}
            orgUnitId={orgUnitId}
            orgUnit={orgUnit}
        />
    );
};
