// @flow
import React from 'react';
import { NewEventDataEntryWrapper } from '../../../DataEntries/SingleEventRegistrationEntry/DataEntryWrapper/NewEventDataEntryWrapper.container';
import { NewRelationshipWrapper } from '../../../DataEntries/SingleEventRegistrationEntry/NewRelationshipWrapper/NewEventNewRelationshipWrapper.container';
import SelectionsNoAccess from '../../../DataEntries/SingleEventRegistrationEntry/SelectionsNoAccess/dataEntrySelectionsNoAccess.container';

type Props = {|
    showAddRelationship: boolean,
    eventAccess: {|
        read: boolean,
        write: boolean,
    |},
|};

export const SelectionsCompleteComponent = ({ showAddRelationship, eventAccess }: Props) => {
    if (!eventAccess.write) {
        return (
            <SelectionsNoAccess />
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

