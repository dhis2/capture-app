// @flow
import React, { type ComponentType, useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button, spacers, DropdownButton, FlyoutMenu, MenuItem, SplitButton } from '@dhis2/ui';
import { scopeTypes } from '../../metaData';
import { useScopeInfo } from '../../hooks/useScopeInfo';
import type { PlainProps } from './TopBarActions.types';

const styles = () => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: `${spacers.dp8}`,
        gap: `${spacers.dp4}`,
        height: '40px',
    },
});

const ActionButtonsPlain = ({
    onNewClick,
    onNewClickWithoutProgramId,
    onFindClick,
    onFindClickWithoutProgramId,
    selectedProgramId,
    classes,
    openConfirmDialog,
}: PlainProps & CssClasses) => {
    const { trackedEntityName, scopeType, programName } = useScopeInfo(selectedProgramId);
    const [openSearch, setOpenSearch] = useState(false);

    useEffect(() => {
        setOpenSearch(false);
    }, [openConfirmDialog]);

    return (
        <div className={classes.container}>
            {scopeType !== scopeTypes.TRACKER_PROGRAM && scopeType !== scopeTypes.EVENT_PROGRAM ? (
                <Button
                    small
                    secondary
                    dataTest="new-event-button"
                    className={classes.marginRight}
                    onClick={onNewClickWithoutProgramId}
                >
                    {i18n.t('Create new')}
                </Button>
            ) : (
                <SplitButton
                    small
                    secondary
                    dataTest="new-button"
                    className={classes.marginRight}
                    onClick={() => { onNewClick(); }}
                    component={
                        <FlyoutMenu dense maxWidth="250px">
                            <MenuItem
                                dataTest="new-menuitem-one"
                                label={`${i18n.t('Create new in another program')}...`}
                                onClick={() => { onNewClickWithoutProgramId(); }}
                            />
                        </FlyoutMenu>
                    }
                >
                    {scopeType === scopeTypes.TRACKER_PROGRAM && (
                        i18n.t('Create new {{trackedEntityType}}', {
                            trackedEntityType: trackedEntityName,
                            interpolation: { escapeValue: false },
                        })
                    )}
                    {scopeType === scopeTypes.EVENT_PROGRAM && (
                        i18n.t('Create new event')
                    )}
                </SplitButton>
            )}

            {scopeType !== scopeTypes.TRACKER_PROGRAM ? (
                <Button
                    small
                    secondary
                    dataTest="find-button"
                    className={classes.marginRight}
                    onClick={onFindClickWithoutProgramId}
                >
                    {i18n.t('Search')}
                </Button>
            ) : (
                <DropdownButton
                    small
                    secondary
                    dataTest="find-button"
                    className={classes.marginRight}
                    open={openSearch}
                    onClick={() => setOpenSearch(prev => !prev)}
                    component={
                        <FlyoutMenu dense maxWidth="250px">
                            <MenuItem
                                dataTest="find-menuitem-one"
                                label={i18n.t('Search for a {{trackedEntityName}} in {{programName}}', {
                                    trackedEntityName,
                                    programName,
                                    interpolation: { escapeValue: false },
                                })}
                                onClick={() => { onFindClick(); setOpenSearch(prev => !prev); }}
                            />
                            <MenuItem
                                dataTest="find-menuitem-two"
                                label={`${i18n.t('Search')}...`}
                                onClick={() => { onFindClickWithoutProgramId(); setOpenSearch(prev => !prev); }}
                            />
                        </FlyoutMenu>
                    }
                >
                    {i18n.t('Search')}
                </DropdownButton>
            )}
        </div>
    );
};

export const ActionButtons: ComponentType<PlainProps> = withStyles(styles)(ActionButtonsPlain);
