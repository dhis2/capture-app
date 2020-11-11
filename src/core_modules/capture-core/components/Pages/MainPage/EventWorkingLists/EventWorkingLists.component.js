// @flow
import * as React from 'react';
import { EventWorkingListsReduxProvider } from './ReduxProvider';

export const EventWorkingLists = () => (
    <EventWorkingListsReduxProvider
        listId="eventList"
    />
);
