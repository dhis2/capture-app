// @flow
import React from 'react';
import type { ComponentType } from 'react';
import { useSelector } from 'react-redux';

import { EnrollmentRegistrationEntryComponent } from './EnrollmentRegistrationEntry.component';
import type { OwnProps } from './EnrollmentRegistrationEntry.types';
import { useLifecycle } from './hooks';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import { useRulesEngineOrgUnit } from '../../../hooks/useRulesEngineOrgUnit';
import { dataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';

export const EnrollmentRegistrationEntry: ComponentType<OwnProps> = ({
    selectedScopeId,
    id,
    trackedEntityInstanceAttributes,
    ...passOnProps
}) => {
    const orgUnitId = useCurrentOrgUnitInfo().id;
    const { orgUnit, error } = useRulesEngineOrgUnit(orgUnitId);
    const { teiId, ready, skipDuplicateCheck } = useLifecycle(selectedScopeId, id, trackedEntityInstanceAttributes, orgUnit);

    if (error) {
        return error.errorComponent;
    }
    const isUserInteractionInProgress: boolean = useSelector(
        state =>
            dataEntryHasChanges(state, 'newPageDataEntryId-newEnrollment')
          || dataEntryHasChanges(state, 'newPageDataEntryId-newTei'),
    );

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
            isUserInteractionInProgress={isUserInteractionInProgress}
        />
    );
};
