// @flow
import React from 'react';
import { withLoadingIndicator } from '../../../../../HOC';
import { WorkingListsInitHeader } from '../Header';
import type { Props } from './WorkingListsInitRunningMutationsHandler.types';

const EventWorkingListsSetupWithLoadingIndicator = withLoadingIndicator()(WorkingListsInitHeader);

export const WorkingListsInitRunningMutationsHandler = ({ mutationInProgress, ...passOnProps }: Props) => (
    <EventWorkingListsSetupWithLoadingIndicator
        {...passOnProps}
        ready={!mutationInProgress}
    />
);
