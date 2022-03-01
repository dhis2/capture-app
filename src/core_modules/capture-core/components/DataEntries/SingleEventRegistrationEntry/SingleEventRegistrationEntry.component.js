// @flow
import React from 'react';
import { NewEventDataEntryWrapper } from './DataEntryWrapper/NewEventDataEntryWrapper.container';
import { NewRelationshipWrapper } from './NewRelationshipWrapper/NewEventNewRelationshipWrapper.container';
import { SelectionsNoAccess } from './SelectionsNoAccess/dataEntrySelectionsNoAccess.container';
import type { Props } from './SingleEventRegistrationEntry.types';

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

