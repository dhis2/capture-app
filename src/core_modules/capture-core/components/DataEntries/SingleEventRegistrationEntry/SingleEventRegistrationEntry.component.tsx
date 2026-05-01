import React from 'react';
import { useDispatch } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { NoWriteAccessMessage } from '../../NoWriteAccessMessage';
import { NewEventDataEntryWrapper } from './DataEntryWrapper/NewEventDataEntryWrapper.container';
import { NewRelationshipWrapper } from './NewRelationshipWrapper/NewEventNewRelationshipWrapper.container';
import { cancelNewEventAndReturnToMainPage } from './DataEntryWrapper/DataEntry/actions/dataEntry.actions';
import type { Props } from './SingleEventRegistrationEntry.types';

export const SingleEventRegistrationEntryComponent = ({ showAddRelationship, eventAccess }: Props) => {
    const dispatch = useDispatch();

    if (!eventAccess.write) {
        return (
            <NoWriteAccessMessage
                message={i18n.t("You don't have access to create an event in the current selections")}
                onBack={() => dispatch(cancelNewEventAndReturnToMainPage())}
            />
        );
    }

    return (
        <>
            {
                showAddRelationship ?
                    <NewRelationshipWrapper /> :
                    <NewEventDataEntryWrapper />
            }
        </>
    );
};
