import React from 'react';
import { BulkActionBar, BulkDataEntryAction } from '../../WorkingListsCommon';
import { CompleteEventsAction, DeleteEventsAction } from './Actions';
import type { Props } from './EventBulkActions.types';

export const EventBulkActions = ({
    selectedRows,
    stage,
    onClearSelection,
    removeRowsFromSelection,
    onUpdateList,
    programId,
    onOpenBulkDataEntryPlugin,
    bulkDataEntryIsActive,
}: Props) => {
    const selectedRowsCount = Object.keys(selectedRows).length;

    if (!selectedRowsCount || !stage) {
        return null;
    }

    return (
        <BulkActionBar
            selectedRowsCount={selectedRowsCount}
            onClearSelection={onClearSelection}
        >
            {programId && onOpenBulkDataEntryPlugin && (
                <BulkDataEntryAction
                    programId={programId}
                    onOpenBulkDataEntryPlugin={onOpenBulkDataEntryPlugin}
                    selectionInProgress
                />
            )}
            <CompleteEventsAction
                selectedRows={selectedRows}
                stageDataWriteAccess={stage.access.data.write}
                bulkDataEntryIsActive={bulkDataEntryIsActive}
                onUpdateList={onUpdateList}
                removeRowsFromSelection={removeRowsFromSelection}
                programId={programId}
            />

            <DeleteEventsAction
                selectedRows={selectedRows}
                stageDataWriteAccess={stage.access.data.write}
                bulkDataEntryIsActive={bulkDataEntryIsActive}
                onUpdateList={onUpdateList}
                removeRowsFromSelection={removeRowsFromSelection}
                programId={programId}
            />
        </BulkActionBar>
    );
};
