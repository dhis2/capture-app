// @flow
import React from 'react';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../metaData';
import { EnrollmentDataEntry } from '../Enrollment';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import { useRegistrationFormInfoForSelectedScope } from '../common/useRegistrationFormInfoForSelectedScope';
import type { OwnProps } from './EnrollmentRegistrationEntry.types';

export const EnrollmentRegistrationEntryComponent = ({ selectedScopeId, id, ...rest }: OwnProps) => {
    const { scopeType } = useScopeInfo(selectedScopeId);
    const { formId, registrationMetaData, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
    const orgUnit = useCurrentOrgUnitInfo();

    return (
        <>
            {
                scopeType === scopeTypes.TRACKER_PROGRAM && formId &&
                <EnrollmentDataEntry
                    orgUnit={orgUnit}
                    programId={selectedScopeId}
                    formFoundation={formFoundation}
                    enrollmentMetadata={registrationMetaData}
                    id={id}
                    {...rest}
                />
            }
        </>
    );
};
