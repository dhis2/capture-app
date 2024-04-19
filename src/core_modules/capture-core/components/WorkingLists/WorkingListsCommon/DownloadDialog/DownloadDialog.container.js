// @flow
import React from 'react';
import { useConfig } from '@dhis2/app-runtime';
import { buildUrl } from 'capture-core-utils';
import { DownloadDialogComponent } from './DownloadDialog.component';
import type { Props } from './DownloadDialog.types';

export const DownloadDialog = ({ request, open, onClose, hasCSVSupport = true }: Props) => {
    const { baseUrl, apiVersion } = useConfig();
    const absoluteApiPath = buildUrl(baseUrl, `api/${apiVersion}`);

    return (
        <DownloadDialogComponent
            request={request}
            absoluteApiPath={absoluteApiPath}
            open={open}
            onClose={onClose}
            hasCSVSupport={hasCSVSupport}
        />
    );
};
