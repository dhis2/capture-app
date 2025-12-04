import React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import { ComposedProgramSelector } from './ComposedProgramSelector.component';
import type { ProgramSelectorProps } from './ProgramSelector.types';

const getStyles = () => ({
    programLabel: {
        paddingTop: '10px',
        '@media (max-width: 523px)': {
            paddingTop: '0px !important',
        },
    },
});

type Props = ProgramSelectorProps & WithStyles<typeof getStyles>;

class ProgramSelectorPlain extends React.Component<Props> {
    static baseComponentStyles = {
        labelContainerStyle: {
            flexBasis: 200,
        },
        inputContainerStyle: {
            flexBasis: 150,
        },
    };

    render() {
        const { classes, ...passOnProps } = this.props;
        return (
            <ComposedProgramSelector
                dataTest="relationship-register-tei-program-selector"
                styles={ProgramSelectorPlain.baseComponentStyles}
                programLabelClass={classes.programLabel}
                label={i18n.t('Program')}
                {...passOnProps}
            />
        );
    }
}

export const ProgramSelectorComponent = withStyles(getStyles)(ProgramSelectorPlain);
