// @flow
import * as React from 'react';
import { EventWorkingListsReduxProvider } from './ReduxProvider';
import type { Props } from './EventWorkingLists.types';

export const EventWorkingLists = ({ storeId, orgUnitId }: Props) => (
    <div data-test="event-working-lists">
        <EventWorkingListsReduxProvider
            storeId={storeId}
            orgUnitId={orgUnitId}
        />
    </div>
);
