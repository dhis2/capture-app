// @flow
import React, { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { withStyles } from '@material-ui/core/styles';
import { spacers } from '@dhis2/ui';
import { removeBulkDataEntry } from 'capture-core/MetaDataStoreUtils/bulkDataEntry';
import { ReactQueryAppNamespace } from 'capture-core/utils/reactQueryHelpers';
import type { Props } from './BulkDataEntry.types';
import { BulkDataEntryPlugin } from './BulkDataEntryPlugin';
import { BulkDataEntryBreadcrumb } from '../Breadcrumbs/BulkDataEntryBreadcrumb';
import { useBulkDataEntryFromIndexedDB } from '../../utils/cachedDataHooks/useBulkDataEntryFromIndexedDB';

const styles = () => ({
    container: {
        margin: spacers.dp16,
    },
});

const BulkDataEntryPlain = ({
    programId,
    setShowBulkDataEntryPlugin,
    displayFrontPageList,
    trackedEntityName,
    page,
    classes,
}: Props) => {
    const { cachedBulkDataEntry } = useBulkDataEntryFromIndexedDB(programId);
    const queryClient = useQueryClient();

    const onClose = useCallback(async () => {
        await removeBulkDataEntry(programId);
        await queryClient.refetchQueries([ReactQueryAppNamespace, 'indexedDB', 'cachedBulkDataEntry', programId]);
        setShowBulkDataEntryPlugin(false);
    }, [programId, setShowBulkDataEntryPlugin, queryClient]);

    const onBackToOriginPage = useCallback(() => {
        setShowBulkDataEntryPlugin(false);
    }, [setShowBulkDataEntryPlugin]);

    if (!cachedBulkDataEntry?.activeList) {
        return null;
    }

    return (
        <div className={classes.container}>
            <BulkDataEntryBreadcrumb
                onBackToOriginPage={onBackToOriginPage}
                programId={programId}
                trackedEntityName={trackedEntityName}
                displayFrontPageList={displayFrontPageList}
                page={page}
            />
            <BulkDataEntryPlugin
                {...cachedBulkDataEntry.activeList}
                onClose={onClose}
                onBackToOriginPage={onBackToOriginPage}
            />
        </div>
    );
};

export const BulkDataEntry = withStyles(styles)(BulkDataEntryPlain);
