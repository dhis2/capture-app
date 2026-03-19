import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import i18n from '@dhis2/d2-i18n';
import { v4 as uuid } from 'uuid';
import { EventWorkingListsRowMenuSetup } from '../RowMenuSetup';
import { DownloadDialog, useSelectedRowsController } from '../../WorkingListsCommon';
import type { CustomMenuContents } from '../../WorkingListsBase';
import type { Props } from './EventWorkingListsViewMenuSetup.types';
import { EventBulkActions } from '../../EventWorkingListsCommon/EventBulkActions';

export const EventWorkingListsViewMenuSetup = ({
    downloadRequest,
    program,
    dataSource,
    lastIdDeleted,
    ...passOnProps
}: Props) => {
    const [downloadDialogOpen, setDownloadDialogOpenStatus] = useState(false);
    const [customUpdateTrigger, setCustomUpdateTrigger] = useState<string>();
    const lastProcessedDeletedIdRef = useRef<string | null>(null);

    const {
        selectedRows,
        clearSelection,
        selectAllRows,
        selectionInProgress,
        toggleRowSelected,
        allRowsAreSelected,
        removeRowsFromSelection,
    } = useSelectedRowsController({ recordIds: dataSource?.map(data => data.id) });

    const customListViewMenuContents: CustomMenuContents = useMemo(() => [{
        key: 'downloadData',
        clickHandler: () => setDownloadDialogOpenStatus(true),
        element: i18n.t('Download data...'),
    }], [setDownloadDialogOpenStatus]);

    const handleCloseDialog = useCallback(() => {
        setDownloadDialogOpenStatus(false);
    }, [setDownloadDialogOpenStatus]);


    const onUpdateList = useCallback((disableClearSelection?: boolean) => {
        const id = uuid();
        setCustomUpdateTrigger(id);
        !disableClearSelection && clearSelection();
    }, [clearSelection]);

    useEffect(() => {
        if (lastIdDeleted && lastIdDeleted !== lastProcessedDeletedIdRef.current) {
            onUpdateList();
            lastProcessedDeletedIdRef.current = lastIdDeleted;
        }
    }, [lastIdDeleted, onUpdateList]);

    const eventBulkActions = (
        <EventBulkActions
            selectedRows={selectedRows}
            stage={program.stage}
            onClearSelection={clearSelection}
            onUpdateList={onUpdateList}
            removeRowsFromSelection={removeRowsFromSelection}
            programId={program.id}
        />
    );

    return (
        <React.Fragment>
            <EventWorkingListsRowMenuSetup
                {...passOnProps}
                customUpdateTrigger={customUpdateTrigger}
                dataSource={dataSource}
                programId={program.id}
                customListViewMenuContents={customListViewMenuContents}
                selectedRows={selectedRows}
                onSelectAll={selectAllRows}
                selectionInProgress={selectionInProgress}
                onRowSelect={toggleRowSelected}
                allRowsAreSelected={allRowsAreSelected}
                bulkActionBarComponent={eventBulkActions}
            />
            <DownloadDialog
                open={downloadDialogOpen}
                onClose={handleCloseDialog}
                request={downloadRequest}
            />
        </React.Fragment>
    );
};
