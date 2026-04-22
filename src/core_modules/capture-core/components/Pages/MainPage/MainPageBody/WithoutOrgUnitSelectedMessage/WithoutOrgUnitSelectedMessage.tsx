import React, { useCallback, useMemo } from 'react';
import { colors } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import { IncompleteSelectionsMessage } from '../../../../IncompleteSelectionsMessage';
import { programTypes } from '../../../../../metaData';
import { useProgramInfo } from '../../../../../hooks/useProgramInfo';
import {
    useProgramAccessLevel,
    ProgramAccessLevels,
} from '../../../../WidgetEnrollment/TransferModal/hooks/useProgramAccessLevel';
import { buildUrlQueryString, useNavigate } from '../../../../../utils/routing';

const styles: Readonly<any> = {
    incompleteMessageContainer: {
        marginTop: '10px',
    },
    incompleteMessageContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        textAlign: 'center',
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
    searchLinkButton: {
        marginTop: '8px',
    },
};

type OwnProps = {
    programId: string;
    setShowAccessible: () => void;
};

type Props = OwnProps & WithStyles<typeof styles>;

const WithoutOrgUnitSelectedMessagePlain = ({ programId, setShowAccessible, classes }: Props) => {
    const { program, programType } = useProgramInfo(programId);
    const isTracker = programType === programTypes.TRACKER_PROGRAM;
    const { accessLevel } = useProgramAccessLevel({ programId: isTracker ? programId : '' });
    const { navigate } = useNavigate();
    const programName = program?.name;

    const showSearchLink = isTracker && (
        accessLevel === ProgramAccessLevels.OPEN ||
        accessLevel === ProgramAccessLevels.AUDITED
    );

    const captureScopeLabel = useMemo(() => (isTracker
        ? i18n.t('Or see all records in your capture scope in {{program}}', {
            program: programName,
            interpolation: { escapeValue: false },
        })
        : i18n.t('Or see all events in your capture scope in {{program}}', {
            program: programName,
            interpolation: { escapeValue: false },
        })
    ), [programName, isTracker]);

    const onNavigateToSearch = useCallback(
        () => navigate(`/search?${buildUrlQueryString({ programId })}`),
        [navigate, programId],
    );

    return (
        <div
            className={classes.incompleteMessageContainer}
            data-test={'without-orgunit-selected-message'}
        >
            <IncompleteSelectionsMessage>
                <div className={classes.incompleteMessageContent}>
                    <span>{i18n.t('Please select an organisation unit.')}</span>
                    <button
                        className={classes.incompleteMessageButton}
                        onClick={() => setShowAccessible()}
                        data-test={'show-accessible-button'}
                    >{captureScopeLabel}</button>
                    {showSearchLink && (
                        <button
                            className={`${classes.incompleteMessageButton} ${classes.searchLinkButton}`}
                            onClick={onNavigateToSearch}
                            data-test={'go-to-search-button'}
                        >
                            {i18n.t('Or go to search to find records outside your capture scope')}
                        </button>
                    )}
                </div>
            </IncompleteSelectionsMessage>
        </div>
    );
};

export const WithoutOrgUnitSelectedMessage = withStyles(styles)(WithoutOrgUnitSelectedMessagePlain);
