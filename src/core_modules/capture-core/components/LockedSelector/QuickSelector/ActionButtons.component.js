// @flow
import React, { type ComponentType, useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button, colors, DropdownButton, FlyoutMenu, MenuItem } from '@dhis2/ui';
import { getProgramFromProgramIdThrowIfNotFound, TrackerProgram } from '../../../metaData';

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
    onFindClick: () => void,
    onFindClickWithoutProgramId: () => void,
    showResetButton: boolean,
|}>;

const programTypes = {
    TRACKER_PROGRAM: 'TRACKER_PROGRAM',
    EVENT_PROGRAM: 'EVENT_PROGRAM',
};

function useProgramInfo(programId) {
    let programName = '';
    let trackedEntityName = '';

    const program = useMemo(() => (
        programId ? getProgramFromProgramIdThrowIfNotFound(programId) : null),
    [programId]);

    const programType = program instanceof TrackerProgram
        ? programTypes.TRACKER_PROGRAM
        : programTypes.EVENT_PROGRAM;

    if (program) {
        programName = program.name;
    }
    if (program instanceof TrackerProgram) {
        trackedEntityName = program.trackedEntityType.name.toLowerCase();
    }

    return { trackedEntityName, programType, programName };
}

const ActionButtonsPlain = ({
    onStartAgainClick,
    onNewClick,
    onFindClick,
    onFindClickWithoutProgramId,
    selectedProgramId,
    classes,
    showResetButton,
}: Props & CssClasses) => {
    const typeName =
      selectedProgramId instanceof TrackerProgram
          ?
          selectedProgramId.trackedEntityType.name
          :
          'Event';

    const { trackedEntityName, programType, programName } = useProgramInfo(selectedProgramId);

    return (
        <>
            <Button
                small
                secondary
                dataTest="dhis2-capture-new-event-button"
                onClick={onNewClick}
            >
                {
                    selectedProgramId ?
                        i18n.t('New {{typeName}}', { typeName })
                        :
                        i18n.t('New')
                }
            </Button>
            {
                programType !== programTypes.TRACKER_PROGRAM ?
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
