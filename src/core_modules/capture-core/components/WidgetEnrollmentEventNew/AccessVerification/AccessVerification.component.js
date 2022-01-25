// @flow
import React from 'react';
import { useRulesEngineOrgUnit } from '../../../hooks/useRulesEngineOrgUnit';
import { Validated } from '../Validated';
import { NoAccess } from './NoAccess.component';
import type { Props } from './accessVerification.types';

export const AccessVerificationComponent = ({ eventAccess, onCancel, orgUnitId, ...passOnProps }: Props) => {
    const orgUnit = useRulesEngineOrgUnit(orgUnitId);

    if (!eventAccess.write) {
        return (
            <NoAccess
                onCancel={onCancel}
            />
        );
    }

    return orgUnit ? (
        <Validated
            orgUnit={orgUnit}
            onCancel={onCancel}
            {...passOnProps}
        />
    ) : null;
};
