// @flow
import * as React from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { DateTimeField as UIDateTimeField } from 'capture-ui';
import { withCalendarProps } from '../../../HOC/withCalendarProps';

const getStyles = (theme: Theme) => ({
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

class DateTimeFieldPlain extends React.Component<Props> {
    render() {
        const { ...passOnProps } = this.props;
        return (
            <UIDateTimeField
                {...passOnProps}
            />
        );
    }
}

export const DateTimeField = withTheme()(withCalendarProps()(withStyles(getStyles)(DateTimeFieldPlain)));
