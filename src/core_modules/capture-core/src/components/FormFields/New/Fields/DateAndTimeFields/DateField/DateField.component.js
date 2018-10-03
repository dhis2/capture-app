// @flow
import * as React from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import D2Date from '../../../../d2UiReactAdapters/DateAndTimeFields/DateField/D2Date.component';
import getCalendarTheme from '../getCalendarTheme';

const getStyles = (theme: Theme) => ({
    inputWrapperFocused: {
        border: `2px solid ${theme.palette.accent.dark}`,
        borderRadius: '5px',
    },
    inputWrapperUnfocused: {
        padding: 2,
    },
    innerInputError: {
        color: theme.palette.error.main,
        padding: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(12),
    },
    innerInputWarning: {
        color: theme.palette.warning.dark,
        padding: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(12),
    },
    innerInputInfo: {
        color: 'green',
        padding: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(12),
    },
    innerInputValidating: {
        color: 'orange',
        padding: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(12),
    },
});

type Props = {
    theme: Object,
}

class DateField extends React.Component<Props, State> {
    calendarTheme: Object;

    constructor(props) {
        super(props);
        this.calendarTheme = getCalendarTheme(this.props.theme);
    }
    render() {
        const { theme, ...passOnProps } = this.props;
        return (
            <D2Date
                calendarTheme={this.calendarTheme}
                {...passOnProps}
            />
        );
    }
}

export default withTheme()(withStyles(getStyles)(DateField));
