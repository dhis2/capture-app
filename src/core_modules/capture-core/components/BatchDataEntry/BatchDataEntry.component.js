// @flow
import React, { useEffect, useState, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { withStyles } from '@material-ui/core/styles';
import { spacers } from '@dhis2/ui';
import { removeBatchDataEntry } from 'capture-core/MetaDataStoreUtils/batchDataEntry';
import { ReactQueryAppNamespace } from 'capture-core/utils/reactQueryHelpers';
import type { Props } from './BatchDataEntry.types';
import { BatchDataEntryPlugin } from './BatchDataEntryPlugin';
import { BatchDataEntryBreadcrumb } from '../Breadcrumbs/BatchDataEntryBreadcrumb';
import { useBatchDataEntryFromIndexedDB } from '../../utils/cachedDataHooks/useBatchDataEntryFromIndexedDB';

const styles = () => ({
    container: {
        margin: spacers.dp16,
    },
});

const BatchDataEntryPlain = ({
    programId,
    setShowBatchDataEntryPlugin,
    displayFrontPageList,
    trackedEntityName,
    page,
    classes,
}: Props) => {
    const [pluginProps, setPluginProps] = useState();
    const { cachedBatchDataEntry } = useBatchDataEntryFromIndexedDB(programId);
    const queryClient = useQueryClient();

    useEffect(() => {
        setPluginProps(cachedBatchDataEntry?.activeList);
    }, [cachedBatchDataEntry?.activeList]);

    const onClose = useCallback(async () => {
        await removeBatchDataEntry(programId);
        await queryClient.refetchQueries([ReactQueryAppNamespace, 'indexedDB', 'cachedBatchDataEntry', programId]);
        setShowBatchDataEntryPlugin(false);
    }, [programId, setShowBatchDataEntryPlugin, queryClient]);

    const onBackToOriginPage = useCallback(() => {
        setShowBatchDataEntryPlugin(false);
    }, [setShowBatchDataEntryPlugin]);

    if (!pluginProps) {
        return null;
    }

    return (
        <div className={classes.container}>
            <BatchDataEntryBreadcrumb
                onBackToOriginPage={onBackToOriginPage}
                programId={programId}
                trackedEntityName={trackedEntityName}
                displayFrontPageList={displayFrontPageList}
                page={page}
            />
            <BatchDataEntryPlugin {...pluginProps} onClose={onClose} onBackToOriginPage={onBackToOriginPage} />
        </div>
    );
};

export const BatchDataEntry = withStyles(styles)(BatchDataEntryPlain);
