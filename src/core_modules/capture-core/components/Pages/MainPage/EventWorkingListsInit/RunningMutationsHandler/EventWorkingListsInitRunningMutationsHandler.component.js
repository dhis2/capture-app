// @flow
import React from 'react';
import { EventWorkingLists } from '../../../../WorkingLists/EventWorkingLists';
import { withLoadingIndicator } from '../../../../../HOC';
import type { Props } from './eventWorkingListsInitRunningMutationsHandler.types';

const EventWorkingListsWithLoadingIndicator = withLoadingIndicator()(EventWorkingLists);

export const EventWorkingListsInitRunningMutationsHandler = ({ mutationInProgress, ...passOnProps }: Props) => (
    <EventWorkingListsWithLoadingIndicator
        {...passOnProps}
        ready={!mutationInProgress}
    />
);
