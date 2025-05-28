// @flow
import React, { useCallback } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { spacers } from '@dhis2/ui';
import type { Props } from './BulkDataEntry.types';
import { BulkDataEntryPlugin } from './BulkDataEntryPlugin';
import { BulkDataEntryBreadcrumb } from '../Breadcrumbs/BulkDataEntryBreadcrumb';
import { useBulkDataEntryConfigurations } from '../common/bulkDataEntry';

const styles = () => ({
    container: {
        margin: spacers.dp16,
    },
});

const BulkDataEntryPlain = ({
    programId,
    onCloseBulkDataEntryPlugin,
    displayFrontPageList,
    page,
    trackedEntityIds,
    classes,
}: Props) => {
    const { activeList, removeActiveList } = useBulkDataEntryConfigurations(programId);

    const onComplete = useCallback(async () => {
        await removeActiveList();
        onCloseBulkDataEntryPlugin();
    }, [onCloseBulkDataEntryPlugin, removeActiveList]);


    if (!activeList) {
        return null;
    }

    return (
        <div className={classes.container}>
            <BulkDataEntryBreadcrumb
                onBackToOriginPage={onCloseBulkDataEntryPlugin}
                programId={programId}
                displayFrontPageList={displayFrontPageList}
                page={page}
            />
            <BulkDataEntryPlugin
                configKey={activeList.configKey}
                dataKey={activeList.dataKey}
                pluginSource={activeList.pluginSource}
                onComplete={onComplete}
                onDefer={onCloseBulkDataEntryPlugin}
                trackedEntityIds={trackedEntityIds}
            />
        </div>
    );
};

export const BulkDataEntry = withStyles(styles)(BulkDataEntryPlain);
