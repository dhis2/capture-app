// @flow
import React from 'react';
import { OrgUnitFetcher } from '../OrgUnitFetcher/OrgUnitFetcher.component';
import { NoAccess } from './NoAccess.component';
import type { Props } from './accessVerification.types';

export const AccessVerificationComponent = ({ eventAccess, onCancel, ...passOnProps }: Props) => {
    if (!eventAccess.write) {
        return (
            <NoAccess
                onCancel={onCancel}
            />
        );
    }

    return (
        <OrgUnitFetcher
            onCancel={onCancel}
            {...passOnProps}
        />
    );
};
