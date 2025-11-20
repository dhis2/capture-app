import * as React from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';

import i18n from '@dhis2/d2-i18n';
import { ComposedProgramSelector } from './ComposedProgramSelector.component';

const getStyles = (theme: any) => ({
    programLabel: {
        paddingTop: '10px',
        [theme.breakpoints.down(523)]: {
            paddingTop: '0px !important',
        },
    },
});

type Props = WithStyles<typeof getStyles>;

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
                styles={ProgramSelectorPlain.baseComponentStyles}
                programLabelClass={classes.programLabel}
                label={i18n.t('Program')}
                {...passOnProps as any}
            />
        );
    }
}
export const ProgramSelectorComponent = withStyles(getStyles)(ProgramSelectorPlain);
