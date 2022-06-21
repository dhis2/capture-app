// @flow
import React, { useState, useMemo, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useConfig } from '@dhis2/app-runtime';
import { buildUrl } from 'capture-core-utils';
import { EventWorkingListsRowMenuSetup } from '../RowMenuSetup';
import { DownloadDialog } from './DownloadDialog';
import type { CustomMenuContents } from '../../WorkingListsBase';
import type { Props } from './EventWorkingListsViewMenuSetup.types';

export const EventWorkingListsViewMenuSetup = ({ downloadRequest, program, ...passOnProps }: Props) => {
    const [downloadDialogOpen, setDownloadDialogOpenStatus] = useState(false);
    const { baseUrl, apiVersion } = useConfig();
    const absoluteApiPath = buildUrl(baseUrl, `api/${apiVersion}`);
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
                absoluteApiPath={absoluteApiPath}
            />
        </React.Fragment>
    );
};
