import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { OrgUnitFetcher } from '../OrgUnitFetcher/OrgUnitFetcher.component';
import { NoWriteAccessMessage } from '../../NoWriteAccessMessage';
import type { Props } from './accessVerification.types';

export const AccessVerificationComponent = ({ eventAccess, onCancel, ...passOnProps }: Props) => {
    if (!eventAccess.write) {
        return (
            <NoWriteAccessMessage
                message={i18n.t("You don't have access to create an event in the current selections")}
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
