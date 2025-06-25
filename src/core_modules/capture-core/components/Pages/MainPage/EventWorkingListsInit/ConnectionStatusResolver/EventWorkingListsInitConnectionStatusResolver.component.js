// @flow
import React from 'react';
import { EventWorkingListsInitHeader } from '../Header';
import { EventWorkingListsOffline } from '../../../../WorkingLists/EventWorkingListsOffline';
import { EventWorkingListsInitOnline } from '../InitOnline';
import type { Props } from './eventWorkingListsInitConnectionStatusResolver.types';

export const EventWorkingListsInitConnectionStatusResolver = ({ isOnline, storeId, ...passOnProps }: Props) => (
    <EventWorkingListsInitHeader>
        {
            !isOnline ?
                <EventWorkingListsOffline
                    storeId={storeId}
                />
                :
                <EventWorkingListsInitOnline
                    {...passOnProps}
                    storeId={storeId}
                />
        }

    </EventWorkingListsInitHeader>
);
