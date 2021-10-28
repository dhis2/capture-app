// @flow
import * as React from 'react';
import { EventWorkingListsReduxProvider } from './ReduxProvider';
import type { Props } from './EventWorkingLists.types';

export const EventWorkingLists = ({ storeId, programId, orgUnitId }: Props) => (
    <div data-test="event-working-lists">
        <EventWorkingListsReduxProvider
            storeId={storeId}
            programId={programId}
            orgUnitId={orgUnitId}
        />
    </div>
);
