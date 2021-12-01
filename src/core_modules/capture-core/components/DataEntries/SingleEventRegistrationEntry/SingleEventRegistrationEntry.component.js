// @flow
import React from 'react';
import { SelectionsNoAccess } from './SelectionsNoAccess/dataEntrySelectionsNoAccess.container';
import { NewRelationshipWrapper } from './NewRelationshipWrapper/NewEventNewRelationshipWrapper.container';
import { NewEventDataEntryWrapper } from './DataEntryWrapper/NewEventDataEntryWrapper.container';

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

