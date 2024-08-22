// @flow
import React from 'react';
import { BulkActionBar } from '../../WorkingListsBase/BulkActionBar';
import { CompleteAction, DeleteAction } from './Actions';
import type { Props } from './TrackedEntityBulkActions.types';

export const TrackedEntityBulkActionsComponent = ({
    selectedRows,
    programId,
    onClearSelection,
    onUpdateList,
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
            <CompleteAction
                programId={programId}
                selectedRows={selectedRows}
                onUpdateList={onUpdateList}
            />

            <DeleteAction
                selectedRows={selectedRows}
                selectedRowsCount={selectedRowsCount}
                onUpdateList={onUpdateList}
            />
        </BulkActionBar>
    );
};
