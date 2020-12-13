// @flow
import React from 'react';
import { NewEventDataEntryWrapper } from './DataEntryWrapper/NewEventDataEntryWrapper.container';
import { NewRelationshipWrapper } from './NewRelationshipWrapper/NewEventNewRelationshipWrapper.container';
import SelectionsNoAccess from './SelectionsNoAccess/dataEntrySelectionsNoAccess.container';

type Props = {|
    showAddRelationship: boolean,
    eventAccess: {|
        read: boolean,
        write: boolean,
    |},
|};

export const SingleEventRegistrationEntryComponent = ({ showAddRelationship, eventAccess }: Props) => {
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

