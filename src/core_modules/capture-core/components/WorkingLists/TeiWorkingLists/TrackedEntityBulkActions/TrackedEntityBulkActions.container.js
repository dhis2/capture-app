// @flow
import React from 'react';
import log from 'loglevel';
import { EventBulkActions } from '../../EventWorkingListsCommon/EventBulkActions';
import { TrackedEntityBulkActionsComponent } from './TrackedEntityBulkActions.component';
import type { ContainerProps } from './TrackedEntityBulkActions.types';
import { errorCreator } from '../../../../../capture-core-utils';

export const TrackedEntityBulkActions = ({
    programStageId,
    stages,
    programDataWriteAccess,
    programId,
    ...passOnProps
}: ContainerProps) => {
    if (programStageId) {
        const stage = stages.get(programStageId);

        if (!stage) {
            log.error(errorCreator('Program stage not found')({ programStageId, stages }));
            throw new Error('Program stage not found');
        }

        return (
            <EventBulkActions
                stage={stage}
                {...passOnProps}
            />
        );
    }

    return (
        <TrackedEntityBulkActionsComponent
            programId={programId}
            stages={stages}
            programDataWriteAccess={programDataWriteAccess}
            {...passOnProps}
        />
    );
};
