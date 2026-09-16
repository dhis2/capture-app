import React from 'react';
import type { ProgramStage } from '../../../../metaData';
import { BulkActionBar, BulkDataEntryAction } from '../../WorkingListsCommon';
import { CompleteEventsAction, DeleteEventsAction } from './Actions';

type Props = {
    selectedRows: Record<string, boolean>;
    onClearSelection: () => void;
    stage?: ProgramStage;
    onUpdateList: (disableClearSelection?: boolean) => void;
    removeRowsFromSelection: (rows: Array<string>) => void;
    programId?: string;
    onOpenBulkDataEntryPlugin?: () => void;
    bulkDataEntryIsActive: boolean;
};

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
