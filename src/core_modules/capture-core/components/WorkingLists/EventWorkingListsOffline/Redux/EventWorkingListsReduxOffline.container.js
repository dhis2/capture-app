// @flow
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getEventProgramThrowIfNotFound } from '../../../../metaData';
import { useWorkingListsCommonStateManagementOffline } from '../../WorkingListsCommon';
import { EventWorkingListsOfflineColumnSetup } from '../ColumnSetup';
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
