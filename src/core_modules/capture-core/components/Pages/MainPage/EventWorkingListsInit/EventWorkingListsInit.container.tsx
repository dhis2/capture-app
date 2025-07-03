import React from 'react';
import { useSelector } from 'react-redux';
import { EventWorkingListsInitConnectionStatusResolver } from './ConnectionStatusResolver';
import type { Props } from './EventWorkingListsInit.container.types';
import type { ReduxState } from '../../../App/withAppUrlSync.types';

export const EventWorkingListsInit = ({ ...passOnProps }: Props) => {
    const isOnline = useSelector(({ offline: { online }, app: { goingOnlineInProgress } }: ReduxState) =>
        !!online && !goingOnlineInProgress);
    const mutationInProgress = useSelector(({ offline: { outbox } }: ReduxState) => !!(outbox && outbox.length > 0));

    return (
        <EventWorkingListsInitConnectionStatusResolver
            {...passOnProps}
            storeId="eventList"
            isOnline={isOnline}
            mutationInProgress={mutationInProgress}
        />
    );
};
