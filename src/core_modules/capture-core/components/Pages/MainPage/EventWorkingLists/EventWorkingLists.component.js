// @flow
import * as React from 'react';
import { EventWorkingListsRedux } from './Redux';
import type { Props } from './EventWorkingLists.types';

export const EventWorkingLists = ({ storeId }: Props) => (
    <EventWorkingListsRedux
        storeId={storeId}
    />
);
