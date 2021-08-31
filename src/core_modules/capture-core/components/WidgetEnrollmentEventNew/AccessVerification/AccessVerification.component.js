// @flow
import React from 'react';
import { Validated } from '../Validated';
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
        <Validated
            {...passOnProps}
            onCancel={onCancel}
        />
    );
};
