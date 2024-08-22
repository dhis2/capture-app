// @flow
import React from 'react';
import { BulkActionBar } from '../../WorkingListsBase/BulkActionBar';
import { CompleteAction, DeleteAction } from './Actions';

type Props = {
    selectedRows: { [key: string]: boolean },
    onClearSelection: () => void,
    onUpdateList: () => void,
}

export const EventBulkActions = ({
    selectedRows,
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
                selectedRows={selectedRows}
                onUpdateList={onUpdateList}
            />

            <DeleteAction
                selectedRows={selectedRows}
                onUpdateList={onUpdateList}
            />
        </BulkActionBar>
    );
};
