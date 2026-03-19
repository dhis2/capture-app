import React, { useCallback } from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { spacers } from '@dhis2/ui';
import type { PlainProps } from './BulkDataEntry.types';
import { BulkDataEntryPlugin } from './BulkDataEntryPlugin';
import { BulkDataEntryBreadcrumb } from '../Breadcrumbs/BulkDataEntryBreadcrumb';
import { useBulkDataEntryConfigurations } from '../common/bulkDataEntry';

const styles = () => ({
    container: {
        margin: spacers.dp16,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
});

const BulkDataEntryPlain = ({
    programId,
    onCloseBulkDataEntryPlugin,
    displayFrontPageList,
    page,
    trackedEntityIds,
    classes,
}: PlainProps & WithStyles<typeof styles>) => {
    const { activeList, removeActiveList } = useBulkDataEntryConfigurations(programId);

    const onComplete = useCallback(async () => {
        await removeActiveList();
        onCloseBulkDataEntryPlugin();
    }, [onCloseBulkDataEntryPlugin, removeActiveList]);

    const onDefer = useCallback(() => {
        onCloseBulkDataEntryPlugin();
    }, [onCloseBulkDataEntryPlugin]);

    if (!activeList) {
        return null;
    }

    return (
        <div className={classes.container}>
            <BulkDataEntryBreadcrumb
                onBackToOriginPage={onDefer}
                programId={programId}
                displayFrontPageList={displayFrontPageList}
                page={page}
            />
            <BulkDataEntryPlugin
                configKey={activeList.configKey}
                dataKey={activeList.dataKey}
                pluginSource={activeList.pluginSource}
                onComplete={onComplete}
                onDefer={onDefer}
                trackedEntityIds={trackedEntityIds}
            />
        </div>
    );
};

export const BulkDataEntry = withStyles(styles)(BulkDataEntryPlain);
