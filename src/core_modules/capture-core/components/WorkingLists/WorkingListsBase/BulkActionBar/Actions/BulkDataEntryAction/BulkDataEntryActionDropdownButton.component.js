// @flow
import React, { useState, useCallback, type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { DropdownButton, MenuItem, MenuSectionHeader, FlyoutMenu, colors } from '@dhis2/ui';
import { useBulkDataEntryConfigurations, useActiveBulkDataEntryList } from '../../../../../WidgetBulkDataEntry';

const styles = {
    container: {
        backgroundColor: `${colors.grey100} !important`,
        border: `1px solid ${colors.grey500} !important`,
    },
    flyoutMenu: {
        width: '100%',
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
    const [isOpen, setIsOpen] = useState(false);
    const { setActiveList } = useActiveBulkDataEntryList(programId);
    const { bulkDataEntryConfigurations, isLoading, isError } = useBulkDataEntryConfigurations(programId);

    const onSelectConfiguration = useCallback(
        async (configKey) => {
            await setActiveList(configKey);
            setShowBulkDataEntryPlugin(true);
        },
        [setShowBulkDataEntryPlugin, setActiveList],
    );

    if (isError || isLoading || !bulkDataEntryConfigurations || bulkDataEntryConfigurations.length === 0) {
        return null;
    }

    return (
        <DropdownButton
            secondary
            open={isOpen}
            small
            onClick={() => setIsOpen(prev => !prev)}
            className={classes.container}
            dataTest="dropdown-button-bulk-data-entry"
            component={
                <>
                    <MenuSectionHeader label={i18n.t('Available bulk entry forms')} />
                    <FlyoutMenu dense maxWidth="250px" className={classes.flyoutMenu} >
                        {bulkDataEntryConfigurations.map(config => (
                            <MenuItem
                                key={config.dataKey}
                                label={config.title}
                                value={config.dataKey}
                                onClick={() => {
                                    setIsOpen(prev => !prev);
                                    onSelectConfiguration(config.configKey);
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
