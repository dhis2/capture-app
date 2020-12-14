// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button, colors, DropdownButton, FlyoutMenu, MenuItem } from '@dhis2/ui';
import { scopeTypes } from '../../../metaData';
import { useScopeInfo } from '../../../hooks/useScopeInfo';


const styles = ({ typography }) => ({
    marginLeft: {
        marginLeft: typography.pxToRem(12),
    },
    buttonAsLink: {
        marginLeft: typography.pxToRem(12),
        fontSize: typography.pxToRem(13),
        background: 'none!important',
        border: 'none',
        padding: '0!important',
        color: colors.grey700,
        textDecoration: 'underline',
        cursor: 'pointer',
    },
});

type Props = $ReadOnly<{|
    selectedProgramId: string,
    onStartAgainClick: () => void,
    onNewClick: () => void,
    onNewClickWithoutProgramId: () => void,
    onFindClick: () => void,
    onFindClickWithoutProgramId: () => void,
    showResetButton: boolean,
|}>;


const ActionButtonsPlain = ({
    onStartAgainClick,
    onNewClick,
    onNewClickWithoutProgramId,
    onFindClick,
    onFindClickWithoutProgramId,
    selectedProgramId,
    classes,
    showResetButton,
}: Props & CssClasses) => {
    const { trackedEntityName, scopeType, programName } = useScopeInfo(selectedProgramId);

    return (
        <>
            {
                (scopeType !== scopeTypes.TRACKER_PROGRAM && scopeType !== scopeTypes.EVENT_PROGRAM) ?
                    <Button
                        small
                        secondary
                        dataTest="dhis2-capture-new-event-button"
                        className={classes.marginLeft}
                        onClick={onNewClickWithoutProgramId}
                    >
                        { i18n.t('New') }
                    </Button>
                    :
                    <DropdownButton
                        small
                        secondary
                        dataTest="dhis2-capture-new-button"
                        className={classes.marginLeft}
                        component={
                            <FlyoutMenu
                                dense
                                maxWidth="250px"
                            >
                                <MenuItem
                                    dataTest="dhis2-capture-new-menuitem-one"
                                    label={`New ${trackedEntityName} in ${programName}`}
                                    onClick={onNewClick}
                                />
                                <MenuItem
                                    dataTest="dhis2-capture-new-menuitem-two"
                                    label="New..."
                                    onClick={onNewClickWithoutProgramId}
                                />
                            </FlyoutMenu>
                        }
                    >
                        { i18n.t('New') }
                    </DropdownButton>
            }

            {
                scopeType !== scopeTypes.TRACKER_PROGRAM ?
                    <Button
                        small
                        secondary
                        dataTest="dhis2-capture-find-button"
                        className={classes.marginLeft}
                        onClick={onFindClickWithoutProgramId}
                    >
                        { i18n.t('Find') }
                    </Button>
                    :
                    <DropdownButton
                        small
                        secondary
                        dataTest="dhis2-capture-find-button"
                        className={classes.marginLeft}
                        component={
                            <FlyoutMenu
                                dense
                                maxWidth="250px"
                            >
                                <MenuItem
                                    dataTest="dhis2-capture-find-menuitem-one"
                                    label={`Find a ${trackedEntityName} in ${programName}`}
                                    onClick={onFindClick}
                                />
                                <MenuItem
                                    dataTest="dhis2-capture-find-menuitem-two"
                                    label="Find..."
                                    onClick={onFindClickWithoutProgramId}
                                />
                            </FlyoutMenu>
                        }
                    >
                        { i18n.t('Find') }
                    </DropdownButton>
            }

            {
                showResetButton ?
                    <button
                        className={classes.buttonAsLink}
                        data-test="dhis2-capture-start-again-button"
                        onClick={onStartAgainClick}
                    >
                        { i18n.t('Clear selections') }
                    </button>
                    :
                    null
            }
        </>
    );
};

export const ActionButtons: ComponentType<Props> = withStyles(styles)(ActionButtonsPlain);
