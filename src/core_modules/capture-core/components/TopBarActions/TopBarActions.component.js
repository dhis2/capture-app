// @flow
import React, { type ComponentType, useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button, colors, DropdownButton, FlyoutMenu, MenuItem } from '@dhis2/ui';
import { scopeTypes } from '../../metaData';
import { useScopeInfo } from '../../hooks/useScopeInfo';
import type { PlainProps } from './TopBarActions.types';

const styles = ({ typography }) => ({
    container: {
        marginLeft: typography.pxToRem(8),
        marginBottom: typography.pxToRem(8),
        marginTop: typography.pxToRem(8),
    },
    marginRight: {
        marginRight: typography.pxToRem(12),
    },
    buttonAsLink: {
        fontSize: typography.pxToRem(13),
        background: 'none!important',
        border: 'none',
        padding: '0!important',
        color: colors.grey700,
        textDecoration: 'underline',
        cursor: 'pointer',
    },
});

const ActionButtonsPlain = ({
    onStartAgainClick,
    onNewClick,
    onNewClickWithoutProgramId,
    onFindClick,
    onFindClickWithoutProgramId,
    selectedProgramId,
    classes,
    showResetButton,
    openConfirmDialog,
}: PlainProps & CssClasses) => {
    const { trackedEntityName, scopeType, programName } = useScopeInfo(selectedProgramId);
    const [openNew, setOpenNew] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);
    useEffect(() => {
        setOpenNew(false);
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
                    {i18n.t('New')}
                </Button>
            ) : (
                <DropdownButton
                    small
                    secondary
                    dataTest="new-button"
                    className={classes.marginRight}
                    open={openNew}
                    onClick={() => setOpenNew(prev => !prev)}
                    component={
                        <FlyoutMenu dense maxWidth="250px">
                            <MenuItem
                                dataTest="new-menuitem-one"
                                label={i18n.t('New {{trackedEntityName}} in {{programName}}', {
                                    trackedEntityName,
                                    programName,
                                    interpolation: { escapeValue: false },
                                })}
                                onClick={() => { setOpenNew(prev => !prev); onNewClick(); }}
                            />
                            <MenuItem
                                dataTest="new-menuitem-two"
                                label={`${i18n.t('New')}...`}
                                onClick={() => { setOpenNew(prev => !prev); onNewClickWithoutProgramId(); }}
                            />
                        </FlyoutMenu>
                    }
                >
                    {i18n.t('New')}
                </DropdownButton>
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
                                onClick={() => { setOpenSearch(prev => !prev); onFindClick(); }}
                            />
                            <MenuItem
                                dataTest="find-menuitem-two"
                                label={`${i18n.t('Search')}...`}
                                onClick={() => { setOpenSearch(prev => !prev); onFindClickWithoutProgramId(); }}
                            />
                        </FlyoutMenu>
                    }
                >
                    {i18n.t('Search')}
                </DropdownButton>
            )}

            {showResetButton ? (
                <button className={classes.buttonAsLink} data-test="start-again-button" onClick={onStartAgainClick}>
                    {i18n.t('Clear selections')}
                </button>
            ) : null}
        </div>
    );
};

export const ActionButtons: ComponentType<PlainProps> = withStyles(styles)(ActionButtonsPlain);
