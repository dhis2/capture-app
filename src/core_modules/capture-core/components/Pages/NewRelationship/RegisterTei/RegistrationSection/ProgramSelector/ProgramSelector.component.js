// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import ComposedProgramSelector from './ComposedProgramSelector.component';

const getStyles = (theme: Theme) => ({
    programLabel: {
        paddingTop: '10px',
        [theme.breakpoints.down(523)]: {
            paddingTop: '0px !important',
        },
    },
});

type Props = {
    classes: Object,
};

class ProgramSelector extends React.Component<Props> {
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
                styles={ProgramSelector.baseComponentStyles}
                programLabelClass={classes.programLabel}
                label={i18n.t('Program')}
                {...passOnProps}
            />
        );
    }
}
// $FlowFixMe
export default withStyles(getStyles)(ProgramSelector);
