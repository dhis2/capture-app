// @flow
import React from 'react';
import type { Props } from './EventWorkingListsOffline.types';
import { EventWorkingListsReduxOffline } from './Redux';

export const EventWorkingListsOffline = ({ storeId }: Props) => (
    <EventWorkingListsReduxOffline
        storeId={storeId}
    />
);
