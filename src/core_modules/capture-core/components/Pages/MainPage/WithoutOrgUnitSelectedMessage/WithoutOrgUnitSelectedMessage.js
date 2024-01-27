// @flow
import React, { useMemo } from 'react';
import { colors } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { IncompleteSelectionsMessage } from '../../../IncompleteSelectionsMessage';
import { programTypes } from '../../../../metaData';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';

const styles = {
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
};

type Props = {|
    programId: string,
    setShowAccessible: () => void,
    ...CssClasses,
|}

const WithoutOrgUnitSelectedMessagePlain = ({ programId, setShowAccessible, classes }: Props) => {
    // TODO - this hook breaks the app when the program is not found
    const { program, programType } = useProgramInfo(programId);
    const IncompleteSelectionMessage = useMemo(() => (programType === programTypes.TRACKER_PROGRAM ? (
        i18n.t('Or see all records accessible to you in {{program}} ', {
            program: program.name,
            interpolation: { escapeValue: false },
        })
    ) : i18n.t('Or see all events accessible to you in {{program}}',
        { program: program.name, interpolation: { escapeValue: false } })),
    [program.name, programType]);

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
                    >{IncompleteSelectionMessage}</button>
                </div>
            </IncompleteSelectionsMessage>
        </div>
    );
};

export const WithoutOrgUnitSelectedMessage = withStyles(styles)(WithoutOrgUnitSelectedMessagePlain);
