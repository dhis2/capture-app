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
    trackedEntities,
    classes,
}: Props) => {
    const { activeList, removeActiveList } = useBulkDataEntryConfigurations(programId);

    const onClose = useCallback(async () => {
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
                onClose={onClose}
                onBackToOriginPage={onCloseBulkDataEntryPlugin}
                trackedEntities={trackedEntities}
            />
        </div>
    );
};

export const BulkDataEntry = withStyles(styles)(BulkDataEntryPlain);
