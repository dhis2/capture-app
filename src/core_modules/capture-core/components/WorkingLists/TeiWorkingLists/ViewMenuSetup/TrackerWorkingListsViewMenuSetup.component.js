// @flow
import React, { useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useDataEngine } from '@dhis2/app-runtime';
import { makeQuerySingleResource } from 'capture-core/utils/api';
import i18n from '@dhis2/d2-i18n';
import { TeiWorkingListsSetup } from '../Setup';
import type { CustomMenuContents } from '../../WorkingListsBase';
import type { Props } from './TrackerWorkingListsViewMenuSetup.types';
import { DownloadDialog } from '../../WorkingListsCommon';
import { computeDownloadRequest } from './downloadRequest';
import { convertToClientConfig } from '../helpers/TEIFilters';
import { FEATURES, useFeature } from '../../../../../capture-core-utils';

export const TrackerWorkingListsViewMenuSetup = ({
    onLoadView,
    onUpdateList,
    storeId,
    programStageId,
    orgUnitId,
    ...passOnProps
}: Props) => {
    const hasCSVSupport = useFeature(FEATURES.trackedEntitiesCSV);
    const downloadRequest = useSelector(
        ({ workingLists }) => workingLists[storeId] && workingLists[storeId].currentRequest,
    );
    const dataEngine = useDataEngine();
    const [downloadDialogOpen, setDownloadDialogOpenStatus] = useState(false);
    const customListViewMenuContents: CustomMenuContents = useMemo(() => {
        if (programStageId || !orgUnitId) {
            return [];
        }

        return [
            {
                key: 'downloadData',
                clickHandler: () => setDownloadDialogOpenStatus(true),
                element: i18n.t('Download data...'),
            },
        ];
    }, [setDownloadDialogOpenStatus, programStageId, orgUnitId]);

    const handleCloseDialog = useCallback(() => {
        setDownloadDialogOpenStatus(false);
    }, [setDownloadDialogOpenStatus]);

    const injectDownloadRequestToLoadView = useCallback(
        async (selectedTemplate: Object, context: Object, meta: Object) => {
            const { columnsMetaForDataFetching, filtersOnlyMetaForDataFetching } = meta;
            const querySingleResource = makeQuerySingleResource(dataEngine.query.bind(dataEngine));
            const clientConfig = await convertToClientConfig(
                selectedTemplate,
                columnsMetaForDataFetching,
                querySingleResource,
            );
            const currentRequest = computeDownloadRequest({
                clientConfig,
                context: {
                    programId: context.programId,
                    orgUnitId: context.orgUnitId,
                    storeId,
                },
                meta: { columnsMetaForDataFetching },
                filtersOnlyMetaForDataFetching,
            });

            return onLoadView(selectedTemplate, { ...context, currentRequest }, meta);
        },
        [onLoadView, dataEngine, storeId],
    );

    const injectDownloadRequestToUpdateList = useCallback(
        (queryArgs: Object, meta: Object) => {
            const { lastTransaction, columnsMetaForDataFetching, filtersOnlyMetaForDataFetching } = meta;
            const currentRequest = computeDownloadRequest({
                clientConfig: queryArgs,
                context: {
                    programId: queryArgs.programId,
                    orgUnitId: queryArgs.orgUnitId,
                    storeId,
                },
                meta: { columnsMetaForDataFetching },
                filtersOnlyMetaForDataFetching,
            });
            return onUpdateList(queryArgs, { ...meta, currentRequest }, lastTransaction);
        },
        [onUpdateList, storeId],
    );

    return (
        <>
            <TeiWorkingListsSetup
                {...passOnProps}
                orgUnitId={orgUnitId}
                programStageId={programStageId}
                customListViewMenuContents={customListViewMenuContents}
                onLoadView={injectDownloadRequestToLoadView}
                onUpdateList={injectDownloadRequestToUpdateList}
            />
            <DownloadDialog
                open={downloadDialogOpen}
                onClose={handleCloseDialog}
                request={downloadRequest}
                hasCSVSupport={hasCSVSupport}
            />
        </>
    );
};
