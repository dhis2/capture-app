// @flow
import React, { useCallback } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { spacers } from '@dhis2/ui';
import type { Props } from './BulkDataEntry.types';
import { BulkDataEntryPlugin } from './BulkDataEntryPlugin';
import { BulkDataEntryBreadcrumb } from '../Breadcrumbs/BulkDataEntryBreadcrumb';
import { useActiveBulkDataEntryList } from '../WidgetBulkDataEntry';

const styles = () => ({
    container: {
        margin: spacers.dp16,
    },
});

const BulkDataEntryPlain = ({
    programId,
    setShowBulkDataEntryPlugin,
    setBulkDataEntryTrackedEntities,
    displayFrontPageList,
    page,
    trackedEntities,
    classes,
}: Props) => {
    const { activeList, removeActiveList } = useActiveBulkDataEntryList(programId);

    const onClose = useCallback(async () => {
        await removeActiveList();
        setShowBulkDataEntryPlugin(false);
        setBulkDataEntryTrackedEntities && setBulkDataEntryTrackedEntities(null);
    }, [setShowBulkDataEntryPlugin, setBulkDataEntryTrackedEntities, removeActiveList]);

    const onBackToOriginPage = useCallback(() => {
        setShowBulkDataEntryPlugin(false);
        setBulkDataEntryTrackedEntities && setBulkDataEntryTrackedEntities(null);
    }, [setShowBulkDataEntryPlugin, setBulkDataEntryTrackedEntities]);

    if (!activeList) {
        return null;
    }

    return (
        <div className={classes.container}>
            <BulkDataEntryBreadcrumb
                onBackToOriginPage={onBackToOriginPage}
                programId={programId}
                displayFrontPageList={displayFrontPageList}
                page={page}
            />
            <BulkDataEntryPlugin
                configKey={activeList.configKey}
                dataKey={activeList.dataKey}
                pluginSource={activeList.pluginSource}
                onClose={onClose}
                onBackToOriginPage={onBackToOriginPage}
                trackedEntities={trackedEntities}
            />
        </div>
    );
};

export const BulkDataEntry = withStyles(styles)(BulkDataEntryPlain);
