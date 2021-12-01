// @flow
import { useSelector } from 'react-redux';
import React from 'react';
import type { Props } from './EventWorkingListsInit.container.type';
import { EventWorkingListsInitConnectionStatusResolver } from './ConnectionStatusResolver';

export const EventWorkingListsInit = ({ ...passOnProps }: Props) => {
    const isOnline = useSelector(({ offline: { online }, app: { goingOnlineInProgress } }) =>
        !!online && !goingOnlineInProgress);
    const mutationInProgress = useSelector(({ offline: { outbox } }) => outbox && outbox.length > 0);

    return (
        <EventWorkingListsInitConnectionStatusResolver
            {...passOnProps}
            storeId="eventList"
            isOnline={isOnline}
            mutationInProgress={mutationInProgress}
        />
    );
};
