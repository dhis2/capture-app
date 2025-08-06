import React, { useCallback } from 'react';
import log from 'loglevel';
import { EventBulkActions } from '../../EventWorkingListsCommon/EventBulkActions';
import { TrackedEntityBulkActionsComponent } from './TrackedEntityBulkActions.component';
import type { ContainerProps } from './TrackedEntityBulkActions.types';
import { errorCreator } from '../../../../../capture-core-utils';
import { useBulkDataEntryConfigurations } from '../../../common/bulkDataEntry';

export const TrackedEntityBulkActions = ({
    programStageId,
    stages,
    programDataWriteAccess,
    programId,
    onOpenBulkDataEntryPlugin,
    recordsOrder,
    selectedRows,
    ...passOnProps
}: ContainerProps) => {
    const { activeList } = useBulkDataEntryConfigurations(programId);

    const injectSelectedRowsToBulkDataEntryPlugin = useCallback(() => {
        recordsOrder && onOpenBulkDataEntryPlugin(recordsOrder.filter(recordOrder => selectedRows[recordOrder]));
    }, [onOpenBulkDataEntryPlugin, recordsOrder, selectedRows]);

    if (programStageId) {
        const stage = stages.get(programStageId);

        if (!stage) {
            log.error(errorCreator('Program stage not found')({ programStageId, stages }));
            throw new Error('Program stage not found');
        }

        return (
            <EventBulkActions
                programId={programId}
                stage={stage}
                bulkDataEntryIsActive={Boolean(activeList)}
                selectedRows={selectedRows}
                onOpenBulkDataEntryPlugin={injectSelectedRowsToBulkDataEntryPlugin}
                {...passOnProps}
            />
        );
    }

    return (
        <TrackedEntityBulkActionsComponent
            programId={programId}
            stages={stages}
            programDataWriteAccess={programDataWriteAccess}
            bulkDataEntryIsActive={Boolean(activeList)}
            selectedRows={selectedRows}
            onOpenBulkDataEntryPlugin={injectSelectedRowsToBulkDataEntryPlugin}
            {...passOnProps}
        />
    );
};
