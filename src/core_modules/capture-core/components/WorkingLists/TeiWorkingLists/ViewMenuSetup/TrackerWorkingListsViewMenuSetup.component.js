// @flow
import React, { useCallback, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
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
import { useSelectedRowsController } from '../../WorkingListsBase/BulkActionBar';
import { TrackedEntityBulkActions } from '../TrackedEntityBulkActions';

export const TrackerWorkingListsViewMenuSetup = ({
    onLoadView,
    onUpdateList,
    storeId,
    program,
    programStageId,
    orgUnitId,
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

    const handleCustomUpdateTrigger = useCallback((disableClearSelection?: boolean) => {
        const id = uuid();
        setCustomUpdateTrigger(id);
        !disableClearSelection && clearSelection();
    }, [clearSelection]);

    const TrackedEntityBulkActionsComponent = useMemo(() => (
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
        <>
            <TeiWorkingListsSetup
                {...passOnProps}
                customUpdateTrigger={customUpdateTrigger}
                program={program}
                orgUnitId={orgUnitId}
                recordsOrder={recordsOrder}
                programStageId={programStageId}
                customListViewMenuContents={customListViewMenuContents}
                onLoadView={injectDownloadRequestToLoadView}
                onUpdateList={injectDownloadRequestToUpdateList}
                selectedRows={selectedRows}
                allRowsAreSelected={allRowsAreSelected}
                selectionInProgress={selectionInProgress}
                onSelectAll={selectAllRows}
                onRowSelect={toggleRowSelected}
                bulkActionBarComponent={TrackedEntityBulkActionsComponent}
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
