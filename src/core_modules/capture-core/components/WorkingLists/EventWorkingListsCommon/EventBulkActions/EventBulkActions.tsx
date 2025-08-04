import React from 'react';
import { BulkActionBar, BulkDataEntryAction } from '../../WorkingListsCommon';
import { CompleteAction, DeleteAction } from './Actions';
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

    if (!selectedRowsCount) {
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
            <CompleteAction
                selectedRows={selectedRows}
                stageDataWriteAccess={stage.access.data.write}
                bulkDataEntryIsActive={bulkDataEntryIsActive}
                onUpdateList={onUpdateList}
                removeRowsFromSelection={removeRowsFromSelection}
            />

            <DeleteAction
                selectedRows={selectedRows}
                stageDataWriteAccess={stage.access.data.write}
                bulkDataEntryIsActive={bulkDataEntryIsActive}
                onUpdateList={onUpdateList}
            />
        </BulkActionBar>
    );
};
