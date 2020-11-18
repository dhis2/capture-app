// @flow
import * as React from 'react';
import { EventWorkingListsReduxProvider } from './ReduxProvider';
import type { Props } from './EventWorkingLists.types';

export const EventWorkingLists = ({ storeId }: Props) => (
    <EventWorkingListsReduxProvider
        storeId={storeId}
    />
);
