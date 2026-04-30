import React from 'react';
import { NewEventDataEntryWrapper } from './DataEntryWrapper/NewEventDataEntryWrapper.container';
import { NewRelationshipWrapper } from './NewRelationshipWrapper/NewEventNewRelationshipWrapper.container';
import { DataEntrySelectionsNoAccess } from './SelectionsNoAccess/dataEntrySelectionsNoAccess.component';
import type { Props } from './SingleEventRegistrationEntry.types';

export const SingleEventRegistrationEntryComponent = ({ showAddRelationship, eventAccess }: Props) => {
    if (!eventAccess.write) {
        return (
            <DataEntrySelectionsNoAccess />
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
