// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import { NewEventDataEntryWrapper } from './DataEntryWrapper/NewEventDataEntryWrapper.container';
import { NewRelationshipWrapper } from './NewRelationshipWrapper/NewEventNewRelationshipWrapper.container';
import { SelectionsNoAccess } from './SelectionsNoAccess/dataEntrySelectionsNoAccess.container';
import type { Props } from './SingleEventRegistrationEntry.types';

export const SingleEventRegistrationEntryComponent = ({ showAddRelationship, eventAccess, id }: Props) => {
    const itemId = useSelector((state: ReduxState) => state.dataEntries[id]?.itemId);
    if (itemId && itemId !== 'newEvent') {
        return null;
    }

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

