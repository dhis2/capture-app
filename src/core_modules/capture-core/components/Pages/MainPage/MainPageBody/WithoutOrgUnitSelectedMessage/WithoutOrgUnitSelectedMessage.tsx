import React from 'react';
import { colors } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import { IncompleteSelectionsMessage } from '../../../../IncompleteSelectionsMessage';
import { programTypes, TrackerProgram } from '../../../../../metaData';
import { useProgramInfo } from '../../../../../hooks/useProgramInfo';
import {
    useProgramAccessLevel,
    ProgramAccessLevels,
} from '../../../../WidgetEnrollment/TransferModal/hooks/useProgramAccessLevel';

const styles: Readonly<any> = {
    incompleteMessageContainer: {
        marginTop: '10px',
    },
    incompleteMessageContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        textAlign: 'center',
    },
    actions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    incompleteMessageButton: {
        background: 'none',
        color: 'inherit',
        border: 'none',
        padding: 0,
        font: 'inherit',
        cursor: 'pointer',
        outline: 'inherit',
        textDecoration: 'underline',
        '&:hover': {
            color: colors.grey900,
        },
    },
};

type OwnProps = {
    programId: string;
    onNavigateToWorkingList: () => void;
    onNavigateToSearch: () => void;
};

type Props = OwnProps & WithStyles<typeof styles>;

const WithoutOrgUnitSelectedMessagePlain = ({
    programId,
    onNavigateToWorkingList,
    onNavigateToSearch,
    classes,
}: Props) => {
    const { program, programType } = useProgramInfo(programId);
    const isTracker = programType === programTypes.TRACKER_PROGRAM;
    const { accessLevel } = useProgramAccessLevel({ programId: isTracker ? programId : '' });

    const trackedEntityName = program instanceof TrackerProgram
        ? program.trackedEntityType?.name
        : undefined;
    const showWorkingListLink = !isTracker || Boolean(program?.displayFrontPageList);
    const showSearchLink = isTracker && (
        accessLevel === ProgramAccessLevels.OPEN ||
        accessLevel === ProgramAccessLevels.AUDITED
    );

    return (
        <div
            className={classes.incompleteMessageContainer}
            data-test={'without-orgunit-selected-message'}
        >
            <IncompleteSelectionsMessage>
                <div className={classes.incompleteMessageContent}>
                    <span>{i18n.t('Please select an organisation unit')}</span>
                    <div className={classes.actions}>
                        {showWorkingListLink && (
                            <button
                                className={classes.incompleteMessageButton}
                                onClick={onNavigateToWorkingList}
                                data-test={'go-to-working-list-button'}
                            >
                                {i18n.t('See working list without organisation unit')}
                            </button>
                        )}
                        {showSearchLink && (
                            <button
                                className={classes.incompleteMessageButton}
                                onClick={onNavigateToSearch}
                                data-test={'go-to-search-button'}
                            >
                                {i18n.t('Search for a {{trackedEntityName}}', {
                                    trackedEntityName,
                                    interpolation: { escapeValue: false },
                                })}
                            </button>
                        )}
                    </div>
                </div>
            </IncompleteSelectionsMessage>
        </div>
    );
};

export const WithoutOrgUnitSelectedMessage = withStyles(styles)(WithoutOrgUnitSelectedMessagePlain);
