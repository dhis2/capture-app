// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import { useConfig } from '@dhis2/app-runtime';
import { buildUrl } from 'capture-core-utils';
import { DownloadDialogComponent } from './DownloadDialog.component';
import type { Props } from './DownloadDialog.types';

export const DownloadDialog = ({ storeId, open, onClose }: Props) => {
    const { baseUrl, apiVersion } = useConfig();
    const absoluteApiPath = buildUrl(baseUrl, `api/${apiVersion}`);
    const downloadRequest = useSelector(
        ({ workingLists }) => workingLists[storeId] && workingLists[storeId].currentRequest,
    );

    return (
        <DownloadDialogComponent
            request={downloadRequest}
            absoluteApiPath={absoluteApiPath}
            open={open}
            onClose={onClose}
        />
    );
};
