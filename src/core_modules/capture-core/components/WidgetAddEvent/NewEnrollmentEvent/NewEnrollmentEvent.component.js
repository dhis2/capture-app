// @flow
import React from 'react';
import { NewEventDataEntryWrapper } from './DataEntryWrapper/NewEventDataEntryWrapper.container';
import { SelectionsNoAccess } from './SelectionsNoAccess/dataEntrySelectionsNoAccess.container';

type Props = {|
    eventAccess: {|
        read: boolean,
        write: boolean,
    |},
|};

export const NewEnrollmentEventComponent = ({ eventAccess }: Props) => {
    if (!eventAccess.write) {
        return (
            <SelectionsNoAccess />
        );
    }

    return (
        <NewEventDataEntryWrapper />
    );
};

