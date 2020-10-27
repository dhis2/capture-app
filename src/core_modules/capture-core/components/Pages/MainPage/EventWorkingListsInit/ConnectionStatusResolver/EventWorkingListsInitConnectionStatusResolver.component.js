// @flow
import React from 'react';
import { EventWorkingListsOffline } from '../../EventWorkingListsOffline';
import { WorkingListsInitRunningMutationsHandler } from '../RunningMutationsHandler';
import type { Props } from './eventWorkingListsInitConnectionStatusResolver.types';

export const EventWorkingListsInitConnectionStatusResolver = ({ isOnline, ...passOnProps }: Props) => (
    <div>
        {
            (() => {
                if (!isOnline) {
                    return (
                        <EventWorkingListsOffline
                            {...passOnProps}
                        />
                    );
                }
                return (
                    <WorkingListsInitRunningMutationsHandler
                        {...passOnProps}
                    />
                );
            })()
        }
    </div>
);
