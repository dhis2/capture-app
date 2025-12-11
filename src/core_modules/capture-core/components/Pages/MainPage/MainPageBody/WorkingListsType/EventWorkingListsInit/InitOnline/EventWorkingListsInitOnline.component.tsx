import React from 'react';
import { withLoadingIndicator } from '../../../../../../../HOC';
import { EventWorkingLists } from '../../../../../../WorkingLists/EventWorkingLists';
import { useMainViewConfig } from './useMainViewConfig';
import type { Props } from './eventWorkingListsInitOnline.types';

const EventWorkingListsWithLoadingIndicator = withLoadingIndicator()(EventWorkingLists);

export const EventWorkingListsInitOnline = ({
    mutationInProgress,
    ...passOnProps
}: Props) => {
    const { mainViewConfig, mainViewConfigReady } = useMainViewConfig();

    return (
        <EventWorkingListsWithLoadingIndicator
            {...(passOnProps as any)}
            ready={!mutationInProgress && mainViewConfigReady}
            mainViewConfig={mainViewConfig}
        />
    );
};
