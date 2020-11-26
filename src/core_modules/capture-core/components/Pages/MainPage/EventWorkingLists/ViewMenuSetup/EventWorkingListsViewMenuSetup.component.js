// @flow
import React, { useState, useMemo, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { EventWorkingListsRowMenuSetup } from '../RowMenuSetup';
import { DownloadDialog } from './DownloadDialog';
import type { CustomMenuContents } from '../../WorkingLists';
import type { Props } from './EventWorkingListsViewMenuSetup.types';

export const EventWorkingListsViewMenuSetup = ({ downloadRequest, program, ...passOnProps }: Props) => {
    const [downloadDialogOpen, setDownloadDialogOpenStatus] = useState(false);
    const customListViewMenuContents: CustomMenuContents = useMemo(() => [{
        key: 'downloadData',
        clickHandler: () => setDownloadDialogOpenStatus(true),
        element: i18n.t('Download data...'),
    }], [setDownloadDialogOpenStatus]);

    const handleCloseDialog = useCallback(() => {
        setDownloadDialogOpenStatus(false);
    }, [setDownloadDialogOpenStatus]);

    return (
        <React.Fragment>
            <EventWorkingListsRowMenuSetup
                {...passOnProps}
                programId={program.id}
                customListViewMenuContents={customListViewMenuContents}
            />
            <DownloadDialog
                open={downloadDialogOpen}
                onClose={handleCloseDialog}
                request={downloadRequest}
                programStageId={program.stage.id}
            />
        </React.Fragment>
    );
};
