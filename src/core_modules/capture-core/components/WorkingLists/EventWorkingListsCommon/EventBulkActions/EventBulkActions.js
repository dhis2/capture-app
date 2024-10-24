// @flow
import React from 'react';
import { BulkActionBar } from '../../WorkingListsBase/BulkActionBar';
import { CompleteAction, DeleteAction } from './Actions';
import type { ProgramStage } from '../../../../metaData';

type Props = {|
    selectedRows: { [key: string]: boolean },
    onClearSelection: () => void,
    stage: ProgramStage,
    onUpdateList: (disableClearSelection?: boolean) => void,
    removeRowsFromSelection: (rows: Array<string>) => void,
|}

export const EventBulkActions = ({
    selectedRows,
    stage,
    onClearSelection,
    removeRowsFromSelection,
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
                disabled={!stage.access.data.write}
                onUpdateList={onUpdateList}
                removeRowsFromSelection={removeRowsFromSelection}
            />

            <DeleteAction
                selectedRows={selectedRows}
                disabled={!stage.access.data.write}
                onUpdateList={onUpdateList}
            />
        </BulkActionBar>
    );
};
