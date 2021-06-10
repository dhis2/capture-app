// @flow
import React from 'react';
import { EventWorkingListsInitHeader } from '../Header';
import { EventWorkingListsOffline } from '../../EventWorkingListsOffline';
import { EventWorkingListsInitRunningMutationsHandler } from '../RunningMutationsHandler';
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
