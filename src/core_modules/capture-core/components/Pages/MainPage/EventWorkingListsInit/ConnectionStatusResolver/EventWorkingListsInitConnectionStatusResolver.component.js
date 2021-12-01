// @flow
import React from 'react';
import { EventWorkingListsInitRunningMutationsHandler } from '../RunningMutationsHandler';
import { EventWorkingListsInitHeader } from '../Header';
import { EventWorkingListsOffline } from '../../../../WorkingLists/EventWorkingListsOffline';
import type { Props } from './eventWorkingListsInitConnectionStatusResolver.types';

export const EventWorkingListsInitConnectionStatusResolver = ({ isOnline, storeId, ...passOnProps }: Props) => (
    <EventWorkingListsInitHeader>
        {
            !isOnline ?
                <EventWorkingListsOffline
                    storeId={storeId}
                />
                :
                <EventWorkingListsInitRunningMutationsHandler
                    {...passOnProps}
                    storeId={storeId}
                />
        }

    </EventWorkingListsInitHeader>
);
