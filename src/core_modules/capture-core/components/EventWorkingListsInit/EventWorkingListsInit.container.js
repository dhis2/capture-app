// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import { EventWorkingListsInitConnectionStatusResolver } from './ConnectionStatusResolver';
import type { Props } from './EventWorkingListsInit.container.type';

export const EventWorkingListsInit = ({ programId, programStageId }: Props) => {
    const isOnline = useSelector(({ offline: { online }, app: { goingOnlineInProgress } }) =>
        !!online && !goingOnlineInProgress);
    const mutationInProgress = useSelector(({ offline: { outbox } }) => outbox && outbox.length > 0);

    return (
        <EventWorkingListsInitConnectionStatusResolver
            storeId="eventList"
            programId={programId}
            programStageId={programStageId}
            isOnline={isOnline}
            mutationInProgress={mutationInProgress}
        />
    );
};
