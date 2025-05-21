// @flow
import React, { useMemo, useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { TrackedEntityBulkActions } from './BulkActions';
import { useSelectedRowsController } from '../../WorkingListsBase/BulkActionBar';
import { TeiWorkingListsSetup } from '../Setup';
import type { Props } from './trackerWorkingListsBulkActionsController.types';

export const TrackerWorkingListsBulkActionsController = ({
    program,
    programStageId,
    recordsOrder,
    ...passOnProps
}: Props) => {
    const [customUpdateTrigger, setCustomUpdateTrigger] = useState();
    const {
        selectedRows,
        clearSelection,
        selectAllRows,
        selectionInProgress,
        toggleRowSelected,
        allRowsAreSelected,
        removeRowsFromSelection,
    } = useSelectedRowsController({ recordIds: recordsOrder });

    const handleCustomUpdateTrigger = useCallback((disableClearSelection?: boolean) => {
        const id = uuid();
        setCustomUpdateTrigger(id);
        !disableClearSelection && clearSelection();
    }, [clearSelection]);

    const trackedEntityBulkActionsElement = useMemo(() => (
        <TrackedEntityBulkActions
            programId={program.id}
            programDataWriteAccess={program.access.data.write}
            programStageId={programStageId}
            stages={program.stages}
            selectedRows={selectedRows}
            onClearSelection={clearSelection}
            onUpdateList={handleCustomUpdateTrigger}
            removeRowsFromSelection={removeRowsFromSelection}
        />
    ), [program, programStageId, selectedRows, clearSelection, handleCustomUpdateTrigger, removeRowsFromSelection]);


    return (
        <TeiWorkingListsSetup
            {...passOnProps}
            customUpdateTrigger={customUpdateTrigger}
            program={program}
            programStageId={programStageId}
            recordsOrder={recordsOrder}
            bulkActionBarComponent={trackedEntityBulkActionsElement}
            selectedRows={selectedRows}
            allRowsAreSelected={allRowsAreSelected}
            selectionInProgress={selectionInProgress}
            onSelectAll={selectAllRows}
            onRowSelect={toggleRowSelected}
        />
    );
};
