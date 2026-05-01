import React from 'react';
import { useDispatch } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { NoWriteAccessMessage } from '../../../NoWriteAccessMessage';
import { cancelNewEventAndReturnToMainPage } from '../DataEntryWrapper/DataEntry/actions/dataEntry.actions';

export const DataEntrySelectionsNoAccess = () => {
    const dispatch = useDispatch();
    return (
        <NoWriteAccessMessage
            message={i18n.t("You don't have access to create an event in the current selections")}
            onBack={() => dispatch(cancelNewEventAndReturnToMainPage())}
        />
    );
};
