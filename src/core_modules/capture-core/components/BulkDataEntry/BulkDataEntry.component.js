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
    displayFrontPageList,
    page,
    classes,
}: Props) => {
    const { activeList, removeActiveList } = useActiveBulkDataEntryList(programId);

    const onClose = useCallback(async () => {
        await removeActiveList();
        setShowBulkDataEntryPlugin(false);
    }, [setShowBulkDataEntryPlugin, removeActiveList]);

    const onBackToOriginPage = useCallback(() => {
        setShowBulkDataEntryPlugin(false);
    }, [setShowBulkDataEntryPlugin]);

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
            />
        </div>
    );
};

export const BulkDataEntry = withStyles(styles)(BulkDataEntryPlain);
