import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { NoWriteAccessMessage } from '../../../NoWriteAccessMessage';

export const DataEntrySelectionsNoAccess = () => (
    <NoWriteAccessMessage
        message={i18n.t("You don't have access to create an event in the current selections")}
    />
);
