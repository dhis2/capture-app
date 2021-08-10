// @flow
import * as React from 'react';
import { EventWorkingListsReduxProvider } from './ReduxProvider';
import type { Props } from './EventWorkingLists.types';

export const EventWorkingLists = ({ storeId, programId, programStageId, orgUnitId }: Props) => (
    <div data-test="event-working-lists">
        <EventWorkingListsReduxProvider
            storeId={storeId}
            programId={programId}
            programStageId={programStageId}
            orgUnitId={orgUnitId}
        />
    </div>
);
