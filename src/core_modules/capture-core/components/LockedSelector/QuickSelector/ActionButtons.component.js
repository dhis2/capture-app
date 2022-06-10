// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button, colors, DropdownButton, FlyoutMenu, MenuItem } from '@dhis2/ui';
import { scopeTypes } from '../../../metaData';
import { useScopeInfo } from '../../../hooks/useScopeInfo';


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
        <div className={classes.container}>
            {
                (scopeType !== scopeTypes.TRACKER_PROGRAM && scopeType !== scopeTypes.EVENT_PROGRAM) ?
                    <Button
                        small
                        secondary
                        dataTest="new-event-button"
                        className={classes.marginRight}
                        onClick={onNewClickWithoutProgramId}
                    >
                        { i18n.t('New') }
                    </Button>
                    :
                    <DropdownButton
                        small
                        secondary
                        dataTest="new-button"
                        className={classes.marginRight}
                        component={
                            <FlyoutMenu
                                dense
                                maxWidth="250px"
                            >
                                <MenuItem
                                    dataTest="new-menuitem-one"
                                    label={i18n.t('New {{trackedEntityName}} in {{programName}}', { trackedEntityName, programName })}
                                    onClick={onNewClick}
                                />
                                <MenuItem
                                    dataTest="new-menuitem-two"
                                    label={`${i18n.t('New')}...`}
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
                    null
                    :
                    <DropdownButton
                        small
                        secondary
                        dataTest="find-button"
                        className={classes.marginRight}
                        component={
                            <FlyoutMenu
                                dense
                                maxWidth="250px"
                            >
                                <MenuItem
                                    dataTest="find-menuitem-one"
                                    label={i18n.t('Search for a {{trackedEntityName}} in {{programName}}', { trackedEntityName, programName })}
                                    onClick={onFindClick}
                                />
                                <MenuItem
                                    dataTest="find-menuitem-two"
                                    label={`${i18n.t('Search')}...`}
                                    onClick={onFindClickWithoutProgramId}
                                />
                            </FlyoutMenu>
                        }
                    >
                        { i18n.t('Search') }
                    </DropdownButton>
            }

            {
                showResetButton ?
                    <button
                        className={classes.buttonAsLink}
                        data-test="start-again-button"
                        onClick={onStartAgainClick}
                    >
                        { i18n.t('Clear selections') }
                    </button>
                    :
                    null
            }
        </div>
    );
};

export const ActionButtons: ComponentType<Props> = withStyles(styles)(ActionButtonsPlain);
