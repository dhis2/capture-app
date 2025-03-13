// @flow
import React, { useEffect, useState, useCallback } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { spacers } from '@dhis2/ui';
import { getBatchDataEntry, removeBatchDataEntry } from 'capture-core/MetaDataStoreUtils/batchDataEntry';
import type { Props } from './BatchDataEntry.types';
import { BatchDataEntryPlugin } from './BatchDataEntryPlugin';
import { BatchDataEntryBreadcrumb } from '../Breadcrumbs/BatchDataEntryBreadcrumb';

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

    useEffect(() => {
        const fetchData = async () => {
            const batchDataEntry = await getBatchDataEntry(programId);
            batchDataEntry?.activeList && setPluginProps(batchDataEntry.activeList);
        };
        programId && fetchData();
    }, [programId]);

    const onClose = useCallback(async () => {
        await removeBatchDataEntry(programId);
        setPluginProps();
        setShowBatchDataEntryPlugin(false);
    }, [programId, setShowBatchDataEntryPlugin]);

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
