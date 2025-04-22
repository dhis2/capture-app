// @flow
import React from 'react';
import type { CachedBulkDataEntry } from '../../../../utils/cachedDataHooks/useBulkDataEntryFromIndexedDB';
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
    setShowBulkDataEntryPlugin?: (show: boolean) => void,
    cachedBulkDataEntry?: ?CachedBulkDataEntry,
|}

export const EventBulkActions = ({
    selectedRows,
    stage,
    onClearSelection,
    removeRowsFromSelection,
    onUpdateList,
    programId,
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
            {programId && setShowBulkDataEntryPlugin && (
                <BulkDataEntryAction
                    programId={programId}
                    setShowBulkDataEntryPlugin={setShowBulkDataEntryPlugin}
                    selectionInProgress
                />
            )}
            <CompleteAction
                selectedRows={selectedRows}
                stageDataWriteAccess={stage.access.data.write}
                bulkDataEntryIsActive={Boolean(cachedBulkDataEntry?.activeList)}
                onUpdateList={onUpdateList}
                removeRowsFromSelection={removeRowsFromSelection}
            />

            <DeleteAction
                selectedRows={selectedRows}
                stageDataWriteAccess={stage.access.data.write}
                bulkDataEntryIsActive={Boolean(cachedBulkDataEntry?.activeList)}
                onUpdateList={onUpdateList}
            />
        </BulkActionBar>
    );
};
