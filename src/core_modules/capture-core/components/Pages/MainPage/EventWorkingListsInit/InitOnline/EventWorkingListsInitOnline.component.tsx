import React from 'react';
import { withLoadingIndicator } from '../../../../../HOC';
import { EventWorkingLists } from '../../../../WorkingLists/EventWorkingLists';
import { useMainViewConfig } from './useMainViewConfig';
import type { Props } from './eventWorkingListsInitOnline.types';

const EventWorkingListsWithLoadingIndicator = withLoadingIndicator()(EventWorkingLists);

export const EventWorkingListsInitOnline = ({
    mutationInProgress,
    ...passOnProps
}: Props) => {
    // Retrieving the viewConfig this high up in the component tree because this is capture app specific config
    // The EventWorkingLists can potentially be included a standalone Widget library in the future
    const { mainViewConfig, mainViewConfigReady } = useMainViewConfig();

    return (
        <EventWorkingListsWithLoadingIndicator
            {...(passOnProps as any)}
            ready={!mutationInProgress && mainViewConfigReady}
            mainViewConfig={mainViewConfig}
        />
    );
};
