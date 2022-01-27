// @flow
import * as React from 'react';
import { EventWorkingListsReduxProvider } from './ReduxProvider';
import { useProgramStageInfo } from '../../../metaDataMemoryStores/programCollection/helpers';
import type { Props } from './EventWorkingLists.types';

export const EventWorkingLists = ({ storeId, programId, programStageId, orgUnitId }: Props) => {
    const { program, programStage, error } = useProgramStageInfo(programStageId, programId);

    if (error) {
        return error;
    }

    return (
        <div data-test="event-working-lists">
            <EventWorkingListsReduxProvider
                storeId={storeId}
                // $FlowFixMe
                program={program}
                // $FlowFixMe
                programStage={programStage}
                orgUnitId={orgUnitId}
            />
        </div>
    );
};
