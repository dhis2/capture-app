// @flow
import React, { useState, useCallback, type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { useQueryClient } from 'react-query';
import { setBulkDataEntry } from 'capture-core/MetaDataStoreUtils/bulkDataEntry';
import { ReactQueryAppNamespace } from 'capture-core/utils/reactQueryHelpers';
import { DropdownButton, MenuItem, MenuSectionHeader, FlyoutMenu, colors } from '@dhis2/ui';
import { useBulkDataEntryConfigurations } from '../../../../../WidgetBulkDataEntry';

const styles = {
    container: {
        backgroundColor: `${colors.grey100} !important`,
        border: `1px solid ${colors.grey500} !important`,
    },
};

type Props = {
    programId: string,
    setShowBulkDataEntryPlugin: (show: boolean) => void,
    selectionInProgress: ?boolean,
};

const BulkDataEntryActionDropdownButtonPlain = ({
    programId,
    setShowBulkDataEntryPlugin,
    selectionInProgress,
    classes,
}: Props & CssClasses) => {
    const [isOpen, setOpen] = useState(false);
    const { bulkDataEntryConfigurations, isLoading, isError } = useBulkDataEntryConfigurations(programId);
    const queryClient = useQueryClient();

    const onSelectConfiguration = useCallback(
        async (dataStoreConfiguration) => {
            await setBulkDataEntry({ id: programId, activeList: dataStoreConfiguration });
            await queryClient.refetchQueries([ReactQueryAppNamespace, 'indexedDB', 'cachedBulkDataEntry', programId]);
            setShowBulkDataEntryPlugin(true);
        },
        [programId, setShowBulkDataEntryPlugin, queryClient],
    );

    if (isError || isLoading || !bulkDataEntryConfigurations || bulkDataEntryConfigurations.length === 0) {
        return null;
    }

    return (
        <DropdownButton
            secondary
            open={isOpen}
            small
            onClick={() => setOpen(prev => !prev)}
            className={classes.container}
            component={
                <>
                    <MenuSectionHeader label={i18n.t('Available bulk entry forms')} />
                    <FlyoutMenu dense maxWidth="250px">
                        {bulkDataEntryConfigurations.map(config => (
                            <MenuItem
                                key={config.dataKey}
                                label={config.title}
                                value={config.dataKey}
                                onClick={() => {
                                    setOpen(prev => !prev);
                                    onSelectConfiguration({
                                        configKey: config.configKey,
                                        dataKey: config.dataKey,
                                        pluginSource: config.pluginSource,
                                        title: config.title,
                                    });
                                }}
                            />
                        ))}
                    </FlyoutMenu>
                </>
            }
        >
            {selectionInProgress ? i18n.t('Open in bulk data entry') : i18n.t('Open page in bulk data entry')}
        </DropdownButton>
    );
};

export const BulkDataEntryActionDropdownButton: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(
    BulkDataEntryActionDropdownButtonPlain,
);
