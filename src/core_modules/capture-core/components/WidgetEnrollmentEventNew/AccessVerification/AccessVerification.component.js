// @flow
import React from 'react';
import { withOrganisationUnit } from 'capture-core/HOC'
import { Validated } from '../Validated';
import { NoAccess } from './NoAccess.component';
import type { Props } from './accessVerification.types';

export const AccessVerificationComponent = ({ eventAccess, onCancel, widgetReducerName, orgUnitId, ...passOnProps }: Props) => {
    if (!eventAccess.write) {
        return (
            <NoAccess
                onCancel={onCancel}
            />
        );
    }

    const OrgUnitHOC = withOrganisationUnit(Validated, orgUnitId);

    return (
        <OrgUnitHOC
            {...passOnProps}
            onCancel={onCancel}
        />
    );
};
