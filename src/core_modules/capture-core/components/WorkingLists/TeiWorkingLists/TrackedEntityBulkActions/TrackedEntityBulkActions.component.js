// @flow
import React from 'react';
import { BulkActionBar, BulkDataEntryAction } from '../../WorkingListsBase/BulkActionBar';
import { CompleteAction, DeleteEnrollmentsAction } from './Actions';
import type { Props } from './TrackedEntityBulkActions.types';

export const TrackedEntityBulkActionsComponent = ({
    selectedRows,
    programId,
    stages,
    programDataWriteAccess,
    onClearSelection,
    onUpdateList,
    removeRowsFromSelection,
    setShowBulkDataEntryPlugin,
    cachedBulkDataEntry,
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
            <BulkDataEntryAction
                programId={programId}
                setShowBulkDataEntryPlugin={setShowBulkDataEntryPlugin}
                selectionInProgress
            />
            <CompleteAction
                programId={programId}
                programDataWriteAccess={programDataWriteAccess}
                selectedRows={selectedRows}
                stages={stages}
                onUpdateList={onUpdateList}
                removeRowsFromSelection={removeRowsFromSelection}
                bulkDataEntryIsActive={Boolean(cachedBulkDataEntry?.activeList)}
            />

            <DeleteEnrollmentsAction
                selectedRows={selectedRows}
                programDataWriteAccess={programDataWriteAccess}
                programId={programId}
                onUpdateList={onUpdateList}
                bulkDataEntryIsActive={Boolean(cachedBulkDataEntry?.activeList)}
            />

            {/* <DeleteTeiAction */}
            {/*     selectedRows={selectedRows} */}
            {/*     selectedRowsCount={selectedRowsCount} */}
            {/*     onUpdateList={onUpdateList} */}
            {/* /> */}
        </BulkActionBar>
    );
};
