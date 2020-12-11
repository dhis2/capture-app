// @flow
import React from 'react';
import { withLoadingIndicator } from '../../../../../HOC';
import { EventWorkingLists } from '../../EventWorkingLists';
import type { Props } from './eventWorkingListsInitRunningMutationsHandler.types';

const EventWorkingListsWithLoadingIndicator = withLoadingIndicator()(EventWorkingLists);

export const EventWorkingListsInitRunningMutationsHandler = ({
  mutationInProgress,
  ...passOnProps
}: Props) => <EventWorkingListsWithLoadingIndicator {...passOnProps} ready={!mutationInProgress} />;
