// @flow
import React from 'react';
import { BulkActionBar, BulkDataEntryAction } from '../../WorkingListsBase/BulkActionBar';
import { CompleteAction, DeleteAction } from './Actions';
import type { ProgramStage } from '../../../../metaData';

type Props = {|
    selectedRows: { [key: string]: boolean },
    onClearSelection: () => void,
    stage: ProgramStage,
    onUpdateList: (disableClearSelection?: boolean) => void,
    removeRowsFromSelection: (rows: Array<string>) => void,
    programId?: string,
    onOpenBulkDataEntryPlugin?: () => void,
    bulkDataEntryIsActive?: boolean,
|}

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
