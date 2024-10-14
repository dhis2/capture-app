// @flow
import React from 'react';
import { EventBulkActions } from '../../EventWorkingListsCommon/EventBulkActions';
import { TrackedEntityBulkActionsComponent } from './TrackedEntityBulkActions.component';
import type { ContainerProps } from './TrackedEntityBulkActions.types';

export const TrackedEntityBulkActions = ({ programStageId, ...passOnProps }: ContainerProps) => {
    if (programStageId) {
        return (
            <EventBulkActions
                {...passOnProps}
            />
        );
    }

    return (
        <TrackedEntityBulkActionsComponent
            {...passOnProps}
        />
    );
};
