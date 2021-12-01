// @flow
import { useSelector } from 'react-redux';
import React, { useMemo } from 'react';
import { EventWorkingListsOfflineColumnSetup } from '../ColumnSetup';
import { useWorkingListsCommonStateManagementOffline } from '../../WorkingListsCommon';
import { getEventProgramThrowIfNotFound } from '../../../../metaData';
import type { Props } from './EventWorkingListsReduxOffline.types';

export const EventWorkingListsReduxOffline = ({ storeId }: Props) => {
    const programId = useSelector(({ currentSelections }) => currentSelections.programId);
    const program = useMemo(() => getEventProgramThrowIfNotFound(programId),
        [programId]);

    return (
        <EventWorkingListsOfflineColumnSetup
            {...useWorkingListsCommonStateManagementOffline(storeId)}
            program={program}
        />
    );
};
