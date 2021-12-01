// @flow
import React from 'react';
import { Validated } from '../Validated';
import type { Props } from './accessVerification.types';
import { NoAccess } from './NoAccess.component';

export const AccessVerificationComponent = ({ eventAccess, onCancel, ...passOnProps }: Props) => {
    if (!eventAccess.write) {
        return (
            <NoAccess
                onCancel={onCancel}
            />
        );
    }

    return (
        // $FlowFixMe
        <Validated
            {...passOnProps}
            onCancel={onCancel}
        />
    );
};
