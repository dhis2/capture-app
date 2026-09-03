import i18n from '@dhis2/d2-i18n';
import React from 'react';
import { useDispatch } from 'react-redux';
import { NoWriteAccessMessage } from '../../NoWriteAccessMessage';
import { NewEventDataEntryWrapper } from './DataEntryWrapper/NewEventDataEntryWrapper.container';
import { NewRelationshipWrapper } from './NewRelationshipWrapper/NewEventNewRelationshipWrapper.container';
import { cancelNewEventAndReturnToMainPage } from './DataEntryWrapper/DataEntry/actions/dataEntry.actions';
import type { Props } from './SingleEventRegistrationEntry.types';
import { useTermLabel } from '../../../metaData';

export const SingleEventRegistrationEntryComponent = ({ showAddRelationship, eventAccess }: Props) => {
    const dispatch = useDispatch();
    const eventLabel = useTermLabel('event');

    if (!eventAccess.write) {
        return (
            <NoWriteAccessMessage
                message={i18n.t(
                    "You don't have access to create an {{eventLabel}} in the current selections",
                    { eventLabel },
                )}
                onCancel={() => dispatch(cancelNewEventAndReturnToMainPage())}
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
